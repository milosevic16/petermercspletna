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
// costs nothing. HTML overlays (crumbs, dossier, back, coach) are unchanged.

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
  const isDesktop = () => { try { return window.matchMedia('(min-width: 741px)').matches } catch { return true } }
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
  pmback.innerHTML = '<span class="op-back-disc" aria-hidden="true">PM</span><span class="op-back-txt"></span>'
  ;(pmback.querySelector('.op-back-txt') as HTMLElement).textContent = content.backLabel
  const crumbs = h('nav', 'op-crumbs'); crumbs.setAttribute('aria-label', 'You are here')
  const dossier = h('aside', 'op-dossier'); dossier.setAttribute('aria-live', 'polite')
  dossier.innerHTML =
    '<div class="op-dossier-in">'
    + '<button class="op-fs-exit" type="button">'
    +   '<svg class="op-fs-exit-x" viewBox="0 0 14 14" width="12" height="12" aria-hidden="true">'
    +     '<path d="M2 2 L12 12 M12 2 L2 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
    +   '</svg><span class="op-fs-exit-txt"></span>'
    + '</button>'
    + '<h3 class="op-d-name"></h3><p class="op-d-desc"></p>'
    + '<a class="op-d-visit" target="_blank" rel="noopener" hidden></a>'
    + '</div>'
  container.append(pmback, crumbs, dossier)
  const fsExit = dossier.querySelector('.op-fs-exit') as HTMLButtonElement
  ;(fsExit.querySelector('.op-fs-exit-txt') as HTMLElement).textContent = content.exit || 'Close'
  fsExit.setAttribute('aria-label', content.exit || 'Close full screen map')
  fsExit.addEventListener('click', (e) => { e.stopPropagation(); exitFullscreen() })

  // ---- state + camera -----------------------------------------------------
  let focusId = 'pm', selId = 'pm'
  let focusRingId: string | null = null
  let hoverId: string | null = null
  // ---- fullscreen-takeover state (mobile only) ----------------------------
  type FsState = 'collapsed' | 'fullscreen'
  let fsState: FsState = 'collapsed'
  let placeholder: HTMLDivElement | null = null
  let fsAnim: Animation | null = null
  let fsSafety = 0
  let lastFocused: HTMLElement | null = null
  const isFullscreen = () => fsState === 'fullscreen'
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
  // crumbs sit at the top and the dossier is a full-width sheet pinned to the
  // bottom; the camera must fit the graph into what's LEFT, or the lowest nodes
  // land under (and behind) the sheet where taps never reach them. Desktop is
  // already height-bound with no slack, so it gets no insets.
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
    const crumbH = crumbs.offsetHeight || 34
    const topPx = Math.max(crumbH, pmback.hidden ? 0 : 40)
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
    if (n.href) { v.hidden = false; v.href = n.href; v.textContent = content.visit + ' ↗' } else v.hidden = true
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
  let panX = 0, panY = 0 // drag-to-pan offset (world units)
  function setCamera(target: Cam, opts: { animate: boolean }) {
    const near = Math.abs(target.tx - cam.tx) < 0.5 && Math.abs(target.ty - cam.ty) < 0.5 && Math.abs(target.s - cam.s) < 0.002
    if (!opts.animate || reduced || near) { camActive = false; cam = { ...target }; requestDraw(); return }
    camFrom = { ...cam }; camTo = { ...target }; camT0 = 0; camActive = true
    requestDraw()
  }
  function stepCamera(now: number) {
    if (!camActive) return
    if (!camT0) camT0 = now
    const e = camEase(Math.min(1, (now - camT0) / CAM_DUR))
    cam = { tx: camFrom.tx + (camTo.tx - camFrom.tx) * e, ty: camFrom.ty + (camTo.ty - camFrom.ty) * e, s: camFrom.s + (camTo.s - camFrom.s) * e }
    if (e >= 1) camActive = false
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
  let coachEl: HTMLElement | null = null, coachTimer = 0
  function hideCoach() { if (coachEl) coachEl.classList.remove('show'); if (coachTimer) { clearTimeout(coachTimer); coachTimer = 0 } }
  function showCoach() {
    if (reduced) return
    if (!coachEl) { coachEl = h('div', 'op-coach'); coachEl.textContent = content.coach || 'Tap a node to open the map'; container.appendChild(coachEl) }
    requestAnimationFrame(() => coachEl && coachEl.classList.add('show'))
    coachTimer = window.setTimeout(hideCoach, 3400)
  }
  // One-shot, purely additive: nothing is pre-hidden, so the map can never render
  // blank if the animation is skipped/unsupported.
  function enterAnim() {
    if (reduced) return
    try {
      canvas.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
        { duration: 600, easing: 'cubic-bezier(0.2,0.7,0.2,1)', fill: 'backwards' })
    } catch { /* noop */ }
    const f = fit(focusId) // camera "breathe": settle in from ~8% zoomed-out
    cam = { tx: f.tx, ty: f.ty, s: f.s * 0.92 }
    setCamera(f, { animate: true })
    showCoach()
  }

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
  function render(animate = false) {
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
    setCamera(camTgt, { animate }) // glide on navigation, snap on layout re-renders
    // breadcrumb
    crumbs.innerHTML = ''
    path.forEach((id, i) => {
      if (i) { const s = h('span', 'op-crumb-sep'); s.textContent = '›'; crumbs.appendChild(s) }
      const b = h('button', 'op-crumb') as HTMLButtonElement; b.type = 'button'; b.textContent = id === 'pm' ? content.hub.label : byId[id].label
      b.addEventListener('click', () => go(id)); crumbs.appendChild(b)
    })
    pmback.hidden = focusId === 'pm'
    setTimeout(() => pmback.classList.toggle('show', focusId !== 'pm'), 10)
    container.classList.toggle('op-at-top', focusId === 'pm')
    pulseChain(selId)
    requestDraw()
  }
  function go(id: string) { foldPan(); focusId = id; selId = id; render(true) }
  function onNodeClick(id: string) {
    // Mobile + collapsed: one tap both enters the fullscreen takeover and drills in.
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
    const ambient = !reduced && (pulse !== null || focusId === 'pm')
    if (camActive || momActive || anims || ambient) requestDraw()
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
  // Collapsed: the map is a normal in-page section (no pan; the page scrolls past).
  // Tapping a node lifts .op-map into a position:fixed overlay and navigates in one
  // gesture. NOTE: we do NOT use position:fixed on <body> to lock scroll — on iOS
  // Safari a fixed body mis-positions fixed DESCENDANTS (the overlay ends up
  // off-screen). The real iOS scroll lock is the document-level touchmove guard
  // installed by lockScroll (see onDocTouchMove) plus touch-action:none on the
  // overlay CONTAINER; overflow:hidden on html/body is a harmless belt-and-braces
  // that never offsets fixed elements. The enter/exit animation is a plain WAAPI
  // opacity+scale FLIP on the container (an HTML box — composites fine on iOS).
  //
  // overflow:hidden on html/body is NOT a reliable touch scroll lock on iOS:
  // WebKit can still claim a drag for the document (pan/rubber-band) at gesture
  // start — and once it has, every touchmove arrives cancelable:false and the
  // canvas handler's preventDefault is silently ignored, which is exactly the
  // "pan never follows the finger" iPhone bug. A DOCUMENT-level non-passive
  // touchmove listener that calls preventDefault while fullscreen is the one
  // mechanism WebKit always honors: it forces synchronous dispatch and vetoes the
  // native gesture no matter where the touch lands. The description sheet is
  // exempt so its own overflow scroll keeps working. Registered only while
  // fullscreen so normal page scrolling never pays the synchronous-dispatch cost.
  const descEl = dossier.querySelector('.op-d-desc') as HTMLElement
  const onDocTouchMove = (e: TouchEvent) => {
    if (fsState !== 'fullscreen') return
    if (descEl && e.target instanceof Node && descEl.contains(e.target)) return
    if (e.cancelable) e.preventDefault()
  }
  function lockScroll() {
    const d = document.documentElement, b = document.body
    rootPrev.htmlOverflow = d.style.overflow; rootPrev.bodyOverflow = b.style.overflow; rootPrev.htmlOB = d.style.overscrollBehavior
    d.style.overflow = 'hidden'; b.style.overflow = 'hidden'; d.style.overscrollBehavior = 'none'
    document.addEventListener('touchmove', onDocTouchMove, { passive: false })
  }
  function unlockScroll() {
    const d = document.documentElement, b = document.body
    d.style.overflow = rootPrev.htmlOverflow; b.style.overflow = rootPrev.bodyOverflow; d.style.overscrollBehavior = rootPrev.htmlOB
    document.removeEventListener('touchmove', onDocTouchMove)
  }
  function stopFsAnim() { if (fsAnim) { try { fsAnim.cancel() } catch { /* noop */ } fsAnim = null } if (fsSafety) { clearTimeout(fsSafety); fsSafety = 0 } }
  function enterFullscreen() {
    if (isDesktop() || fsState !== 'collapsed') return
    stopFsAnim()
    fsState = 'fullscreen' // pan works immediately; the animation is cosmetic
    wireTouch()            // pan listeners exist only while fullscreen
    lastFocused = (document.activeElement as HTMLElement) || null
    hideCoach()
    placeholder = document.createElement('div')
    placeholder.className = 'op-map-ph'
    const first = container.getBoundingClientRect() // collapsed box, BEFORE portal, for the FLIP
    placeholder.style.height = first.height + 'px'
    placeholder.style.marginTop = getComputedStyle(container).marginTop
    container.parentNode!.insertBefore(placeholder, container)
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
    updateViewBox(); render() // fit the camera into the fullscreen box
    // preventScroll: plain focus() scroll-reveals the button in the (still
    // programmatically scrollable) locked document — a hidden shift under the overlay.
    requestAnimationFrame(() => { try { fsExit.focus({ preventScroll: true }) } catch { /* noop */ } })
    if (reduced) return
    // FLIP: grow the fullscreen box out of the collapsed section's box. WAAPI on
    // the container (HTML) — composited, smooth on iOS.
    const last = container.getBoundingClientRect()
    const sx = Math.max(0.05, first.width / (last.width || 1))
    const sy = Math.max(0.05, first.height / (last.height || 1))
    const ox = first.left - last.left, oy = first.top - last.top
    container.style.transformOrigin = 'top left'
    container.style.willChange = 'transform, opacity'
    try {
      fsAnim = container.animate(
        [{ transform: `translate(${ox}px,${oy}px) scale(${sx},${sy})`, opacity: 0.55 },
         { opacity: 1, offset: 0.45 },
         { transform: 'translate(0px,0px) scale(1,1)', opacity: 1 }],
        { duration: 520, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      )
      fsAnim.onfinish = () => { container.style.transformOrigin = ''; container.style.willChange = ''; fsAnim = null }
    } catch { container.style.transformOrigin = ''; container.style.willChange = '' }
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
      panX = 0; panY = 0
      fsState = 'collapsed'
      updateViewBox(); render() // refit into the collapsed box
      if (lastFocused && document.contains(lastFocused)) { try { lastFocused.focus({ preventScroll: true }) } catch { /* noop */ } }
      lastFocused = null
    }
    resetGesture(); suppressClick = false; stopMomentum()
    if (reduced) { finish(); return }
    let done = false
    const end = () => { if (done) return; done = true; container.style.transformOrigin = ''; container.style.willChange = ''; finish() }
    // Reverse FLIP: shrink the fullscreen box back into the collapsed section's slot
    // (the placeholder still marks it), then drop back into the page.
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
        { duration: 360, easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)' }
      )
      fsAnim.onfinish = end; fsAnim.oncancel = end
    } catch { end(); return }
    fsSafety = window.setTimeout(end, 520) // safety if onfinish never fires
  }
  // Instant (no animation) teardown of the overlay — for teardown and for a
  // viewport crossing to desktop mid-fullscreen (tablet rotation), where the
  // mobile exit button is gone and the body must not stay locked.
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
    fsState = 'collapsed'
  }
  // Focus set for the Tab-trap (mobile fullscreen only).
  const FOCUS_SEL = '.op-back:not([hidden]), .op-crumb, .op-fs-exit, .op-d-visit:not([hidden])'
  function getFocusables(): HTMLElement[] {
    const nodes = ORDER.filter((id) => !a11yBtn[id].hidden).map((id) => a11yBtn[id] as HTMLElement)
    const ctrls = Array.from(container.querySelectorAll<HTMLElement>(FOCUS_SEL))
    return nodes.concat(ctrls)
  }

  // ---- wire clicks / keys / resize -----------------------------------------
  const onCanvasClick = (e: MouseEvent) => {
    const id = hitTest(worldFromEvent(e))
    if (id) { e.stopPropagation(); onNodeClick(id); return }
    if (focusId !== 'pm') goUp() // empty space = step back up (old bg-rect click)
  }
  const onCanvasMove = (e: MouseEvent) => {
    const id = hitTest(worldFromEvent(e))
    if (id !== hoverId) { hoverId = id; canvas.style.cursor = id ? 'pointer' : ''; requestDraw() }
  }
  const onCanvasLeave = () => { if (hoverId) { hoverId = null; canvas.style.cursor = ''; requestDraw() } }
  const onBack = () => go('pm')
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (isFullscreen()) { exitFullscreen(); return } // Esc leaves fullscreen first
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
  // honor touch-action on SVG/canvas content and would axis-lock, rubber-band, or
  // cancel a pointer-event drag mid-gesture. Defense in depth on WebKit:
  // touch-action:none also sits on the fullscreen CONTAINER (an HTML box, where
  // it IS honored), and onDocTouchMove (see lockScroll) preventDefaults at the
  // document level so the browser can never claim the drag for a native page
  // pan — the failure mode that turns every later touchmove cancelable:false and
  // deadens the handler. Collapsed/desktop: handlers no-op, page scrolls.
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
  // scrolls over the map natively. Click stays wired: taps must still open the map.
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
  if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(() => render()); ro.observe(container) }
  const settleTimer = window.setTimeout(render, 400)
  // Label metrics + canvas text depend on the webfont; re-measure and repaint
  // when it swaps in (canvas text is rasterized, it never reflows on its own).
  try { (document as any).fonts?.ready?.then(() => render()) } catch { /* noop */ }

  // Entrance: when the section scrolls into view on mobile, lift the map in,
  // settle the camera, and flash a one-time coach hint. One-shot; additive.
  if (typeof IntersectionObserver !== 'undefined' && !isDesktop() && !reduced) {
    io = new IntersectionObserver((ents) => {
      for (const en of ents) if (en.intersectionRatio >= 0.6) { if (io) io.disconnect(); io = null; enterAnim(); break }
    }, { threshold: [0, 0.6, 1] })
    io.observe(container)
  }

  return () => {
    forceCollapse() // never leave <body> locked / the overlay open if unmounted mid-fullscreen
    clearTimeout(settleTimer)
    if (drawRAF) { cancelAnimationFrame(drawRAF); drawRAF = 0 }
    stopMomentum()
    if (coachTimer) { clearTimeout(coachTimer); coachTimer = 0 }
    if (io) { io.disconnect(); io = null }
    if (ro) ro.disconnect()
    pulse = null
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('touchmove', onDocTouchMove) // idempotent belt (unlockScroll already removes it)
    unwireTouch()
    container.innerHTML = '' // discards canvas + all its listeners
    container.classList.remove('op-live', 'op-at-top', 'op-fs')
  }
}
