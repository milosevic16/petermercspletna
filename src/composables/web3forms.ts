import type { Tracker } from './tracker'

// Web3Forms contact-form submitter. The access key ships in the client bundle
// (that's how Web3Forms works — the browser POSTs directly), so it's read from
// import.meta.env.VITE_WEB3FORMS_KEY: kept out of the committed repo (.env.local
// / Netlify env var) and out of Netlify's secret-scan flags (see netlify.toml).
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY

export interface Web3FormStrings {
  sending: string
  success: string
  error: string
  invalid: string
}

export interface Web3FormOpts {
  /** Selector for the <form>. */
  root: string
  /** Email subject — a string, or built from the collected fields (kept English). */
  subject: string | ((fields: Record<string, string>) => string)
  /** A `page` label sent alongside, so the owner knows which form/site it came from. */
  page?: string
  /** Localized status-line strings (from the page's content module). */
  strings: Web3FormStrings
  /** Localized copy for the hCaptcha row this injects into the form card. */
  captcha: { label: string; required: string }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// hCaptcha through Web3Forms' zero-config integration: this shared site key
// needs no hCaptcha account, and Web3Forms verifies the token server-side when
// the body carries `h-captcha-response`. Their drop-in `data-captcha` recipe
// only covers native form POSTs — this form submits with fetch, so the widget
// is rendered and read by hand below.
const HCAPTCHA_SITEKEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2'
const HCAPTCHA_SRC = 'https://js.hcaptcha.com/1/api.js?render=explicit'

interface HCaptchaApi {
  render: (container: HTMLElement, params: Record<string, unknown>) => string
  getResponse: (id?: string) => string
  reset: (id?: string) => void
  remove?: (id?: string) => void
}

declare global {
  interface Window {
    hcaptcha?: HCaptchaApi
  }
}

// One script tag for the document's lifetime: the view remounts on every locale
// switch and would otherwise stack copies. Resolves null when the script cannot
// load, which leaves the form submitting exactly as it did before — a captcha
// that fails to arrive must not lock real people out of the only contact route.
let hcaptchaLoad: Promise<HCaptchaApi | null> | null = null
function loadHcaptcha(): Promise<HCaptchaApi | null> {
  if (hcaptchaLoad) return hcaptchaLoad
  hcaptchaLoad = new Promise((resolve) => {
    if (window.hcaptcha) {
      resolve(window.hcaptcha)
      return
    }
    const s = document.createElement('script')
    s.src = HCAPTCHA_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve(window.hcaptcha ?? null)
    s.onerror = () => resolve(null)
    document.head.appendChild(s)
  })
  return hcaptchaLoad
}

// Wire a form to Web3Forms. Called once at the end of a view's initEffects with
// the shared tracker, so the submit listener tears down on route change.
export function wireWeb3Form(fx: Tracker, opts: Web3FormOpts): void {
  const form = document.querySelector<HTMLFormElement>(opts.root)
  if (!form) return
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]')
  const status = form.querySelector<HTMLElement>('.js-form-status')
  const btnIdle = btn ? btn.textContent ?? '' : ''

  const setStatus = (msg: string, kind: 'info' | 'success' | 'error') => {
    if (!status) return
    status.textContent = msg
    status.style.color = kind === 'error' ? '#E8A39C' : kind === 'success' ? 'var(--ivory)' : '#B4AEA1'
  }

