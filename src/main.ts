import { ViteSSG } from 'vite-ssg'
import type { Router } from 'vue-router'
import App from './App.vue'
import { routes, scrollBehavior } from './router'
import { locale, markLangSwitch, type Locale } from './i18n/locale'
import { cancelLanguageRetype } from './composables/retype'

import './styles/fonts.css'
import './styles/base.css'
import './index.css'

// SSG entry. ViteSSG owns the app + router creation (memory history at build,
// web history in the browser) and renders every route to static HTML at build
// time, so crawlers and AI/LLM retrieval get the full page from the server —
// not an empty `<div id="app">`. The client then hydrates the same markup.
export const createApp = ViteSSG(App, { routes, scrollBehavior }, ({ router, isClient }) => {
  // Keep the locale ref in lockstep with the route BEFORE the view renders, so
  // usePageContent/useHead resolve the right language on each navigation — on
  // the server (per-route SSG render) and in the browser alike.
  router.beforeEach((to, from) => {
    const l = (to.meta.locale as Locale | undefined) ?? 'en'
    if (locale.value !== l) {
      // Cancel a still-running retype BEFORE the ref flips: it restores the
      // captured strings while they still match the on-screen language, so the
      // chrome's reactive re-render patches over clean text.
      cancelLanguageRetype()
      if (from.matched.length > 0) markLangSwitch() // in-app switch, not initial load
      locale.value = l
    }
  })

  if (isClient) liftBootVeil(router)
})

// Lift the boot veil (the inline intro overlay in index.html) once the app is
// genuinely ready — initial route resolved (incl. the lazy view chunk), fonts
// settled, visible hero portrait decoded — so the reveal is one clean paint
// instead of staged pop-in. Every wait is time-capped: the veil can never hang.
function liftBootVeil(router: Router): void {
  const boot = document.getElementById('boot')
  if (!boot) return
  const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))
  const capped = (p: Promise<unknown>, ms: number) => Promise.race([p.catch(() => undefined), wait(ms)])
  void Promise.all([
    router.isReady().catch(() => undefined),
    capped(document.fonts.ready, 3500),
    wait(1650), // minimum showing, so the map draw-in reads as intentional
  ]).then(async () => {
    const hero = Array.from(document.querySelectorAll<HTMLImageElement>('#hero img')).find(
      (i) => i.offsetParent !== null,
    )
    if (hero) await capped(hero.decode(), 2000)
    // replay the page-entry rise underneath the lifting veil
    const main = document.getElementById('main')
    if (main && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      main.style.animation = 'none'
      void main.offsetWidth
      main.style.animation = ''
    }
    // The user can't scroll while the veil locks the page, so any non-zero
    // position here is a stray restore (browser or router) — reveal at the
    // top unless a hash deep link owns the position.
    if (!window.location.hash && window.scrollY > 0) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
    document.documentElement.classList.remove('pm-booting')
    window.setTimeout(() => boot.remove(), 1400) // after the exit transition
  })
}
