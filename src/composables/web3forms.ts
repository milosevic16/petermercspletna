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
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
      data[el.name] = el.value
    })
    return data
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
      console.warn('[web3forms] VITE_WEB3FORMS_KEY is not set — cannot submit.')
      return
    }

    form.dataset.sending = '1'
    if (btn) { btn.disabled = true; btn.textContent = opts.strings.sending }
    setStatus(opts.strings.sending, 'info')

    const subject = typeof opts.subject === 'function' ? opts.subject(data) : opts.subject
    const payload = {
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

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((json: { success?: boolean }) => {
        if (json && json.success) {
          setStatus(opts.strings.success, 'success')
          form.reset()
        } else {
          setStatus(opts.strings.error, 'error')
        }
      })
      .catch(() => setStatus(opts.strings.error, 'error'))
      .finally(() => {
        delete form.dataset.sending
        if (btn) { btn.disabled = false; btn.textContent = btnIdle }
      })
  }) as EventListener)
}