  const collect = (): Record<string, string> => {
    const data: Record<string, string> = {}
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[name]').forEach((el) => {
      // Checkboxes/radios report a constant `.value` ("on") even when unchecked,
      // so serialize them by `.checked` — otherwise the hidden honeypot checkbox
      // always reads as filled and every real submission gets dropped as a bot.
      if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
        if (el.checked) data[el.name] = el.value
      } else {
        data[el.name] = el.value
      }
    })
    return data
  }

  // --- hCaptcha -----------------------------------------------------------
  // Built here rather than in the template so the prerendered HTML carries no
  // widget: nothing to hydrate, and no orphaned row if the script never loads.
  let widgetId: string | null = null
  let prompted = false
  let disposed = false
  fx.onDispose(() => {
    disposed = true
    if (widgetId !== null && window.hcaptcha?.remove) {
      // The iframe usually goes with the unmounted view; remove() is best-effort.
      try { window.hcaptcha.remove(widgetId) } catch { /* already gone */ }
    }
    widgetId = null
  })

  const card = form.querySelector<HTMLElement>('#cf-card')
  if (card) {
    loadHcaptcha().then((hcaptcha) => {
      if (!hcaptcha || disposed || !form.isConnected) return
      const row = document.createElement('div')
      row.className = 'pm-captcha'
      const label = document.createElement('span')
      label.className = 'pm-captcha-label'
      label.textContent = opts.captcha.label
      const box = document.createElement('div')
      box.className = 'pm-captcha-box'
      row.append(label, box)
      card.appendChild(row)
      try {
        widgetId = hcaptcha.render(box, {
          sitekey: HCAPTCHA_SITEKEY,
          theme: 'dark',
          size: 'normal',
          // Clear the nag as soon as it is solved, but leave any other status be.
          callback: () => {
            if (!prompted) return
            prompted = false
            setStatus('', 'info')
          },
        })
        row.classList.add('is-live')
      } catch (err) {
        row.remove()
        console.warn('[web3forms] hCaptcha failed to render — submitting without it.', err)
      }
    })
  }

  fx.on(form, 'submit', ((e: Event) => {
    e.preventDefault()
    if (form.dataset.sending) return
    const data = collect()

    // Honeypot: bots fill the hidden botcheck field — drop silently.
    if (data.botcheck) return

    // Validate before posting.
    if (!data.name?.trim() || !EMAIL_RE.test((data.email ?? '').trim()) || !data.message?.trim()) {
      setStatus(opts.strings.invalid, 'error')
      return
    }
    if (!WEB3FORMS_KEY) {
      setStatus(opts.strings.error, 'error')
      console.error(
        '[web3forms] VITE_WEB3FORMS_KEY is missing from this build — nothing was sent. ' +
        'It is read at build time, so set it in Netlify → Site settings → Environment ' +
        'variables and redeploy (a local .env.local only fixes local dev).',
      )
      return
    }

    // Only gate on the captcha when a widget actually rendered — if the script
    // never loaded there is nothing to solve and the form behaves as before.
    let captchaToken = ''
    if (widgetId !== null) {
      captchaToken = window.hcaptcha?.getResponse(widgetId) ?? ''
      if (!captchaToken) {
        prompted = true
        setStatus(opts.captcha.required, 'error')
        return
      }
    }

    form.dataset.sending = '1'
    if (btn) { btn.disabled = true; btn.textContent = opts.strings.sending }
    setStatus(opts.strings.sending, 'info')

    const subject = typeof opts.subject === 'function' ? opts.subject(data) : opts.subject
    const payload: Record<string, string> = {
      access_key: WEB3FORMS_KEY,
      subject,
      from_name: data.name,
      replyto: data.email,
      name: data.name,
      email: data.email,
      topic: data.topic ?? '',
      message: data.message,
      page: opts.page ?? window.location.href,
    }
    if (captchaToken) payload['h-captcha-response'] = captchaToken

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json().then((json: unknown) => ({ status: r.status, json })))
      .then(({ status: httpStatus, json }) => {
        const body = (json ?? {}) as { success?: boolean; message?: string }
        if (body.success) {
          setStatus(opts.strings.success, 'success')
          form.reset()
        } else {
          setStatus(opts.strings.error, 'error')
          // The visitor gets the generic line, but the reason has to be
          // recoverable from the console — Web3Forms says why it refused
          // (bad access key, failed captcha, rate limit) in `message`.
          console.error(
            '[web3forms] submission refused (HTTP ' + httpStatus + '):',
            body.message ?? json,
          )
        }
      })
      .catch((err) => {
        setStatus(opts.strings.error, 'error')
        console.error('[web3forms] request failed before a reply came back:', err)
      })
      .finally(() => {
        delete form.dataset.sending
        if (btn) { btn.disabled = false; btn.textContent = btnIdle }
        // A token is single-use once Web3Forms redeems it, and form.reset()
        // only empties the response field, not the widget — so reset on every
        // outcome, otherwise a retry after an error posts a spent token.
        if (widgetId !== null) {
          try { window.hcaptcha?.reset(widgetId) } catch { /* widget torn down */ }
        }
      })
  }) as EventListener)
}
