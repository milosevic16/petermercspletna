import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { Component } from 'vue'
import { pages } from './pages'
import { locale, localePath, LOCALES, markLangSwitch, type Locale } from './i18n/locale'
import { cancelLanguageRetype } from './composables/retype'

// Lazy view modules, resolved to their default export so each is a valid
// `() => Promise<Component>` route loader.
const views = import.meta.glob<Component>('./views/*.vue', { import: 'default' })

// Routes are page × locale: English unprefixed ('/'), Slovenian under '/sl'.
// Head meta (title/description) comes from the content modules via useHead,
// not from route meta.
const routes: RouteRecordRaw[] = LOCALES.flatMap((l: Locale) =>
  pages.map((p) => ({
    path: localePath(l) + (p.slug ? (l === 'en' ? '' : '/') + p.slug : ''),
    name: `${p.name}.${l}`,
    component: views[`./views/${p.name}.vue`],
    meta: { locale: l },
  })),
)
// Unknown paths fall back to the locale's home.
routes.push({ path: '/sl/:pathMatch(.*)*', redirect: '/sl' })
routes.push({ path: '/:pathMatch(.*)*', redirect: '/' })

// Offset for a fixed/sticky masthead; 0 when it scrolls with the page (this site).
function headerOffset(): number {
  const h = document.getElementById('site-head')
  if (!h) return 0
  const pos = getComputedStyle(h).position
  return pos === 'fixed' || pos === 'sticky' ? h.offsetHeight : 0
}

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      // Poll (not rAF — background tabs throttle it) until the target exists,
      // the header spacer (if any) has laid out, and fonts have loaded, so the
      // measured offset is stable before we scroll.
      return new Promise((resolve) => {
        let tries = 0
        const poll = () => {
          const el = document.querySelector(to.hash)
          const spacer = document.getElementById('site-head-spacer')
          const fontsReady = !document.fonts || document.fonts.status === 'loaded'
          if (el && (!spacer || spacer.offsetHeight > 0) && fontsReady) {
            resolve({ el: to.hash, top: headerOffset() + 12, behavior: 'smooth' })
          } else if (tries++ < 40) {
            window.setTimeout(poll, 50)
          } else {
            resolve({ el: to.hash, top: headerOffset() + 12, behavior: 'smooth' })
          }
        }
        poll()
      })
    }
    // Initial navigation (page load / reload): vue-router passes the pre-reload
    // position from history.state.scroll as savedPosition — restoring it would
    // reveal the boot veil onto the middle of the page. An intro site always
    // starts at the top; only in-app back/forward keeps savedPosition.
    const isInitialNavigation = from.matched.length === 0
    if (savedPosition && !isInitialNavigation) return savedPosition
    // Instant overrides the global `scroll-behavior: smooth` on route change.
    return { top: 0, behavior: 'instant' }
  },
})

// Keep the locale ref in lockstep with the route BEFORE the view renders, so
// usePageContent/useHead resolve the right language on each navigation.
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
