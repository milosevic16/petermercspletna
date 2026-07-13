import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { Component } from 'vue'
import { pages } from './pages'

// Lazy view modules, resolved to their default export so each is a valid
// `() => Promise<Component>` route loader.
const views = import.meta.glob<Component>('./views/*.vue', { import: 'default' })

const routes: RouteRecordRaw[] = pages.map((p) => ({
  path: '/' + p.slug,
  name: p.name,
  component: views[`./views/${p.name}.vue`],
  meta: { title: p.title, description: p.description },
}))
// Unknown paths fall back to home.
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
  scrollBehavior(to, _from, savedPosition) {
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
    if (savedPosition) return savedPosition
    // Instant overrides the global `scroll-behavior: smooth` on route change.
    return { top: 0, behavior: 'instant' }
  },
})
