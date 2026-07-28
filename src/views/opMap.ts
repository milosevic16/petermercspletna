// Operating map — a zoomable radial drill-down graph, built client-side on top
// of the server-rendered fallback list (which carries the SEO content). One
// fixed radial layout: PM hub at centre, categories around it, each branch
// fanning outward; focusing a node glides the camera outward along the spoke
// while the spine back to PM stays faintly drawn. Runs in onMounted only.
//
// RENDERER: a single <canvas>, not SVG. On iPhone WebKit the SVG version could
// never be smooth: Safari's shipping (legacy) SVG engine cannot composite inner
// SVG elements, so panning either repainted the whole SVG per frame (chop) or —
// with the svg promoted to a compositor layer — rasterized it lazily in tiles,
// which showed up as background-coloured squares chasing the finger
// (checkerboarding). A canvas draws the complete scene synchronously every
// frame (~30 dots + labels — trivial), so there is nothing to tile, defer, or
// "load in". The draw loop only runs while something animates; a static scene
// costs nothing. HTML overlays (dossier, back button) are plain DOM.

export interface OpMapNode {
  key: string
  label: string
  name?: string
  desc: string
  href?: string
  children?: OpMapNode[]
}
export interface OpMapContent {
  hub: { label: string; name: string; desc: string; href: string }
  tree: OpMapNode[]
  visit: string
  backLabel: string
  coach?: string
  exit?: string
}

const NODE_FILL = '#5C5850' // warm grey — reads grey on graphite, not black
const NODE_STROKE = '#948E81'
const BRANCH_STROKE = '#B4AEA1'
const IVORY = '#ECE7DC'
const CAT_LBL = '#D6C9A9'
const LEAF_LBL = '#C7C1B4'
const SANS = '"Instrument Sans", Arial, sans-serif'
const SERIF = '"Spectral", Georgia, serif'

