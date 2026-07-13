import { onMounted, onUnmounted, type Ref } from 'vue'

// Reproduces the page-builder's `style-hover` / `style-focus` inline pseudo-state
// attributes (emitted by the extractor as data-hover / data-focus) for CHROME
// components. The extra declarations are appended to the element's cssText on
// enter/focus and reverted on leave/blur. View markup gets the same treatment
// from its effects file (__wire); this covers the persistent chrome so its hover
// states don't depend on the view lifecycle.
export function useInlineStates(root: Ref<HTMLElement | null>): void {
  const cleanups: Array<() => void> = []
  const bases = new WeakMap<HTMLElement, string>()

  function wire(el: HTMLElement, extra: string, onEv: string, offEv: string) {
    const on = () => { bases.set(el, el.style.cssText); el.style.cssText = el.style.cssText + ';' + extra }
    const off = () => { const b = bases.get(el); if (b != null) el.style.cssText = b }
    el.addEventListener(onEv, on)
    el.addEventListener(offEv, off)
    cleanups.push(() => { el.removeEventListener(onEv, on); el.removeEventListener(offEv, off) })
  }

  onMounted(() => {
    const host = root.value
    if (!host) return
    const consider = (el: HTMLElement) => {
      const hov = el.getAttribute('data-hover')
      if (hov != null) wire(el, hov, 'mouseenter', 'mouseleave')
      const foc = el.getAttribute('data-focus')
      if (foc != null) wire(el, foc, 'focus', 'blur')
    }
    consider(host) // the host itself may carry the attrs (e.g. the skip link)
    host.querySelectorAll<HTMLElement>('[data-hover], [data-focus]').forEach(consider)
  })

  onUnmounted(() => { cleanups.forEach((f) => f()); cleanups.length = 0 })
}
