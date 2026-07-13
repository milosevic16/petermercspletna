// Language-switch transition: rapidly "re-types" the visible text in the new
// language (same ▌ caret aesthetic as the briefs' typeout animation). Runs on
// the document's FIRST viewport — the locale switch scrolls to top, and
// measurement may happen before that scroll applies — walking #pm-root so the
// persistent chrome (masthead nav) sweeps together with the remounted view.
// Time-based (not frame-count), finishes in ~0.65s; skipped for
// prefers-reduced-motion and hidden tabs (rAF is suspended there, which would
// leave the page blanked mid-sweep).

interface RetypeNode {
  node: Text
  full: string
  top: number
}

let cancelCurrent: (() => void) | null = null

// Cancel an in-flight sweep, restoring the full strings it captured. Called
// before the locale ref flips (router guard), so the restored text is still
// the on-screen language and Vue's subsequent re-render patches cleanly.
export function cancelLanguageRetype(): void {
  if (cancelCurrent) cancelCurrent()
}

export function runLanguageRetype(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (document.hidden) return
  cancelLanguageRetype()
  const root = document.getElementById('pm-root')
  if (!root) return
  const vh = window.innerHeight || 800
  const sy = window.scrollY || 0

  const nodes: RetypeNode[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const v = n.nodeValue
      if (!v || !v.trim()) return NodeFilter.FILTER_REJECT
      const el = n.parentElement
      if (!el || el.closest('[data-no-retype]')) return NodeFilter.FILTER_REJECT
      const r = el.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) return NodeFilter.FILTER_REJECT
      // keep only what sits in the document's first viewport
      if (r.top + sy > vh || r.bottom + sy < 0) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  let tn: Node | null
  while ((tn = walker.nextNode())) {
    const text = tn as Text
    const el = text.parentElement
    if (!el) continue
    nodes.push({ node: text, full: text.nodeValue ?? '', top: el.getBoundingClientRect().top + sy })
    if (nodes.length >= 40) break
  }
  if (!nodes.length) return
  nodes.sort((a, b) => a.top - b.top)
  nodes.forEach((n) => { n.node.nodeValue = '' })

  const STAGGER = 13.5 // ms between node starts, top-to-bottom
  const SPEED = 0.185 // chars per ms (time-based: throttled frames still finish)
  const t0 = performance.now()
  let raf = 0
  const tick = (now: number) => {
    const dt = now - t0
    let done = true
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i]
      const local = dt - i * STAGGER
      if (local <= 0) { done = false; continue }
      const count = Math.floor(local * SPEED)
      if (count >= n.full.length) {
        if (n.node.nodeValue !== n.full) n.node.nodeValue = n.full
      } else {
        done = false
        n.node.nodeValue = n.full.slice(0, Math.max(0, count)) + '▌'
      }
    }
    if (!done) {
      raf = window.requestAnimationFrame(tick)
    } else {
      cancelCurrent = null
    }
  }
  raf = window.requestAnimationFrame(tick)
  cancelCurrent = () => {
    window.cancelAnimationFrame(raf)
    nodes.forEach((n) => { n.node.nodeValue = n.full })
    cancelCurrent = null
  }
}