export function initOpMap(container: HTMLElement, content: OpMapContent): () => void {
  const reduced = (() => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { return false } })()
  // NOT (max-width:740) rather than (min-width:741): fractional widths in the
  // open interval (740,741) match neither query, and the scroll engine must
  // agree with the CSS mobile block about which world it is in.
  const isDesktop = () => { try { return !window.matchMedia('(max-width: 740px)').matches } catch { return true } }
  const ACCENT = (() => { try { return getComputedStyle(container).getPropertyValue('--accent').trim() || '#D2453E' } catch { return '#D2453E' } })()

  // ---- flatten tree + fixed radial layout ---------------------------------
  type N = { key: string; label: string; name: string; desc: string; href: string; depth: number; x: number; y: number; parent: string | null; kids: string[]; leaf: boolean }
  const byId: Record<string, N> = {}
  const R = [0, 200, 380, 520]
  const rd = (d: number) => ((d - 90) * Math.PI) / 180
  const hubNode: OpMapNode = { key: 'pm', label: content.hub.label, name: content.hub.name, desc: content.hub.desc, href: content.hub.href, children: content.tree }
  // Farthest node from centre (~R[3]=520) + margin; clamps mobile drag-pan so the
  // graph can be explored past the current fit but never dragged fully off-screen.
  let GEXT = 0
  let laidOutDesktop: boolean | null = null
  // The fan is WIDER on phones. Sibling titles there are pinned to a constant px
  // size while the camera pulls back to fit them, so at the desktop fan (±26°)
  // the longest names in a five-child branch overlapped — and the de-clutter pass
  // can't rescue that, since it never hides an active title. Spreading the arc
  // spends vertical room the phone fit has going spare (these branches are
  // width-bound), and stops short of the 72° between categories so neighbouring
  // branches still don't run into each other.
  function buildLayout(desktop: boolean) {
    // 30 is the widest the phone fan can go: neighbouring categories sit 72
    // apart, and at 33 the outer children of adjacent branches closed to 40
    // units when their dots need 52 — five pairs visibly touched.
    const FAN: Record<number, number> = desktop ? { 1: 26, 2: 14 } : { 1: 30, 2: 18 }
    const place = (node: OpMapNode, depth: number, angle: number, parent: string | null) => {
      const kids = node.children || []
      byId[node.key] = {
        key: node.key, label: node.label, name: node.name || node.label, desc: node.desc, href: node.href || '',
        depth, parent, kids: kids.map((k) => k.key), leaf: kids.length === 0,
        x: depth === 0 ? 0 : R[depth] * Math.cos(rd(angle)), y: depth === 0 ? 0 : R[depth] * Math.sin(rd(angle)),
      }
      if (depth === 0) kids.forEach((k, i) => place(k, 1, -90 + i * (360 / kids.length), node.key))
      else { const h = FAN[depth] || 12, n = kids.length; kids.forEach((k, i) => place(k, depth + 1, n === 1 ? angle : angle - h + (2 * h * i) / (n - 1), node.key)) }
    }
    place(hubNode, 0, 0, null)
    GEXT = Math.max(0, ...Object.values(byId).map((n) => Math.max(Math.abs(n.x), Math.abs(n.y)))) + 60
    laidOutDesktop = desktop
  }
  buildLayout(isDesktop())
  const ORDER = Object.keys(byId) // stable draw / a11y order

  function ancestors(id: string) { const a: string[] = []; let c: string | null = id; while (c) { a.unshift(c); c = byId[c].parent } return a }

  // ---- build DOM ----------------------------------------------------------
  container.innerHTML = ''
  container.classList.add('op-live')
  const h = (t: string, cls?: string) => { const e = document.createElement(t); if (cls) e.className = cls; return e }

  const canvas = h('canvas') as HTMLCanvasElement
  canvas.id = 'op-canvas'
  canvas.setAttribute('role', 'application')
  canvas.setAttribute('aria-label', content.hub.name + ' — operating map')
  container.appendChild(canvas)
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const dpr = Math.min(window.devicePixelRatio || 1, 3)

  // Keyboard/screen-reader layer: one visually-hidden button per node (canvas
  // pixels carry no semantics). Focusing a button draws the accent focus ring on
  // the canvas; Enter/Space activate natively as clicks.
  const a11y = h('div', 'op-a11y')
  const a11yBtn: Record<string, HTMLButtonElement> = {}
  ORDER.forEach((id) => {
    const b = h('button') as HTMLButtonElement
    b.type = 'button'; b.setAttribute('aria-label', byId[id].name); b.hidden = true
    b.addEventListener('click', () => onNodeClick(id))
    b.addEventListener('focus', () => { focusRingId = (b.matches(':focus-visible') ? id : null); requestDraw() })
    b.addEventListener('blur', () => { if (focusRingId === id) { focusRingId = null; requestDraw() } })
    a11y.appendChild(b); a11yBtn[id] = b
  })
  container.appendChild(a11y)

  // overlays (HTML)
  const pmback = h('button', 'op-back') as HTMLButtonElement; pmback.type = 'button'; pmback.hidden = true
  // Two faces, one control. Off-fullscreen it is the hub shortcut it always was
  // (PM disc + "back to top"); while immersed it BECOMES the exit — same
  // position, but an X and the close label, because there its job is leaving the
  // map, not walking the graph. syncBack() swaps the face and the aria-label.
  pmback.innerHTML =
    '<span class="op-back-disc" aria-hidden="true">PM</span><span class="op-back-txt"></span>'
    + '<svg class="op-back-x" viewBox="0 0 14 14" width="12" height="12" aria-hidden="true">'
    +   '<path d="M2 2 L12 12 M12 2 L2 12" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>'
    + '</svg><span class="op-back-exit-txt"></span>'
  ;(pmback.querySelector('.op-back-txt') as HTMLElement).textContent = content.backLabel
  ;(pmback.querySelector('.op-back-exit-txt') as HTMLElement).textContent = content.exit || 'Close'
  const dossier = h('aside', 'op-dossier'); dossier.setAttribute('aria-live', 'polite')
  // The arrow is an inline SVG, not "\u2197": that codepoint has emoji
  // presentation by default on iOS, so the link rendered with a colour
  // emoji arrow instead of a hairline glyph in the text's own colour.
  dossier.innerHTML =
    '<div class="op-dossier-in">'
    + '<h3 class="op-d-name"></h3><p class="op-d-desc"></p>'
    + '<a class="op-d-visit" target="_blank" rel="noopener" hidden>'
    +   '<span class="op-d-visit-txt"></span>'
    +   '<svg class="op-d-visit-arw" viewBox="0 0 12 12" aria-hidden="true">'
    +     '<path d="M3.4 8.6 L8.6 3.4 M5 3.4 H8.6 V7" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>'
    +   '</svg>'
    + '</a>'
    + '</div>'
  // Coach hint: a pill that appears once the fullscreen zoom has landed and
  // fades out a few seconds later (or the moment you touch the map).
  const coachEl = h('div', 'op-coach') as HTMLDivElement
  coachEl.setAttribute('aria-hidden', 'true')
  coachEl.textContent = content.coach || ''
  container.append(pmback, coachEl, dossier)

  // ---- state + camera -----------------------------------------------------
  let focusId = 'pm', selId = 'pm'
  let focusRingId: string | null = null
  let hoverId: string | null = null
  // ---- fullscreen state (mobile only) --------------------------------------
  // Two completely separate states, nothing in between (no scroll coupling):
  //   collapsed  — an inert in-page preview. The page scrolls straight past it;
  //                the ONLY live interaction is a tap on a node, which opens
  //                the overlay. Empty space is dead; scroll never enters.
  //   fullscreen — a position:fixed overlay over the viewport. The page behind
  //                it cannot scroll; the canvas owns the touch stream (pan).
  //                Exit ONLY via the Close button or Escape.
  type FsState = 'collapsed' | 'fullscreen'
  let fsState: FsState = 'collapsed'
  // Auto-open arms ONCE per page load: the first arrival at the section opens
  // the overlay by itself; ANY entry consumes the arm, so after a close the
  // section scrolls past like any other and only a node tap re-opens it.
  let armed = true
  let seenAway = false
  let entering = false // frozen, or mid-zoom: the overlay has not landed yet
  let placeholder: HTMLDivElement | null = null
  let fsAnim: Animation | null = null
  // The entry box-zoom, driven frame-by-frame from the SAME clock and curve
  // as the camera tween (see applyEnterFlip) so box and graph can never
  // desynchronize into a jump.
  let enterFlip: { l: number; t: number; u: number; t0: number; sheetDy: number } | null = null
  // Scrim under the overlay: fades the page to the section's graphite while
  // the box expands, so the box's opaque edge never sweeps across
  // still-bright page text (which read as a glitchy hard cut).
  let scrim: HTMLDivElement | null = null
  let scrimAnim: Animation | null = null
  let fsSafety = 0
  let lastFocused: HTMLElement | null = null
  let lockedY = 0 // scroll offset pinned at lock time, restored at unlock
  let overflowLocked = false
  const rootPrev = { htmlOverflow: '', bodyOverflow: '', htmlOB: '' }
  // World units mirror the old SVG viewBox: height fixed at 760 units, width
  // follows the container aspect so the map FILLS it (a fixed wide box got
  // letterboxed into a portrait phone, shrinking every node to ~5px).
  let VBW = 1040, VBH = 760
  let cssW = 1, cssH = 1
  function updateViewBox() {
    // clientWidth/Height, not getBoundingClientRect: the rect is scaled while the
    // enter/exit FLIP animates the container, which would bake a distorted aspect
    // into the world box if a ResizeObserver re-render lands mid-animation.
    cssW = container.clientWidth || 1
    cssH = container.clientHeight || 1
    VBH = 760
    VBW = Math.max(200, Math.round(VBH * (cssW / cssH)))
    const pw = Math.round(cssW * dpr), ph = Math.round(cssH * dpr)
    if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph }
  }
  const OP = { active: 1, spine: 0.5, hint: 0, context: 0 }
  // Viewport space the HTML overlays occupy, in world units. On mobile the
  // Close pill sits at the top and the dossier is a full-width sheet pinned to
  // the bottom; the camera must fit the graph into what's LEFT, or the lowest
  // nodes land under (and behind) the sheet where taps never reach them.
  // Desktop is already height-bound with no slack, so it gets no insets.
  function insets() {
    // offsetWidth/offsetHeight: untransformed layout boxes, immune to the FLIP.
    const px2u = VBH / (container.clientHeight || 1)
    if (isDesktop()) {
      // The dossier is a bottom-left card. Desktop has no vertical slack (it's
      // height-bound) but lots of horizontal slack, so reserve the card's column
      // on the LEFT (+ a little room on the right for outward labels) and centre
      // the map between them — it slides clear of the card without shrinking.
      const leftPx = dossier.classList.contains('show') ? dossier.offsetWidth + 30 : 0
      return { top: 0, bottom: 0, left: leftPx * px2u, right: (leftPx ? 150 : 0) * px2u }
    }
    // top band: the Close pill (fullscreen) / back button
    const topPx = Math.max(44, pmback.hidden ? 0 : 40)
    const sheetH = dossier.offsetHeight || 170
    // +28 at the bottom so the lowest node's dot clears the sheet (the band
    // centres node CENTRES; the dot extends below its centre). The side margin
    // is small now: these branches are width-bound, the titles themselves are
    // measured into the camera box, and every reserved pixel here is one the
    // graph has to give back in scale.
    const sidePx = 14
    return { top: (topPx + 8) * px2u, bottom: (sheetH + 28) * px2u, left: sidePx * px2u, right: sidePx * px2u }
  }
  // The camera must frame the TITLES, not just the dots. A fixed pad around node
  // centres could not do that on a phone: mobile titles are pinned to a constant
  // CSS px size, so their WORLD width grows as the camera zooms out, and long
  // ones ran off the edge. So the box is the union of the legacy centre+pad box
  // (which keeps desktop framing byte-identical, and can only ever make the box
  // bigger) with the MEASURED label boxes. That is a fixed point — the box
  // depends on the scale, the scale on the box — but a contracting one (ratio ≈
  // labelWidth/availWidth ≈ 0.4), so a few passes settle it.
  const LBL_MARGIN = 8 // world units of air around a measured title
  // Which titles this view actually paints (see lblShow in render): the focus's
  // children everywhere, plus the spine behind it on mobile.
  function paintedLabelIds(id: string, desktop: boolean) {
    const childIds = byId[id].kids
    const ids = desktop ? childIds.slice() : ancestors(id).concat(childIds)
    return ids.filter((nid) => nid !== 'pm' && nid !== id)
  }
  function fitBox(id: string, k: number, wrapW: number, centreAll: boolean) {
    const desktop = isDesktop()
    const path = ancestors(id), childIds = byId[id].kids
    const ids: Record<string, 1> = {}; path.concat(childIds).concat(['pm']).forEach((x) => (ids[x] = 1))
    // Desktop keeps its historic 105-unit pad around node centres (its framing is
    // unchanged). Mobile only needs enough to clear the dot itself (r ≤ 28) plus a
    // little air, because the titles — the thing that used to overflow — are now
    // measured into the box directly instead of being guessed at by padding.
    const pad = desktop ? 105 : 28
    let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity
    const grow = (x0: number, y0: number, x1: number, y1: number) => {
      if (x0 < minx) minx = x0
      if (y0 < miny) miny = y0
      if (x1 > maxx) maxx = x1
      if (y1 > maxy) maxy = y1
    }
    Object.keys(ids).forEach((nid) => {
      const n = byId[nid]
      grow(n.x - pad, n.y - pad, n.x + pad, n.y + pad)
      if (k <= 0 || nid === 'pm' || nid === id) return // hub has no label; focus uses focusName below
      if (desktop && childIds.indexOf(nid) < 0) return
      const b = measureLbl(labelGeom(nid, id, k, desktop, wrapW, centreAll))
      grow(b.x - LBL_MARGIN, b.y - LBL_MARGIN, b.x + b.w + LBL_MARGIN, b.y + b.h + LBL_MARGIN)
    })
    if (k > 0 && id !== 'pm') { // the serif focus title under the focused node
      const f = byId[id]
      const fs = desktop ? 17 : 18 / k
      const y = desktop ? f.y + 38 : f.y + 25 + fs * 0.92 + 5
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.font = `600 ${fs.toFixed(2)}px ${SERIF}`
      const w = ctx.measureText(f.label).width; ctx.restore()
      grow(f.x - w / 2 - LBL_MARGIN, y - fs - LBL_MARGIN, f.x + w / 2 + LBL_MARGIN, y + fs * 0.3 + LBL_MARGIN)
    }
    return { minx, miny, maxx, maxy }
  }
  function fitAt(id: string, k: number, wrapW: number, centreAll: boolean) {
    const b = fitBox(id, k, wrapW, centreAll)
    const bw = b.maxx - b.minx, bh = b.maxy - b.miny // pad is already folded in
    const cx = (b.minx + b.maxx) / 2, cy = (b.miny + b.maxy) / 2
    const ins = insets()
    const availH = Math.max(160, VBH - ins.top - ins.bottom)
    const availW = Math.max(160, VBW - ins.left - ins.right)
    // The mobile floor has to sit below the desktop one: phone titles are pinned
    // to a constant px size, so a wide branch can only be made to fit by pulling
    // the camera back, and a 0.6 floor would clamp before the titles were inside
    // (they got cropped at the edge instead).
    let s = Math.min(availW / bw, availH / bh); s = Math.max(isDesktop() ? 0.6 : 0.38, Math.min(s, 2.6))
    const bandCx = -VBW / 2 + ins.left + availW / 2 // horizontal centre of the free band
    const bandCy = -VBH / 2 + ins.top + availH / 2 // vertical centre of the free band
    return { tx: bandCx - s * cx, ty: bandCy - s * cy, s }
  }
  function fitFor(id: string, wrapW: number, centreAll: boolean) {
    const ppu = Math.min(cssW / VBW, cssH / VBH) || 1
    let out = fitAt(id, 0, wrapW, centreAll) // seed with dots only — label size needs a scale
    for (let i = 0; i < 5; i++) {
      const next = fitAt(id, Math.max(0.05, out.s * ppu), wrapW, centreAll)
      const settled = Math.abs(next.s - out.s) < 0.004
      out = next
      if (settled) break
    }
    return out
  }
  // Do any two painted titles collide at this fit? Boxes are in the shared world
  // space, so an overlap here is exactly an overlap on screen. The de-clutter
  // pass can hide a spine title, but never an ACTIVE one, so a wrap that makes
  // two children's titles touch has to be rejected outright.
  function fitCollides(id: string, s: number, wrapW: number, centreAll: boolean) {
    const desktop = isDesktop()
    const k = Math.max(0.05, s * (Math.min(cssW / VBW, cssH / VBH) || 1))
    const boxes = paintedLabelIds(id, desktop).map((nid) => measureLbl(labelGeom(nid, id, k, desktop, wrapW, centreAll)))
    if (id !== 'pm') { // the serif focus title shares the same space
      const f = byId[id]
      const fs = desktop ? 17 : 18 / k
      const y = desktop ? f.y + 38 : f.y + 25 + fs * 0.92 + 5
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.font = `600 ${fs.toFixed(2)}px ${SERIF}`
      const w = ctx.measureText(f.label).width; ctx.restore()
      boxes.push({ x: f.x - w / 2, y: y - fs, w, h: fs * 1.3 })
    }
    for (let a = 0; a < boxes.length; a++) {
      for (let b = a + 1; b < boxes.length; b++) {
        const A = boxes[a], B = boxes[b]
        if (!(A.x + A.w < B.x || A.x > B.x + B.w || A.y + A.h < B.y || A.y > B.y + B.h)) return true
      }
    }
    return false
  }
  // Wrap width is a lever, not a constant: a narrow wrap makes a title tall and
  // slim, a wide one short and broad. Which is better depends entirely on the
  // branch — the ones that hang sideways are width-bound with most of their
  // height going spare, so slim titles buy real zoom there, while a branch that
  // stacks vertically wants the opposite. Rather than pick one compromise for
  // all of them, try the candidates and keep whichever frames the branch largest
  // without letting two titles touch. Desktop passes a single candidate, so its
  // framing is untouched.
  // Placement is the other lever, and it matters more than the wrap: a title
  // anchored to the SIDE of an outer node adds its full width to the box, while
  // centring it over the node adds only half. Whether centring collides depends
  // on the exact branch, so both modes are candidates and the real boxes decide —
  // far better than the conservative distance heuristic, which rejected layouts
  // that in fact had room.
  const WRAPS = [20, 17, 14, 12]
  let leafWrap = 20      // the winning pair, reused by render() so it draws
  let leafCentre = false // exactly what fit() sized the camera for
  function fit(id: string) {
    if (isDesktop()) { leafWrap = 20; leafCentre = false; return fitFor(id, 20, false) }
    type F = { tx: number; ty: number; s: number }
    let best: F | null = null, bestW = WRAPS[0], bestC = false
    let any: F | null = null, anyW = WRAPS[0], anyC = false
    for (const centreAll of [false, true]) {
      for (const w of WRAPS) {
        const f = fitFor(id, w, centreAll)
        if (!any || f.s > any.s) { any = f; anyW = w; anyC = centreAll }
        if (fitCollides(id, f.s, w, centreAll)) continue
        if (!best || f.s > best.s) { best = f; bestW = w; bestC = centreAll }
      }
    }
    // every candidate collided (a branch too dense for its longest name): take
    // the roomiest framing and let the de-clutter pass sort out what it can.
    leafWrap = best ? bestW : anyW
    leafCentre = best ? bestC : anyC
    return (best || any) as F
  }
  function setDossier(id: string) {
    const n = byId[id]
    ;(dossier.querySelector('.op-d-name') as HTMLElement).textContent = n.name
    ;(dossier.querySelector('.op-d-desc') as HTMLElement).textContent = n.desc
    const v = dossier.querySelector('.op-d-visit') as HTMLAnchorElement
    if (n.href) { v.hidden = false; v.href = n.href; (v.querySelector('.op-d-visit-txt') as HTMLElement).textContent = content.visit } else v.hidden = true
    dossier.classList.add('show')
  }

  // ---- easing -------------------------------------------------------------
  // cubic-bezier solved in JS (Newton + bisection fallback) so canvas-side
  // animations reproduce the exact CSS curves the SVG version used.
  function makeBezier(p1x: number, p1y: number, p2x: number, p2y: number) {
    const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx
    const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by
    const fx = (t: number) => ((ax * t + bx) * t + cx) * t
    const fy = (t: number) => ((ay * t + by) * t + cy) * t
    const dfx = (t: number) => (3 * ax * t + 2 * bx) * t + cx
    return (x: number) => {
      if (x <= 0) return 0
      if (x >= 1) return 1
      let t = x
      for (let i = 0; i < 8; i++) { const e = fx(t) - x; if (Math.abs(e) < 1e-5) return fy(t); const d = dfx(t); if (Math.abs(d) < 1e-6) break; t -= e / d }
      let lo = 0, hi = 1; t = x
      for (let i = 0; i < 24; i++) { const e = fx(t) - x; if (Math.abs(e) < 1e-5) break; if (e > 0) hi = t; else lo = t; t = (lo + hi) / 2 }
      return fy(t)
    }
  }
  const camEase = makeBezier(0.33, 0, 0.2, 1)   // smooth ease-in-out, gentle finish
  const cssEase = makeBezier(0.25, 0.1, 0.25, 1) // CSS 'ease'
  const rEase = makeBezier(0.34, 1.4, 0.6, 1)    // dot-radius pop (slight overshoot)
  const beatEase = makeBezier(0.2, 0.7, 0.2, 1)

  // Tiny tweened-value helper: start(v1) re-aims from the CURRENT value, so
  // interrupted transitions glide seamlessly (matches CSS transition semantics).
  type Tween = { v0: number; v1: number; t0: number; dur: number; ease: (x: number) => number }
  const tw = (v: number): Tween => ({ v0: v, v1: v, t0: 0, dur: 0, ease: cssEase })
  function twCur(a: Tween, now: number) {
    if (a.dur <= 0 || now >= a.t0 + a.dur) return a.v1
    return a.v0 + (a.v1 - a.v0) * a.ease((now - a.t0) / a.dur)
  }
  function twTo(a: Tween, now: number, v1: number, dur: number, ease: (x: number) => number) {
    if (a.v1 === v1) return
    a.v0 = twCur(a, now); a.v1 = v1; a.t0 = now; a.dur = reduced ? 0 : dur; a.ease = ease
  }
  const twActive = (a: Tween, now: number) => a.dur > 0 && now < a.t0 + a.dur

  // ---- camera tween -------------------------------------------------------
  type Cam = { tx: number; ty: number; s: number }
  let cam: Cam = { tx: 0, ty: 0, s: 1 }
  let camFrom: Cam = cam, camTo: Cam = cam
  let camT0 = 0, camActive = false
  const CAM_DUR = 1050 // ms — a slow, smooth zoom
  let camDur = CAM_DUR // per-glide override (the exit recentre runs shorter)
  let panX = 0, panY = 0 // drag-to-pan offset (world units)
  function setCamera(target: Cam, opts: { animate: boolean; dur?: number }) {
    const near = Math.abs(target.tx - cam.tx) < 0.5 && Math.abs(target.ty - cam.ty) < 0.5 && Math.abs(target.s - cam.s) < 0.002
    if (!opts.animate || reduced || near) { camActive = false; cam = { ...target }; requestDraw(); return }
    camFrom = { ...cam }; camTo = { ...target }; camT0 = 0; camActive = true; camDur = opts.dur || CAM_DUR
    requestDraw()
  }
  function stepCamera(now: number) {
    if (!camActive) return
    if (!camT0) camT0 = now
    const e = camEase(Math.min(1, (now - camT0) / camDur))
    cam = { tx: camFrom.tx + (camTo.tx - camFrom.tx) * e, ty: camFrom.ty + (camTo.ty - camFrom.ty) * e, s: camFrom.s + (camTo.s - camFrom.s) * e }
    if (e >= 1) camActive = false
  }
  // Entry box-zoom: the container scales up from the collapsed section's slot
  // while the camera glides to the fullscreen fit. Both read the SAME
  // progress (camT0/CAM_DUR/camEase), so the box and the graph inside it are
  // locked into one combined zoom — a main-thread hiccup stalls both
  // together instead of letting one race ahead of the other.
  function applyEnterFlip(now: number) {
    if (!enterFlip) return
    // Own clock, NOT the camera's: a node tap mid-entry re-aims the camera
    // tween and resets camT0 — keyed off that, the box would snap back to
    // the collapsed pose and replay.
    if (!enterFlip.t0) enterFlip.t0 = now
    const p = Math.min(1, (now - enterFlip.t0) / CAM_DUR)
    if (p >= 1) {
      enterFlip = null
      container.style.transform = ''; container.style.transformOrigin = ''; container.style.willChange = ''
      dossier.style.transform = ''; container.classList.remove('op-entering')
      fsLanded() // Close pill + coach hint appear only now
      return
    }
    const e = camEase(p)
    const s = enterFlip.u + (1 - enterFlip.u) * e
    container.style.transform = `translate(${(enterFlip.l * (1 - e)).toFixed(2)}px, ${(enterFlip.t * (1 - e)).toFixed(2)}px) scale(${s.toFixed(5)})`
    // The sheet rides the same curve back to its own slot. Local (pre-scale)
    // units: this transform is applied inside the container, so the browser
    // scales it by s along with everything else in the box.
    if (enterFlip.sheetDy) dossier.style.transform = `translateY(${(enterFlip.sheetDy * (1 - e)).toFixed(2)}px)`
  }

  // ---- drag-to-pan + momentum (mobile fullscreen only) ---------------------
  // Very generous clamp so the pan follows the finger freely and never feels
  // like it "stops" mid-drag; symmetric, so diagonals never collapse to one axis.
  function panMax() {
    return {
      x: Math.max(VBW * 0.5, cam.s * GEXT + VBW * 0.35),
      y: Math.max(VBH * 0.5, cam.s * GEXT + VBH * 0.35),
    }
  }
  const clampTo = (v: number, m: number) => Math.max(-m, Math.min(m, v))
  let momActive = false, momVX = 0, momVY = 0
  function stopMomentum() { momActive = false }
  // Fold the pan into the base camera and zero it, so a navigation glide starts
  // from exactly where the eye is (no snap-back of the pan on nav).
  function foldPan() { stopMomentum(); if (panX || panY) { cam.tx += panX; cam.ty += panY; panX = 0; panY = 0 } }

  let io: IntersectionObserver | null = null
  let visIO: IntersectionObserver | null = null
  let stageVisible = true // ambient animations (radar ping, pulse) pause off-screen
  let disposed = false
  // The mobile entrance is the fullscreen FLIP itself (enterFullscreen): one
  // WAAPI zoom on the CONTAINER. There is deliberately no canvas-level
  // entrance animation — a second animation layered over the state change is
  // exactly how the old design's arrival hitches got in. Desktop has none.

  // Mobile "persistent discovery": once you've opened a node it stays lit and
  // tappable, so you can pan across the whole explored map instead of watching
  // branches fade in and out. Desktop keeps the focus-only fade.
  const discovered = new Set<string>()
  const DISC_OP = 0.45

  // ---- scene model ---------------------------------------------------------
  // render() computes TARGETS (opacity, radius, label layout, edge style); the
  // draw loop tweens toward them and paints. Nothing is recomputed per frame.
  type Lbl = { lines: string[]; fsU: number; x: number; y: number; align: CanvasTextAlign; cat: boolean }
  type Vis = {
    op: Tween; r: Tween; lblOp: Tween
    lbl: Lbl | null
    clickable: boolean
    edge: { kind: 'flat'; color: string } | { kind: 'grad' } // flat = active/spine/discovered
    edgeFlatAlpha: number
  }
  const vis: Record<string, Vis> = {}
  ORDER.forEach((id) => {
    vis[id] = {
      op: tw(id === 'pm' || byId[id].depth === 1 ? 1 : 0), r: tw(12), lblOp: tw(0),
      lbl: null, clickable: false, edge: { kind: 'grad' }, edgeFlatAlpha: 0,
    }
  })
  let hubOp = 1 // snaps (the old #op-hub had no opacity transition)
  let edgeW = 1.3
  const focusName = { text: '', x: 0, y: 0, fs: 17, op: tw(0) }

  function wrap(s: string, m: number) { const w = s.split(' '), o: string[] = []; let line = ''; for (const x of w) { if ((line + ' ' + x).trim().length > m && line) { o.push(line.trim()); line = x } else line = (line + ' ' + x).trim() } if (line) o.push(line); return o }

  // Node radius and title geometry — shared by fit() (to frame titles) and
  // render() (to paint them), so the camera can never disagree with what's drawn.
  function dotR(id: string, focus: string, desktop: boolean) {
    // bigger nodes + far bigger tap targets on touch
    return id === focus ? (desktop ? 18 : 28) : byId[id].depth === 1 ? (desktop ? 14 : 23) : (desktop ? 12 : 20)
  }
  function labelGeom(id: string, focus: string, k: number, desktop: boolean, wrapW: number, centreAll = false): Lbl {
    const node = byId[id]
    const isCat = node.depth === 1
    // On mobile the font is pinned to a fixed CSS px size (counter-scaled against
    // the camera) so it stays legible and never rescales as the camera zooms.
    // Phone titles are counter-scaled to hold a constant on-screen size — but
    // only down to a point. Past it that rule runs away: zooming out inflates a
    // title's size in GRAPH units, which widens the box the camera has to frame,
    // which zooms out further. A branch with one long name could drive the scale
    // to its floor and still overflow. Capping the graph-unit size breaks the
    // loop; beyond the cap titles simply shrink on screen like the rest of the map.
    const fsU = desktop ? (isCat ? 13.5 : 14.5) : Math.min((isCat ? 12.5 : 12) / k, isCat ? 22 : 20)
    // Even at the wider phone fan, a branch of four or five long names can still
    // graze: push every other sibling's title further out along its spoke so
    // neighbours never sit at the same radius. fsU is counter-scaled on mobile,
    // so this is a constant on-screen nudge at any zoom.
    const sibs = node.parent ? byId[node.parent].kids : []
    const si = sibs.indexOf(id)
    const stagger = !desktop && sibs.length > 2 && si % 2 === 1 ? fsU * 1.5 : 0
    const gap = dotR(id, focus, desktop) + 9 + stagger
    const pn = byId[node.parent as string], dxp = node.x - pn.x, dyp = node.y - pn.y
    // Sibling titles stack vertically along the arc, so LINE COUNT is what makes
    // them collide — a 13-char wrap turned "Research and Innovation Foundation
    // (Cyprus)" into a four-line block taller than the gap to its neighbour.
    // Leaf titles therefore wrap wide (most become one line) and the phone fit
    // absorbs the extra width, which it has to spare. Category titles keep the
    // narrow wrap: they are uppercase and letter-spaced, so one line of those
    // would run half the width of the screen.
    const lines = wrap(node.label, desktop ? 20 : isCat ? 13 : wrapW)
    // Long uppercase category labels clip if placed to the side at the
    // horizontal extremes of a narrow phone, so centre those above/below the
    // node instead. Vertical-extreme categories keep side labels.
    // A side-anchored title on an outer node adds its FULL width to the box the
    // camera has to frame, and these phone branches are width-bound while
    // vertical room goes spare — that is what kept the open section small.
    // Centring the title over its node costs only half the width, so do it
    // whenever the siblings are far enough apart for the centred boxes to clear
    // each other. Thresholds are fixed distances, not derived from the font, so
    // the choice can't oscillate while the camera fit iterates.
    let centred = !desktop && isCat && Math.abs(node.x) > Math.abs(node.y)
    if (!desktop && !isCat && centreAll) centred = true
    else if (!desktop && !isCat && sibs.length > 1) {
      centred = sibs.every((sk) => {
        if (sk === id) return true
        const o = byId[sk]
        // Vertical clearance has to grow with the TALLER of the two titles: a
        // three-line name needs far more room below its node than a one-liner.
        const tall = Math.max(lines.length, wrap(o.label, wrapW).length)
        return Math.abs(node.x - o.x) > 160 || Math.abs(node.y - o.y) > 44 + tall * 26
      })
    }
    let align: CanvasTextAlign, x: number, y: number
    if (centred) {
      // below when the node hangs below its parent, above when it sits above —
      // i.e. always on the outward side of the branch. (For a category the
      // parent is the hub at the origin, so this is the original `node.y >= 0`.)
      align = 'center'; x = node.x
      y = dyp >= 0 ? node.y + gap + fsU : node.y - gap - (lines.length - 1) * fsU
    } else {
      align = Math.abs(dxp) < 18 ? 'center' : dxp > 0 ? 'left' : 'right'
      x = node.x + (align === 'center' ? 0 : dxp > 0 ? gap : -gap)
      y = node.y + (align === 'center'
        ? (dyp >= 0 ? gap + fsU : -gap - (lines.length - 1) * fsU)
        : fsU * 0.34 - (lines.length - 1) * fsU * 0.5)
    }
    return { lines, fsU, x, y, align, cat: isCat }
  }
  function labelFont(fsU: number) { return `600 ${fsU.toFixed(2)}px ${SANS}` }
  function measureLbl(l: Lbl): { x: number; y: number; w: number; h: number } {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.font = labelFont(l.fsU)
    try { (ctx as any).letterSpacing = (l.cat ? 0.11 * l.fsU : 0.04 * l.fsU).toFixed(2) + 'px' } catch { /* noop */ }
    let w = 0
    for (const ln of l.lines) w = Math.max(w, ctx.measureText(l.cat ? ln.toUpperCase() : ln).width)
    ctx.restore()
    const hgt = l.lines.length * l.fsU * 1.06 + l.fsU * 0.2
    const x0 = l.align === 'center' ? l.x - w / 2 : l.align === 'right' ? l.x - w : l.x
    return { x: x0, y: l.y - l.fsU, w, h: hgt }
  }

  // Animate ONLY on user navigation (go/onNodeClick/goUp/back/hub). Layout-driven
  // re-renders (resize/observer/settle/fonts) snap so they never tween.
  function render(animate = false, camMs?: number) {
    const now = performance.now()
    const path = ancestors(focusId), childIds = byId[focusId].kids
    const grand: Record<string, 1> = {}; childIds.forEach((c) => byId[c].kids.forEach((g) => (grand[g] = 1)))
    const tier = (id: string): keyof typeof OP => (id === focusId || childIds.indexOf(id) >= 0) ? 'active' : path.indexOf(id) >= 0 ? 'spine' : grand[id] ? 'hint' : 'context'
    const desktop = isDesktop()
    if (!desktop) { discovered.add(focusId); childIds.forEach((c) => discovered.add(c)); path.forEach((p) => discovered.add(p)) }
    // The dossier window is the single description surface, desktop and mobile.
    // Fill it BEFORE fit() so its measured height (mobile, where it's a full-width
    // sheet) can be reserved out of the camera's usable band.
    setDossier(selId)
    updateViewBox()
    const camTgt = fit(focusId)
    // CSS px per world unit at the TARGET camera; pins on-screen sizes on mobile.
    const ppu = Math.min(cssW / VBW, cssH / VBH)
    const k = camTgt.s * ppu || 1
    edgeW = 1.3 / camTgt.s
    ORDER.forEach((id) => {
      if (id === 'pm') return
      const v = vis[id], t = tier(id), active = t === 'active'
      const disc = !desktop && discovered.has(id) // discovered stays visible + tappable on mobile
      const opTgt = disc && OP[t] === 0 ? DISC_OP : OP[t]
      twTo(v.op, now, opTgt, animate ? 550 : 0, cssEase)
      v.clickable = active || disc
      a11yBtn[id].hidden = !v.clickable
      twTo(v.r, now, dotR(id, focusId, desktop), animate ? 450 : 0, rEase)
      // Titles belong to the branch you are LOOKING at: the focus's children plus
      // the spine back to PM. A merely-discovered node keeps its dot (visible and
      // tappable) but drops its title until you go there. Showing every
      // discovered title meant ~19 of them at once, most hanging off the screen
      // edge as clipped fragments, and it forced the camera to its zoom-out floor
      // trying to frame them all — the branch you actually opened ended up tiny.
      // (desktop keeps active-only, exactly as before — it never showed the spine)
      const lblShow = (id !== focusId && (active || (!desktop && t === 'spine'))) ? 1 : 0
      twTo(v.lblOp, now, lblShow, animate ? 500 : 0, cssEase)
      v.lbl = labelGeom(id, focusId, k, desktop, leafWrap, leafCentre) // both chosen by fit()
      // edges
      if (t === 'active' || t === 'spine') { v.edge = { kind: 'flat', color: IVORY }; v.edgeFlatAlpha = t === 'active' ? 0.5 : 0.4 }
      else if (!desktop && discovered.has(id)) { v.edge = { kind: 'flat', color: IVORY }; v.edgeFlatAlpha = 0.16 } // discovered edge stays drawn
      else v.edge = { kind: 'grad' }
    })
    hubOp = OP[tier('pm')]
    if (focusId !== 'pm') {
      const f = byId[focusId]
      focusName.text = f.label; focusName.x = f.x
      if (desktop) { focusName.fs = 17; focusName.y = f.y + 38 }
      else { focusName.fs = 18 / k; focusName.y = f.y + 25 + focusName.fs * 0.92 + 5 }
      twTo(focusName.op, now, 1, animate ? 500 : 0, cssEase)
    } else twTo(focusName.op, now, 0, animate ? 500 : 0, cssEase)
    // De-clutter titles: never let two visible titles overlap, in any state. Place
    // greedily by priority (active > spine > discovered, shallower first); hide any
    // lower-priority title whose box hits an already-placed one — its dot stays
    // (tappable) and the title returns once there's room. Active titles are never
    // hidden. Boxes are measured in shared world space, so an overlap there is
    // exactly an overlap on screen.
    {
      const placed: { x: number; y: number; w: number; h: number }[] = []
      if (focusId !== 'pm') {
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.font = `600 ${focusName.fs.toFixed(2)}px ${SERIF}`
        const w = ctx.measureText(focusName.text).width; ctx.restore()
        placed.push({ x: focusName.x - w / 2, y: focusName.y - focusName.fs, w, h: focusName.fs * 1.3 })
      }
      const prio = (id: string) => { const t = tier(id); return t === 'active' ? 3 : t === 'spine' ? 2 : 1 }
      ORDER
        .filter((id) => id !== 'pm' && vis[id].lbl && vis[id].lblOp.v1 > 0)
        .sort((a, b) => prio(b) - prio(a) || byId[a].depth - byId[b].depth)
        .forEach((id) => {
          const bb = measureLbl(vis[id].lbl as Lbl)
          const hit = placed.some((p) => !(bb.x + bb.w < p.x || bb.x > p.x + p.w || bb.y + bb.h < p.y || bb.y > p.y + p.h))
          if (hit && prio(id) < 3) twTo(vis[id].lblOp, now, 0, 0, cssEase)
          else placed.push(bb)
        })
    }
    setCamera(camTgt, { animate, dur: camMs }) // glide on navigation, snap on layout re-renders
    syncBack()
    container.classList.toggle('op-at-top', focusId === 'pm')
    pulseChain(selId)
    requestDraw()
  }
  // The corner control has two faces. Fullscreen: it IS the exit — an X and
  // the close label, always visible, because there its job is leaving the
  // overlay. Desktop: the classic hub shortcut (PM disc + "back to top"),
  // shown once the graph is away from the hub. Mobile collapsed shows NO
  // controls at all — the preview is inert scenery the page scrolls past.
  function syncBack() {
    const open = fsState === 'fullscreen'
    // While the entry zoom is still running (enterFlip) the pill stays
    // hidden — it appears once the overlay has fully landed.
    const show = (open && !enterFlip && !entering) || (isDesktop() && focusId !== 'pm')
    pmback.hidden = !show
    pmback.classList.toggle('op-exit', open)
    pmback.setAttribute('aria-label', open ? (content.exit || 'Close full screen map') : content.backLabel)
    setTimeout(() => pmback.classList.toggle('show', show), 10)
  }
  function go(id: string) { foldPan(); focusId = id; selId = id; render(true) }
  function onNodeClick(id: string) {
    hideCoach() // the hint has been acted on
    // A node tap is the ONE way into the overlay from the collapsed preview.
    if (!isDesktop() && fsState === 'collapsed') enterFullscreen()
    if (id === 'pm') { onHubActivate(); return }
    if (id === focusId) { goUp(); return }
    const n = byId[id]
    if (n.kids.length) { go(id); return }
    // A leaf: select it AND focus its section, so tapping a node that belongs to
    // another branch flies the camera to that branch instead of only recolouring
    // a dot the camera never travels to. When the leaf is already in view its
    // parent IS the current focus, so this leaves the camera exactly where it is.
    foldPan()
    selId = id
    focusId = n.parent || focusId
    render(true)
  }
  function onHubActivate() { if (focusId !== 'pm') go('pm') }
  function goUp() { const p = byId[focusId].parent; if (p) go(p); else { foldPan(); selId = 'pm'; render(true) } }

  // ---- traveling pulse (time-based, drawn each frame) ----------------------
  // The waypoint offset list is precomputed exactly like the old WAAPI moveKf
  // keyframes (mid waypoints appear twice: arrive + leave, dwell apart), so the
  // canvas dot travels byte-for-byte the same schedule.
  type Pulse = { kf: { off: number; x: number; y: number }[]; dur: number; t0: number } | null
  let pulse: Pulse = null
  function pulseChain(key: string) {
    pulse = null
    if (reduced || key === 'pm') return
    const chain: { x: number; y: number }[] = []; let pk: string | null = key, guard = 0
    while (pk && guard++ < 16) { chain.push({ x: byId[pk].x, y: byId[pk].y }); if (pk === 'pm') break; pk = byId[pk].parent }
    if (chain.length < 2) return
    const cum = [0]; let total = 0
    for (let i = 1; i < chain.length; i++) { total += Math.hypot(chain[i].x - chain[i - 1].x, chain[i].y - chain[i - 1].y); cum.push(total) }
    const dwell = 0.11, mids = Math.max(0, chain.length - 2), travelFrac = 1 - dwell * mids
    const dur = Math.round((950 + total * 2.6) / travelFrac)
    const kf: { off: number; x: number; y: number }[] = []; let acc = 0
    chain.forEach((w, i) => {
      const off = (total ? cum[i] / total : i / (chain.length - 1)) * travelFrac
      kf.push({ off: off + acc, x: w.x, y: w.y })
      if (i > 0 && i < chain.length - 1) { acc += dwell; kf.push({ off: off + acc, x: w.x, y: w.y }) }
    })
    pulse = { kf, dur, t0: performance.now() }
    requestDraw()
  }
  function pulseAt(p: number): { x: number; y: number } {
    const kf = (pulse as NonNullable<Pulse>).kf
    if (p <= kf[0].off) return kf[0]
    for (let i = 0; i < kf.length - 1; i++) {
      const a = kf[i], b = kf[i + 1]
      if (p <= b.off) {
        const f = b.off > a.off ? (p - a.off) / (b.off - a.off) : 1
        return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }
      }
    }
    return kf[kf.length - 1]
  }

  // ---- draw loop ------------------------------------------------------------
  let drawRAF = 0
  function requestDraw() { if (!drawRAF) drawRAF = requestAnimationFrame(frame) }
  function frame(now: number) {
    drawRAF = 0
    stepCamera(now)
    applyEnterFlip(now)
    if (momActive) {
      momVX *= 0.93; momVY *= 0.93
      if (Math.hypot(momVX, momVY) < 0.25) momActive = false
      else {
        const m = panMax()
        panX = clampTo(panX + momVX, m.x); panY = clampTo(panY + momVY, m.y)
      }
    }
    draw(now)
    // keep animating while anything is live; otherwise the loop idles.
    const anims = ORDER.some((id) => {
      const v = vis[id]
      return twActive(v.op, now) || twActive(v.r, now) || twActive(v.lblOp, now)
    }) || twActive(focusName.op, now)
    const ambient = !reduced && stageVisible && (pulse !== null || focusId === 'pm')
    if (camActive || momActive || anims || ambient || enterFlip) requestDraw()
  }

  function draw(now: number) {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const u2p = Math.min(cssW / VBW, cssH / VBH)
    const sc = dpr * u2p * cam.s
    const ox = dpr * (cssW / 2 + (cam.tx + panX) * u2p)
    const oy = dpr * (cssH / 2 + (cam.ty + panY) * u2p)
    ctx.setTransform(sc, 0, 0, sc, ox, oy)
    ctx.lineCap = 'round'
    // edges under everything
    ORDER.forEach((id) => {
      if (id === 'pm') return
      const v = vis[id], n = byId[id], p = byId[n.parent as string]
      ctx.lineWidth = edgeW
      if (v.edge.kind === 'flat') {
        ctx.globalAlpha = v.edgeFlatAlpha
        ctx.strokeStyle = v.edge.color
      } else {
        // faint gradient fading outward from the parent (context edges)
        const g = ctx.createLinearGradient(p.x, p.y, n.x, n.y)
        g.addColorStop(0, 'rgba(236,231,220,0.16)')
        g.addColorStop(0.55, 'rgba(236,231,220,0.05)')
        g.addColorStop(1, 'rgba(236,231,220,0)')
        ctx.globalAlpha = 1
        ctx.strokeStyle = g
      }
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y); ctx.stroke()
    })
    // nodes + labels
    ORDER.forEach((id) => {
      if (id === 'pm') return
      const v = vis[id], n = byId[id]
      const op = twCur(v.op, now)
      if (op < 0.01) return
      const r = twCur(v.r, now)
      const focus = id === focusId, sel = id === selId && id !== focusId
      ctx.globalAlpha = op
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
      ctx.fillStyle = focus || sel ? ACCENT : NODE_FILL
      ctx.fill()
      ctx.lineWidth = 1
      ctx.strokeStyle = focus || sel ? ACCENT : hoverId === id && v.clickable ? IVORY : (n.kids.length ? BRANCH_STROKE : NODE_STROKE)
      ctx.stroke()
      if (focusRingId === id) { // keyboard focus ring
        ctx.lineWidth = 2.5
        ctx.strokeStyle = ACCENT
        ctx.beginPath(); ctx.arc(n.x, n.y, r + 3, 0, Math.PI * 2); ctx.stroke()
      }
      const lop = twCur(v.lblOp, now)
      if (v.lbl && lop > 0.01) {
        const l = v.lbl
        ctx.globalAlpha = op * lop
        ctx.font = labelFont(l.fsU)
        try { (ctx as any).letterSpacing = (l.cat ? 0.11 * l.fsU : 0.04 * l.fsU).toFixed(2) + 'px' } catch { /* noop */ }
        ctx.fillStyle = l.cat ? CAT_LBL : LEAF_LBL
        ctx.textAlign = l.align; ctx.textBaseline = 'alphabetic'
        l.lines.forEach((ln, i) => ctx.fillText(l.cat ? ln.toUpperCase() : ln, l.x, l.y + i * l.fsU))
        try { (ctx as any).letterSpacing = '0px' } catch { /* noop */ }
      }
    })
    // focus name (serif title under the focused node)
    {
      const op = twCur(focusName.op, now)
      if (op > 0.01 && focusName.text) {
        ctx.globalAlpha = op
        ctx.font = `600 ${focusName.fs.toFixed(2)}px ${SERIF}`
        ctx.fillStyle = IVORY
        ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
        ctx.fillText(focusName.text, focusName.x, focusName.y)
      }
    }
    // hub (accent core + ring + PM), with radar ping + pulse heartbeat
    if (hubOp > 0.01) {
      ctx.globalAlpha = hubOp
      let beat = 1
      if (pulse && !reduced) {
        const ph = ((now - pulse.t0) % pulse.dur) / pulse.dur
        // heartbeat at the start of each pulse cycle (440ms), like the old beat()
        const bt = ph * pulse.dur
        if (bt < 440) { const q = beatEase(bt / 440); beat = 1 + 0.13 * Math.sin(q * Math.PI) }
      }
      ctx.beginPath(); ctx.arc(0, 0, 32 * beat, 0, Math.PI * 2)
      ctx.fillStyle = ACCENT; ctx.fill()
      if (focusId === 'pm' && !reduced) {
        // radar ping: 3.4s cycle, ring grows 1 -> 2.7 while fading (60% of cycle)
        const pp = (now % 3400) / 3400
        if (pp < 0.6) {
          const q = pp / 0.6
          ctx.globalAlpha = hubOp * 0.55 * (1 - q)
          ctx.beginPath(); ctx.arc(0, 0, 40 * (1 + 1.7 * q), 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(236,231,220,0.6)'; ctx.lineWidth = 1; ctx.stroke()
        }
        ctx.globalAlpha = hubOp
      }
      ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(236,231,220,0.3)'; ctx.lineWidth = 1; ctx.stroke()
      ctx.font = `700 18px ${SANS}`
      try { (ctx as any).letterSpacing = (0.06 * 18).toFixed(2) + 'px' } catch { /* noop */ }
      ctx.fillStyle = '#F4F1EA'
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
      ctx.fillText(content.hub.label, 0.5, 6.5)
      try { (ctx as any).letterSpacing = '0px' } catch { /* noop */ }
      if (focusRingId === 'pm') {
        ctx.lineWidth = 2.5; ctx.strokeStyle = ACCENT
        ctx.beginPath(); ctx.arc(0, 0, 46, 0, Math.PI * 2); ctx.stroke()
      }
    }
    // traveling pulse dot on top
    if (pulse && !reduced) {
      const ph = ((now - pulse.t0) % pulse.dur) / pulse.dur
      const pos = pulseAt(ph)
      const fade = ph < 0.14 ? ph / 0.14 : ph > 0.8 ? Math.max(0, (1 - ph) / 0.2) : 1
      ctx.globalAlpha = 0.16 * fade
      ctx.beginPath(); ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2); ctx.fillStyle = ACCENT; ctx.fill()
      ctx.globalAlpha = fade
      ctx.beginPath(); ctx.arc(pos.x, pos.y, 4.5, 0, Math.PI * 2); ctx.fillStyle = ACCENT; ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  // ---- hit testing ----------------------------------------------------------
  function worldFromEvent(e: { clientX: number; clientY: number }): { x: number; y: number } {
    const r = canvas.getBoundingClientRect()
    const u2p = Math.min(cssW / VBW, cssH / VBH) || 1
    const cx = (e.clientX - r.left) * (cssW / (r.width || 1)) // FLIP-scaled rect → css px
    const cy = (e.clientY - r.top) * (cssH / (r.height || 1))
    return {
      x: ((cx - cssW / 2) / u2p - (cam.tx + panX)) / cam.s,
      y: ((cy - cssH / 2) / u2p - (cam.ty + panY)) / cam.s,
    }
  }
  function hitTest(w: { x: number; y: number }): string | null {
    const desktop = isDesktop()
    // hub first (drawn on top); pad in world units, like the old generous op-hit
    if (hubOp > 0.01 && Math.hypot(w.x, w.y) <= 40 + (desktop ? 8 : 18)) return 'pm'
    const pad = (desktop ? 14 : 26)
    let best: string | null = null, bestD = Infinity
    ORDER.forEach((id) => {
      if (id === 'pm') return
      const v = vis[id]
      if (!v.clickable) return // faded nodes must not swallow taps
      const n = byId[id]
      const d = Math.hypot(w.x - n.x, w.y - n.y)
      if (d <= v.r.v1 + pad && d < bestD) { best = id; bestD = d }
    })
    return best
  }

  // ---- fullscreen takeover (mobile only) ----------------------------------
  // Collapsed: the map is a normal in-page section — the page scrolls past it
  // and NOTHING about the graph reacts to that scroll. Fullscreen: .op-map is
  // portaled to <body> as a position:fixed overlay and a WAAPI FLIP zooms it
  // out of the section's box. NOTE: we do NOT use position:fixed on <body> to
  // lock scroll — on iOS Safari a fixed body mis-positions fixed DESCENDANTS
  // (the overlay ends up off-screen). The real iOS scroll lock is the
  // document-level touchmove guard installed by lockScroll plus
  // touch-action:none on the overlay CONTAINER; overflow:hidden on html/body
  // is a harmless belt-and-braces that never offsets fixed elements. (It IS
  // safe here, unlike in the old scroll-coupled design: the overlay is fixed,
  // not sticky, so re-rooting the scroll container changes nothing.)
  //
  // overflow:hidden alone is NOT a reliable touch lock on iOS: WebKit can
  // still claim a drag for the document (pan/rubber-band) at gesture start —
  // and once it has, every touchmove arrives cancelable:false and the canvas
  // handler's preventDefault is silently ignored (the "pan never follows the
  // finger" iPhone bug). A DOCUMENT-level non-passive touchmove listener that
  // calls preventDefault while fullscreen is the one mechanism WebKit always
  // honors: it forces synchronous dispatch and vetoes the native gesture no
  // matter where the touch lands. The description sheet is exempt so its own
  // overflow scroll keeps working. Registered only while fullscreen so normal
  // page scrolling never pays the synchronous-dispatch cost.
  const descEl = dossier.querySelector('.op-d-desc') as HTMLElement
  const onDocTouchMove = (e: TouchEvent) => {
    if (fsState !== 'fullscreen') return
    if (descEl && e.target instanceof Node && descEl.contains(e.target)) return
    if (e.cancelable) e.preventDefault()
  }
  // The lock is self-healing: a gesture's fling tail can leak a few px of
  // root scroll past overflow:hidden + the touchmove guard (the browser
  // applies it at gesture end, beyond preventDefault's reach). Behind the
  // opaque overlay any drift is invisible — snap it straight back so the
  // page provably never moves while the map is fullscreen.
  const snapLockedY = () => { try { window.scrollTo({ top: lockedY, behavior: 'instant' as ScrollBehavior }) } catch { window.scrollTo(0, lockedY) } }
  const onLockedScroll = () => { if (fsState === 'fullscreen' && Math.abs((window.scrollY || 0) - lockedY) > 1) snapLockedY() }
  // The lock has two halves, and keeping them apart is what makes the handoff
  // clean. The touchmove guard is the half that actually stops iOS scrolling,
  // and it changes no styles, so it goes on at once. overflow:hidden is only
  // the belt to that guard's braces — but it is also the one part that reflows
  // the document, and on iOS it can take the scroll offset with it. Applied in
  // the handoff frame, that landed right where the eye was: the page behind
  // stepped while the overlay held still. It now waits for the zoom to land,
  // by which point the overlay covers everything it could disturb.
  function lockScroll() {
    lockedY = window.scrollY || 0
    document.addEventListener('touchmove', onDocTouchMove, { passive: false })
    window.addEventListener('scroll', onLockedScroll, { passive: true })
  }
  function lockOverflow() {
    if (overflowLocked) return
    const d = document.documentElement, b = document.body
    rootPrev.htmlOverflow = d.style.overflow; rootPrev.bodyOverflow = b.style.overflow; rootPrev.htmlOB = d.style.overscrollBehavior
    d.style.overflow = 'hidden'; b.style.overflow = 'hidden'; d.style.overscrollBehavior = 'none'
    overflowLocked = true
  }
  function unlockOverflow() {
    if (!overflowLocked) return
    const d = document.documentElement, b = document.body
    d.style.overflow = rootPrev.htmlOverflow; b.style.overflow = rootPrev.bodyOverflow; d.style.overscrollBehavior = rootPrev.htmlOB
    overflowLocked = false
  }
  function unlockScroll() {
    unlockOverflow()
    document.removeEventListener('touchmove', onDocTouchMove)
    window.removeEventListener('scroll', onLockedScroll)
    snapLockedY() // Close lands exactly where the page was when the map opened
  }
  let coachTimer = 0
  function showCoach() {
    if (!content.coach || isDesktop()) return
    if (coachTimer) { clearTimeout(coachTimer); coachTimer = 0 }
    coachEl.classList.add('show')
    coachTimer = window.setTimeout(() => { coachEl.classList.remove('show'); coachTimer = 0 }, 4200)
  }
  function hideCoach() {
    if (coachTimer) { clearTimeout(coachTimer); coachTimer = 0 }
    coachEl.classList.remove('show')
  }
  // Everything that belongs to the overlay having ARRIVED — deliberately not
  // done at entry time: mid-zoom the Close pill hovered over a still-moving
  // scene, and the hint would have competed with the animation.
  function fsLanded() {
    entering = false
    lockOverflow() // deferred to here on purpose (see lockScroll)
    syncBack()
    try { pmback.focus({ preventScroll: true }) } catch { /* noop */ }
    showCoach()
  }
  function dropScrim(fadeMs: number) {
    const s = scrim
    if (!s) return
    scrim = null
    let cur = 1
    try { cur = parseFloat(getComputedStyle(s).opacity) || 1 } catch { /* noop */ }
    if (scrimAnim) { try { scrimAnim.cancel() } catch { /* noop */ } scrimAnim = null }
    if (!fadeMs || reduced) { s.remove(); return }
    try {
      const a = s.animate([{ opacity: cur }, { opacity: 0 }], { duration: fadeMs, easing: 'ease' })
      a.onfinish = () => s.remove()
      a.oncancel = () => s.remove()
    } catch { s.remove(); return }
    window.setTimeout(() => s.remove(), fadeMs + 250) // belt if onfinish never fires
  }
  function stopFsAnim() {
    if (fsAnim) { try { fsAnim.cancel() } catch { /* noop */ } fsAnim = null }
    if (enterFlip) { enterFlip = null; container.style.transform = ''; container.style.transformOrigin = ''; container.style.willChange = '' }
    entering = false
    dossier.style.transform = ''; container.classList.remove('op-entering')
    if (fsSafety) { clearTimeout(fsSafety); fsSafety = 0 }
  }
  // Entry is two steps, and the gap between them is the whole point.
  //
  // Step one is a HARD STOP. A fling is often still running when the section
  // arrives — waiting for it to end is no good, because frequently it doesn't
  // (you flick, it coasts, you flick again). So the scroll is killed on the
  // spot: the touch guard goes on, and a programmatic scroll to the position
  // the page is already at cancels iOS momentum without moving anything.
  //
  // Step two runs on the next frame. That one frame is what buys correctness:
  // the overlay is placed from rects measured on the main thread, and during a
  // fling those rects trail the compositor's real scroll position, so an
  // overlay placed mid-fling lands offset from the picture on screen — the
  // step that read as the layout resetting. Measured a frame after the stop,
  // with the page provably still, they agree.
  function enterFullscreen() {
    if (isDesktop() || fsState !== 'collapsed' || entering) return
    stopFsAnim() // BEFORE the flags: it clears `entering` (it is teardown for aborted entries)
    entering = true
    fsState = 'fullscreen' // the touchmove guard keys off this — set it before the guard can be needed
    armed = false          // the once-per-load auto-open is spent on ANY entry
    if (io) { io.disconnect(); io = null } // its one job is done
    document.addEventListener('touchmove', onDocTouchMove, { passive: false })
    try { window.scrollTo({ top: window.scrollY || 0, behavior: 'instant' as ScrollBehavior }) } catch { /* noop */ }
    requestAnimationFrame(() => {
      if (!entering || disposed || fsState !== 'fullscreen' || placeholder) return
      placeFullscreen()
    })
  }
  function placeFullscreen() {
    // Capture the collapsed view's box and world->viewport mapping BEFORE
    // anything moves: the overlay's first frame must reproduce it exactly.
    const first = container.getBoundingClientRect()
    const sheetFirst = dossier.getBoundingClientRect() // the preview sheet's slot, for the shared-element glide
    const oldU2p = Math.min(cssW / VBW, cssH / VBH) || 1
    const oldCam = { ...cam }
    const oldW = cssW, oldH = cssH
    wireTouch()            // pan listeners exist only while fullscreen
    lastFocused = (document.activeElement as HTMLElement) || null
    placeholder = document.createElement('div')
    placeholder.className = 'op-map-ph'
    placeholder.style.height = first.height + 'px'
    placeholder.style.marginTop = getComputedStyle(container).marginTop
    container.parentNode!.insertBefore(placeholder, container)
    // The page fades toward graphite underneath the lifting box (see the
    // scrim note above): by the time the box's edge reaches any text, that
    // text has already faded away.
    if (!reduced) {
      dropScrim(0)
      scrim = document.createElement('div')
      scrim.className = 'op-scrim'
      document.body.appendChild(scrim)
      try {
        scrimAnim = scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: 'ease-out' })
        scrimAnim.onfinish = () => { scrimAnim = null }
      } catch { /* noop */ }
    }
    // Portal to <body>: #main carries a filled identity transform from its entrance
    // animation, which would otherwise make this position:fixed overlay relative to
    // #main (off-screen when scrolled down) instead of the viewport. <body> is clean.
    document.body.appendChild(container)
    container.classList.add('op-fs')
    container.setAttribute('role', 'dialog')
    container.setAttribute('aria-modal', 'true')
    lockScroll()
    resetGesture(); suppressClick = false; stopMomentum()
    panX = 0; panY = 0
    updateViewBox()
    // Seamless handoff, in two locked parts — the expanding-box zoom of the
    // original design plus a pixel-matched first frame:
    //  1. the container zooms out of the collapsed section's slot to the
    //     full viewport with a UNIFORM scale (u = width ratio). Uniform is
    //     the trick: only a uniform box transform can be cancelled exactly
    //     by the (uniform) camera, so the first frame can match the
    //     collapsed view perfectly. The extra height u leaves over lands
    //     below the viewport edge, where it is invisible.
    //  2. the fullscreen camera starts at the transform that — seen through
    //     that t=0 box transform — reproduces the collapsed view
    //     pixel-for-pixel, and the regular camera tween glides it to the
    //     fullscreen fit. Both movements run on the same clock and easing
    //     (applyEnterFlip), so they compose into ONE zoom.
    const newU2p = Math.min(cssW / VBW, cssH / VBH) || 1
    const u = Math.max(0.05, Math.min(1, first.width / (cssW || 1)))
    camActive = false
    cam = {
      s: (oldU2p * oldCam.s) / (u * newU2p),
      tx: ((oldW / 2 + oldCam.tx * oldU2p) / u - cssW / 2) / newU2p,
      ty: ((oldH / 2 + oldCam.ty * oldU2p) / u - cssH / 2) / newU2p,
    }
    if (!reduced) enterFlip = { l: first.left, t: first.top, u, t0: 0, sheetDy: 0 } // armed BEFORE render: its syncBack keeps the Close pill hidden until landing
    render(!reduced)
    if (enterFlip && camActive) {
      // arm the box zoom BEFORE this frame paints, at its exact t=0 pose
      container.classList.add('op-entering') // suspends the sheet's own CSS transition while we drive it per frame
      container.style.transformOrigin = '0 0'
      container.style.willChange = 'transform'
      container.style.transform = `translate(${first.left.toFixed(2)}px, ${first.top.toFixed(2)}px) scale(${u.toFixed(5)})`
      // The sheet is the one part that does NOT simply zoom: it is anchored to
      // the bottom of a box that just became a whole viewport tall, so on the
      // entry frame it sits far below where the preview's sheet was — mostly
      // off-screen. That relocation is what used to be masked by cutting its
      // opacity to 0 (the instant vanish). Instead, measure the gap now and
      // hold it in the preview's slot, then glide it home on the box's clock:
      // one continuous sheet, never hidden. Divided by u because the offset is
      // written inside the container, which the browser then scales.
      const sheetNow = dossier.getBoundingClientRect()
      enterFlip.sheetDy = (sheetFirst.bottom - sheetNow.bottom) / (u || 1)
      if (enterFlip.sheetDy) dossier.style.transform = `translateY(${enterFlip.sheetDy.toFixed(2)}px)`
    } else if (enterFlip) {
      enterFlip = null // camera had nothing to glide — no box zoom either; land now
      fsLanded()
    }
    // Paint the matched frame NOW. An IntersectionObserver callback runs
    // after this frame's rAF but before paint, so the canvas resize above
    // (which clears the bitmap) would otherwise reach the screen for one
    // frame before the draw loop repaints — a visible blank flash.
    draw(performance.now())
    // preventScroll: plain focus() scroll-reveals the button in the (still
    // programmatically scrollable) locked document — a hidden shift under the
    // overlay. Animated entries focus the pill when it appears at landing
    // (see applyEnterFlip); only the instant, reduced-motion path does it here.
    if (reduced) {
      requestAnimationFrame(() => fsLanded())
      return
    }
  }
  function exitFullscreen() {
    if (fsState !== 'fullscreen') return
    stopFsAnim()
    const finish = () => {
      stopFsAnim()
      unwireTouch() // collapsed must carry no touch listeners (see wireTouch)
      container.classList.remove('op-fs')
      container.removeAttribute('role'); container.removeAttribute('aria-modal')
      if (placeholder && placeholder.parentNode) placeholder.parentNode.insertBefore(container, placeholder) // portal back into the page
      if (placeholder) { placeholder.remove(); placeholder = null }
      unlockScroll()
      panX = 0; panY = 0 // recentre: the preview always shows the whole graph centred
      fsState = 'collapsed'
      updateViewBox(); render() // refit into the collapsed box
      draw(performance.now()) // paint before this frame ends — no blank flash on landing
      if (lastFocused && document.contains(lastFocused)) { try { lastFocused.focus({ preventScroll: true }) } catch { /* noop */ } }
      lastFocused = null
    }
    resetGesture(); suppressClick = false; stopMomentum(); hideCoach()
    unlockOverflow() // released while the overlay still hides the reflow
    // Recentre as it closes: the collapsed preview is always the whole graph
    // around the hub, never the branch that happened to be open. The glide is
    // cut to the exit's own length so the recentre and the shrink land
    // together — finish()'s refit then has nothing left to jump.
    if (focusId !== 'pm' || selId !== 'pm') { foldPan(); focusId = 'pm'; selId = 'pm'; render(!reduced, 340) }
    if (reduced) { dropScrim(0); finish(); return }
    dropScrim(520) // page fades back in around the shrinking box
    let done = false
    const end = () => { if (done) return; done = true; container.style.transformOrigin = ''; container.style.willChange = ''; finish() }
    // Reverse FLIP: shrink the fullscreen box back into the collapsed section's
    // slot (the placeholder still marks it), then drop back into the page.
    const cur = container.getBoundingClientRect()
    const tgt = placeholder ? placeholder.getBoundingClientRect() : cur
    const sx = Math.max(0.05, tgt.width / (cur.width || 1))
    const sy = Math.max(0.05, tgt.height / (cur.height || 1))
    const ox = tgt.left - cur.left, oy = tgt.top - cur.top
    container.style.transformOrigin = 'top left'
    container.style.willChange = 'transform, opacity'
    try {
      fsAnim = container.animate(
        [{ transform: 'none', opacity: 1 }, { transform: `translate(${ox}px,${oy}px) scale(${sx},${sy})`, opacity: 0.4 }],
        { duration: 380, easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)' }
      )
      fsAnim.onfinish = end; fsAnim.oncancel = end
    } catch { end(); return }
    fsSafety = window.setTimeout(end, 540) // safety if onfinish never fires
  }
  // Instant (no animation) teardown of the overlay — for dispose and for a
  // viewport crossing to desktop mid-fullscreen (tablet rotation), where the
  // mobile Close button is gone and the body must not stay locked.
  function forceCollapse() {
    if (fsState === 'collapsed') return
    stopFsAnim()
    unwireTouch()
    container.style.opacity = ''; container.style.transform = ''; container.style.transformOrigin = ''; container.style.willChange = ''
    container.classList.remove('op-fs')
    container.removeAttribute('role'); container.removeAttribute('aria-modal')
    if (placeholder && placeholder.parentNode) placeholder.parentNode.insertBefore(container, placeholder)
    if (placeholder) { placeholder.remove(); placeholder = null }
    unlockScroll()
    stopMomentum(); panX = 0; panY = 0
    dropScrim(0); hideCoach()
    fsState = 'collapsed'
  }
  // Focus set for the Tab-trap (mobile fullscreen only).
  const FOCUS_SEL = '.op-back:not([hidden]), .op-d-visit:not([hidden])'
  function getFocusables(): HTMLElement[] {
    const nodes = ORDER.filter((id) => !a11yBtn[id].hidden).map((id) => a11yBtn[id] as HTMLElement)
    const ctrls = Array.from(container.querySelectorAll<HTMLElement>(FOCUS_SEL))
    return nodes.concat(ctrls)
  }

  // ---- wire clicks / keys / resize -----------------------------------------
  const onCanvasClick = (e: MouseEvent) => {
    const id = hitTest(worldFromEvent(e))
    if (!isDesktop() && fsState === 'collapsed') {
      // The collapsed preview is inert except for NODE taps (which open the
      // overlay via onNodeClick). Empty space must do nothing at all.
      if (id) { e.stopPropagation(); onNodeClick(id) }
      return
    }
    if (id) { e.stopPropagation(); onNodeClick(id); return }
    if (focusId !== 'pm') goUp() // empty space = step back up (old bg-rect click)
  }
  const onCanvasMove = (e: MouseEvent) => {
    const id = hitTest(worldFromEvent(e))
    if (id !== hoverId) { hoverId = id; canvas.style.cursor = id ? 'pointer' : ''; requestDraw() }
  }
  const onCanvasLeave = () => { if (hoverId) { hoverId = null; canvas.style.cursor = ''; requestDraw() } }
  const onBack = () => { if (fsState === 'fullscreen') { exitFullscreen(); return } go('pm') }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (fsState === 'fullscreen') { exitFullscreen(); return } // Esc closes the overlay first
      if (focusId !== 'pm') goUp()
      return
    }
    if (e.key === 'Tab' && fsState === 'fullscreen') { // trap focus in the dialog
      const f = getFocusables(); if (!f.length) return
      const first = f[0], last = f[f.length - 1], a = document.activeElement as HTMLElement
      if (e.shiftKey && (a === first || !container.contains(a))) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && (a === last || !container.contains(a))) { e.preventDefault(); first.focus() }
    }
  }
  const onResize = () => {
    if (fsState !== 'collapsed' && isDesktop()) forceCollapse()
    // Crossing the phone/desktop breakpoint (rotation, tablet, resized window)
    // switches the fan, so the radial layout has to be rebuilt before refitting.
    if (laidOutDesktop !== isDesktop()) buildLayout(isDesktop())
    render()
  }
  pmback.addEventListener('click', onBack)
  canvas.addEventListener('click', onCanvasClick)
  canvas.addEventListener('mousemove', onCanvasMove)
  canvas.addEventListener('mouseleave', onCanvasLeave)
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', onResize)

  // ---- pan gesture (mobile FULLSCREEN only) --------------------------------
  // Driven by TOUCH events with preventDefault. iOS Safari does not reliably
  // honor touch-action on SVG content and would axis-lock, rubber-band, or
  // cancel a pointer-event drag mid-gesture. Defense in depth on WebKit:
  // touch-action:none sits on the canvas (an HTML box, where it IS honored) and
  // onDocTouchMove preventDefaults canvas-started moves at the document level so
  // the browser can never claim the drag for a native page pan — the failure
  // mode that turns every later touchmove cancelable:false and deadens the
  // handler. Collapsed / desktop: handlers are not even registered.
  let tId = -1, tSX = 0, tSY = 0, tPX0 = 0, tPY0 = 0, tMoved = false, suppressClick = false
  let tLX = 0, tLY = 0, tLT = 0, tVX = 0, tVY = 0 // last sample + velocity (units/frame)
  let tUPP = 1 // world units per CSS px, cached per gesture (no per-move layout reads)
  const DECIDE = 6
  function resetGesture() { tId = -1; tMoved = false }
  const onTouchStart = (e: TouchEvent) => {
    if (fsState !== 'fullscreen') return
    if (e.touches.length !== 1) { resetGesture(); return } // let pinch/multitouch be
    const t = e.touches[0]
    if (t.clientX < 24) { resetGesture(); return } // dodge iOS edge back-swipe
    stopMomentum(); hideCoach()
    suppressClick = false // a fresh gesture: never swallow this one's tap
    tId = t.identifier
    tUPP = VBW / (cssW || 1)
    tSX = t.clientX; tSY = t.clientY; tPX0 = panX; tPY0 = panY
    tMoved = false
    tLX = t.clientX; tLY = t.clientY; tLT = e.timeStamp; tVX = 0; tVY = 0
  }
  const onTouchMove = (e: TouchEvent) => {
    if (fsState !== 'fullscreen' || tId < 0) return
    let t: Touch | null = null
    for (let i = 0; i < e.touches.length; i++) if (e.touches[i].identifier === tId) { t = e.touches[i]; break }
    if (!t) return
    if (e.cancelable) e.preventDefault() // KEY: take the gesture from iOS entirely
    const dx = t.clientX - tSX, dy = t.clientY - tSY
    if (!tMoved) { if (Math.hypot(dx, dy) < DECIDE) return; tMoved = true }
    const m = panMax()
    panX = clampTo(tPX0 + dx * tUPP, m.x)
    panY = clampTo(tPY0 + dy * tUPP, m.y)
    const now = e.timeStamp, dt = now - tLT
    if (dt > 0) { tVX = ((t.clientX - tLX) * tUPP / dt) * 16; tVY = ((t.clientY - tLY) * tUPP / dt) * 16; tLX = t.clientX; tLY = t.clientY; tLT = now }
    requestDraw() // one synchronous canvas paint per frame — nothing to tile or defer
  }
  const onTouchEnd = () => {
    if (tId < 0) return
    if (tMoved) {
      suppressClick = true // swallow the click iOS synthesizes after a drag
      if (!reduced && Math.hypot(tVX, tVY) > 0.4) { momVX = tVX; momVY = tVY; momActive = true; requestDraw() }
    }
    resetGesture()
  }
  const onClickCapture = (e: MouseEvent) => { if (suppressClick) { e.stopPropagation(); e.preventDefault(); suppressClick = false } }
  // The pan listeners are wired ONLY while fullscreen. `passive: false` is a
  // registration-time flag: merely attaching a non-passive touchmove marks the
  // canvas's box as a non-fast-scrollable region, which pulls a swipe that starts
  // there off the compositor scroll path — and iOS WebKit then does NOT hand the
  // un-prevented gesture back to native scrolling, so the collapsed map swallowed
  // page scroll on load (desktop Chrome does hand it back, which is why it only
  // broke on iOS). Collapsed therefore carries zero touch listeners and the page
  // scrolls over the map natively. Click stays wired: node taps open the overlay.
  let touchWired = false
  function wireTouch() {
    if (touchWired) return
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false }) // non-passive: preventDefault is honored
    canvas.addEventListener('touchend', onTouchEnd)
    canvas.addEventListener('touchcancel', onTouchEnd)
    touchWired = true
  }
  function unwireTouch() {
    if (!touchWired) return
    canvas.removeEventListener('touchstart', onTouchStart)
    canvas.removeEventListener('touchmove', onTouchMove)
    canvas.removeEventListener('touchend', onTouchEnd)
    canvas.removeEventListener('touchcancel', onTouchEnd)
    touchWired = false
  }
  canvas.addEventListener('click', onClickCapture, true)

  render()
  // The world box aspect is derived from the container, whose final size isn't
  // known at mount (layout + webfonts still settling). A ResizeObserver re-fits
  // the moment the real size lands, and again on rotation; the timer is a
  // fallback for browsers without it.
  let ro: ResizeObserver | null = null
  // While the entry zoom is running, skip observer re-renders: the observer
  // fires one frame after enterFullscreen (the box's layout size changed) and
  // a plain render() SNAPS the camera to the fullscreen fit — killing the
  // glide dead while the box animation carries on alone. That one-frame-late
  // delivery is redundant anyway: enterFullscreen already refit for the new
  // size. Real resizes mid-entry (rotation) still land via onResize.
  if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(() => { if (!enterFlip) render() }); ro.observe(container) }
  const settleTimer = window.setTimeout(render, 400)
  // Label metrics + canvas text depend on the webfont; re-measure and repaint
  // when it swaps in (canvas text is rasterized, it never reflows on its own).
  try { (document as any).fonts?.ready?.then(() => { if (!disposed) render() }) } catch { /* noop */ }

  // Auto-open (mobile): opens the overlay once per page load — but only when
  // the WHOLE graph has scrolled into view, not on first contact. Triggering
  // at partial visibility felt premature, and it also poisoned the exit: the
  // scroll offset pinned at lock time was the half-arrived position, so Close
  // returned you too high. Waiting for full visibility fixes both. seenAway
  // requires the section to have been genuinely out of view first, so the
  // collapse back into a visible section can never re-trigger it, and `armed`
  // is consumed by the first entry of any kind (see enterFullscreen, which
  // also disconnects this observer). Skipped under reduced motion: grabbing
  // the viewport on scroll is exactly the surprise that preference asks to
  // avoid — a node tap still opens the overlay.
  if (typeof IntersectionObserver !== 'undefined' && !reduced) {
    io = new IntersectionObserver((ents) => {
      for (const en of ents) {
        if (en.intersectionRatio <= 0.05) { seenAway = true; continue }
        // "Fully in view": the visible slice is as tall as it can ever get —
        // the whole section (portrait, section shorter than the viewport) or
        // the whole viewport (landscape phones, where the section is taller
        // and a ratio threshold of 1 could never fire). The slack must cover
        // one threshold step (callbacks only land ON thresholds, and exactly
        // 1.0 is often never reported thanks to fractional-pixel rounding)
        // plus sub-pixel/URL-bar drift — 3% of the section, min 12px.
        const bh = en.boundingClientRect.height
        const rb = en.rootBounds
        const needed = (rb ? Math.min(bh, rb.height) : bh) - Math.max(12, bh * 0.03)
        if (en.intersectionRect.height >= needed && seenAway && armed && !isDesktop() && fsState === 'collapsed') enterFullscreen()
      }
    }, { threshold: Array.from({ length: 51 }, (_, i) => i / 50) })
    io.observe(container)
  }

  if (typeof IntersectionObserver !== 'undefined') {
    visIO = new IntersectionObserver((ents) => {
      for (const en of ents) { stageVisible = en.isIntersecting; if (stageVisible) requestDraw() }
    })
    visIO.observe(container)
  }

  return () => {
    disposed = true
    forceCollapse() // never leave <body> locked / the overlay open if unmounted mid-fullscreen
    clearTimeout(settleTimer)
    if (coachTimer) { clearTimeout(coachTimer); coachTimer = 0 }
    if (drawRAF) { cancelAnimationFrame(drawRAF); drawRAF = 0 }
    stopMomentum()
    if (io) { io.disconnect(); io = null }
    if (visIO) { visIO.disconnect(); visIO = null }
    if (ro) ro.disconnect()
    pulse = null
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('touchmove', onDocTouchMove) // idempotent belt (unlockScroll already removes it)
    window.removeEventListener('scroll', onLockedScroll)
    unwireTouch()
    container.innerHTML = '' // discards canvas + all its listeners
    container.classList.remove('op-live', 'op-at-top', 'op-fs')
  }
}
