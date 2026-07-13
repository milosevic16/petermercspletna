import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

import './styles/fonts.css'
import './styles/base.css'
import './index.css'

createApp(App).use(router).mount('#app')

// Lift the boot veil (the inline intro overlay in index.html) once the app is
// genuinely ready — initial route resolved (incl. the lazy view chunk), fonts
// settled, visible hero portrait decoded — so the reveal is one clean paint
// instead of staged pop-in. Every wait is time-capped: the veil can never hang.
const boot = document.getElementById('boot')
if (boot) {
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
