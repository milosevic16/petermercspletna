// Operating map — a zoomable radial drill-down graph, built client-side on top
// of the server-rendered fallback list (which carries the SEO content). One
// fixed radial layout: PM hub at centre, categories around it, each branch
// fanning outward; focusing a node glides the camera outward along the spoke
// while the spine back to PM stays faintly drawn. Runs in onMounted only.

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
}

const NS = 'http://www.w3.org/2000/svg'
const NODE_FILL = '#5C5850' // warm grey — reads grey on graphite, not black
const NODE_STROKE = '#948E81'
const BRANCH_STROKE = '#B4AEA1'

export function initOpMap(container: HTMLElement, content: OpMapContent): () => void {
  const reduced = (() => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { return false } })()
  const isDesktop = () => { try { return window.matchMedia('(min-width: 741px)').matches } catch { return true } }

  // ---- flatten tree + fixed radial layout ---------------------------------
  type N = { key: string; label: string; name: string; desc: string; href: string; depth: number; x: number; y: number; parent: string | null; kids: string[]; leaf: boolean }
  const byId: Record<string, N> = {}
  const R = [0, 200, 380, 520]
  const FAN: Record<number, number> = { 1: 26, 2: 14 }
  const rd = (d: number) => ((d - 90) * Math.PI) / 180
  function place(node: OpMapNode, depth: number, angle: number, parent: string | null) {
    const kids = node.children || []
    byId[node.key] = {
      key: node.key, label: node.label, name: node.name || node.label, desc: node.desc, href: node.href || '',
      depth, parent, kids: kids.map((k) => k.key), leaf: kids.length === 0,
      x: depth === 0 ? 0 : R[depth] * Math.cos(rd(angle)), y: depth === 0 ? 0 : R[depth] * Math.sin(rd(angle)),
    }
    if (depth === 0) kids.forEach((k, i) => place(k, 1, -90 + i * (360 / kids.length), node.key))
    else { const h = FAN[depth] || 12, n = kids.length; kids.forEach((k, i) => place(k, depth + 1, n === 1 ? angle : angle - h + (2 * h * i) / (n - 1), node.key)) }
  }
  const hubNode: OpMapNode = { key: 'pm', label: content.hub.label, name: content.hub.name, desc: content.hub.desc, href: content.hub.href, children: content.tree }
  place(hubNode, 0, 0, null)
  // Farthest node from centre (~R[3]=520) + margin; clamps mobile drag-pan so the
  // graph can be explored past the current fit but never dragged fully off-screen.
  const GEXT = Math.max(0, ...Object.values(byId).map((n) => Math.max(Math.abs(n.x), Math.abs(n.y)))) + 60

  function ancestors(id: string) { const a: string[] = []; let c: string | null = id; while (c) { a.unshift(c); c = byId[c].parent } return a }

  // ---- build DOM ----------------------------------------------------------
  container.innerHTML = ''
  container.classList.add('op-live')
  const el = (t: string, a?: Record<string, string>) => { const e = document.createElementNS(NS, t); if (a) for (const k in a) e.setAttribute(k, a[k]); return e }
  const h = (t: string, cls?: string) => { const e = document.createElement(t); if (cls) e.className = cls; return e }

  const svg = el('svg', { id: 'op-svg', viewBox: '-520 -360 1040 720', preserveAspectRatio: 'xMidYMid meet', role: 'application', 'aria-label': content.hub.name + ' — operating map' }) as SVGSVGElement
  const gdefs = el('defs')
  const bg = el('rect', { id: 'op-bg', x: '-520', y: '-360', width: '1040', height: '720', fill: 'transparent' })
  const camera = el('g', { id: 'op-camera' })
  const edgesG = el('g', { id: 'op-edges' }), nodesG = el('g', { id: 'op-nodes' })
  const fxLayer = el('g', { id: 'op-fx', 'aria-hidden': 'true' }); (fxLayer as SVGElement).style.pointerEvents = 'none'
  const focusName = el('text', { id: 'op-focusname' })
  const pmhub = el('g', { id: 'op-hub' })
  pmhub.appendChild(el('circle', { class: 'op-core', r: '32' }))
  pmhub.appendChild(el('circle', { class: 'op-ring', r: '40' }))
  const pmTxt = el('text', { 'text-anchor': 'middle', y: '6.5', 'font-size': '18' }); pmTxt.textContent = content.hub.label; pmhub.appendChild(pmTxt)
  camera.append(edgesG, nodesG, focusName, pmhub, fxLayer)
  svg.append(gdefs, bg, camera)
  container.appendChild(svg)

  // overlays (HTML)
  const pmback = h('button', 'op-back') as HTMLButtonElement; pmback.type = 'button'; pmback.hidden = true
  pmback.innerHTML = '<span class="op-back-disc" aria-hidden="true">PM</span><span class="op-back-txt"></span>'
  ;(pmback.querySelector('.op-back-txt') as HTMLElement).textContent = content.backLabel
  const crumbs = h('nav', 'op-crumbs'); crumbs.setAttribute('aria-label', 'You are here')
  const dossier = h('aside', 'op-dossier'); dossier.setAttribute('aria-live', 'polite')
  dossier.innerHTML = '<div class="op-dossier-in"><h3 class="op-d-name"></h3><p class="op-d-desc"></p><a class="op-d-visit" target="_blank" rel="noopener" hidden></a></div>'
  container.append(pmback, crumbs, dossier)

  // ---- render helpers -----------------------------------------------------
  function wrap(s: string, m: number) { const w = s.split(' '), o: string[] = []; let line = ''; for (const x of w) { if ((line + ' ' + x).trim().length > m && line) { o.push(line.trim()); line = x } else line = (line + ' ' + x).trim() } if (line) o.push(line); return o }

  const nodeEls: Record<string, SVGGElement> = {}, edgeEls: Record<string, SVGLineElement> = {}
  Object.values(byId).forEach((node) => {
    if (node.parent) {
      const p = byId[node.parent]
      const grad = el('linearGradient', { id: 'opg-' + node.key, gradientUnits: 'userSpaceOnUse', x1: String(p.x), y1: String(p.y), x2: String(node.x), y2: String(node.y) })
      grad.appendChild(el('stop', { offset: '0', 'stop-color': '#ECE7DC', 'stop-opacity': '0.16' }))
      grad.appendChild(el('stop', { offset: '0.55', 'stop-color': '#ECE7DC', 'stop-opacity': '0.05' }))
      grad.appendChild(el('stop', { offset: '1', 'stop-color': '#ECE7DC', 'stop-opacity': '0' }))
      gdefs.appendChild(grad)
      const ln = el('line', { x1: String(p.x), y1: String(p.y), x2: String(node.x), y2: String(node.y), class: 'op-edge' }) as SVGLineElement
      edgesG.appendChild(ln); edgeEls[node.key] = ln
    }
    if (node.key === 'pm') return
    const isCat = node.depth === 1
    const g = el('g', { class: 'op-node' + (isCat ? ' op-cat' : '') + (node.kids.length ? ' op-branch' : ''), tabindex: '0', role: 'button', 'aria-label': node.name }) as SVGGElement
    // generous invisible tap target (touch); only active nodes take pointer events
    g.appendChild(el('circle', { class: 'op-hit', cx: String(node.x), cy: String(node.y), r: '34', fill: 'transparent' }))
    g.appendChild(el('circle', { class: 'op-dot', cx: String(node.x), cy: String(node.y), r: isCat ? '14' : '12', fill: NODE_FILL, stroke: node.kids.length ? BRANCH_STROKE : NODE_STROKE }))
    // Label text only — its geometry (anchor, offset, wrap, font size) is set per
    // render() so it can track the live node radius and, on mobile, a font size
    // pinned in CSS px (counter-scaled against the camera) instead of shrinking.
    const txt = el('text', { class: 'op-lbl' })
    g.appendChild(txt); nodesG.appendChild(g); nodeEls[node.key] = g
    g.addEventListener('click', (e) => { e.stopPropagation(); onNodeClick(node.key) })
    g.addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNodeClick(node.key) } })
  })

  // ---- state + render -----------------------------------------------------
  let focusId = 'pm', selId = 'pm'
  // The viewBox follows the container's aspect ratio so the map FILLS it. A
  // fixed wide viewBox got letterboxed into a portrait phone, shrinking every
  // node to ~5px — untappable.
  let VBW = 1040, VBH = 760
  function updateViewBox() {
    const r = container.getBoundingClientRect()
    const w = r.width || 1, hh = r.height || 1
    VBH = 760
    VBW = Math.max(200, Math.round(VBH * (w / hh)))
    svg.setAttribute('viewBox', `${Math.round(-VBW / 2)} ${Math.round(-VBH / 2)} ${VBW} ${VBH}`)
  }
  const OP = { active: 1, spine: 0.5, hint: 0, context: 0 }
  // Viewport space the HTML overlays occupy, in viewBox units. On mobile the
  // crumbs sit at the top and the dossier is a full-width sheet pinned to the
  // bottom; the camera must fit the graph into what's LEFT, or the lowest nodes
  // land under (and behind) the sheet where taps never reach them. Desktop is
  // already height-bound with no slack, so it gets no insets.
  function insets() {
    const px2u = VBH / (container.getBoundingClientRect().height || 1)
    if (isDesktop()) {
      // The dossier is a bottom-left card. Desktop has no vertical slack (it's
      // height-bound) but lots of horizontal slack, so reserve the card's column
      // on the LEFT (+ a little room on the right for outward labels) and centre
      // the map between them — it slides clear of the card without shrinking.
      const leftPx = dossier.classList.contains('show') ? dossier.getBoundingClientRect().width + 30 : 0
      return { top: 0, bottom: 0, left: leftPx * px2u, right: (leftPx ? 150 : 0) * px2u }
    }
    const crumbH = crumbs.getBoundingClientRect().height || 34
    const topPx = Math.max(crumbH, pmback.hidden ? 0 : 40)
    const sheetH = dossier.getBoundingClientRect().height || 170
    // +28 at the bottom so the lowest node's dot clears the sheet (the band
    // centres node CENTRES; the dot extends below its centre). ~26px each side
    // keeps the centred category labels on screen when the fit is width-bound on
    // a narrow phone, without starving the scale on wider ones.
    const sidePx = 26
    return { top: (topPx + 8) * px2u, bottom: (sheetH + 28) * px2u, left: sidePx * px2u, right: sidePx * px2u }
  }
  function fit(id: string) {
    const path = ancestors(id), childIds = byId[id].kids
    const ids: Record<string, 1> = {}; path.concat(childIds).concat(['pm']).forEach((k) => (ids[k] = 1))
    const pts = Object.keys(ids).map((k) => [byId[k].x, byId[k].y])
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
    const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys)
    // Mobile has no inline descriptions, so vertical padding can be much tighter
    // there; horizontal stays generous for the side labels.
    const pad = isDesktop() ? 105 : 70
    const bw = maxx - minx + pad * 2, bh = maxy - miny + pad * 2, cx = (minx + maxx) / 2, cy = (miny + maxy) / 2
    const ins = insets()
    const availH = Math.max(160, VBH - ins.top - ins.bottom)
    const availW = Math.max(160, VBW - ins.left - ins.right)
    let s = Math.min(availW / bw, availH / bh); s = Math.max(0.6, Math.min(s, 2.6))
    const bandCx = -VBW / 2 + ins.left + availW / 2 // horizontal centre of the free band
    const bandCy = -VBH / 2 + ins.top + availH / 2 // vertical centre of the free band
    // Numbers, not a transform string: the camera tween interpolates tx/ty/s
    // independently (exactly how the old CSS transition decomposed the list), and
    // applyCamera() adds the pan offset before writing the attribute.
    return { tx: bandCx - s * cx, ty: bandCy - s * cy, s }
  }
  function setDossier(id: string) {
    const n = byId[id]
    ;(dossier.querySelector('.op-d-name') as HTMLElement).textContent = n.name
    ;(dossier.querySelector('.op-d-desc') as HTMLElement).textContent = n.desc
    const v = dossier.querySelector('.op-d-visit') as HTMLAnchorElement
    if (n.href) { v.hidden = false; v.href = n.href; v.textContent = content.visit + ' ↗' } else v.hidden = true
    dossier.classList.add('show')
  }
  // ---- camera tween -------------------------------------------------------
  // iOS Safari/WebKit does NOT run CSS transitions on an SVG <g>'s transform
  // *attribute* (only on the CSS transform *property*), so the old
  // "#op-camera { transition: transform … }" snapped instantly on iPhone while
  // gliding on Chrome. We drop that CSS rule and tween the attribute ourselves
  // with rAF: works identically on iOS Safari, Chrome, Firefox, matches the
  // desktop feel (same 0.82s cubic-bezier, and translate/scale eased
  // independently — exactly how the CSS transition decomposed the list), and
  // composes with a future drag-to-pan (applyCamera adds panX/panY every frame).
  type Cam = { tx: number; ty: number; s: number }
  let cam: Cam = { tx: 0, ty: 0, s: 1 }   // camera as currently painted
  let camFrom: Cam = cam, camTo: Cam = cam
  let camRAF = 0, camT0 = 0
  const CAM_DUR = 820                       // ms — was the CSS 0.82s
  let panX = 0, panY = 0                    // drag-to-pan offset (viewBox units); 0 today

  // cubic-bezier(0.38,0.02,0.18,1) solved in JS (Newton + bisection fallback),
  // so the JS tween is byte-for-byte the desktop easing curve.
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
  const camEase = makeBezier(0.38, 0.02, 0.18, 1)

  // Single writer of the camera transform: base tween (cam) + live pan offset.
  function applyCamera() {
    camera.setAttribute('transform', `translate(${(cam.tx + panX).toFixed(2)} ${(cam.ty + panY).toFixed(2)}) scale(${cam.s.toFixed(4)})`)
  }
  function setCamera(target: Cam, opts: { animate: boolean }) {
    if (camRAF) { cancelAnimationFrame(camRAF); camRAF = 0 } // interrupt any glide in flight
    const near = Math.abs(target.tx - cam.tx) < 0.5 && Math.abs(target.ty - cam.ty) < 0.5 && Math.abs(target.s - cam.s) < 0.002
    if (!opts.animate || reduced || near) { cam = { tx: target.tx, ty: target.ty, s: target.s }; applyCamera(); return }
    camFrom = { tx: cam.tx, ty: cam.ty, s: cam.s } // start from wherever we are now → seamless mid-glide re-aim
    camTo = { tx: target.tx, ty: target.ty, s: target.s }
    camT0 = 0
    const step = (now: number) => {
      if (!camT0) camT0 = now
      const e = camEase(Math.min(1, (now - camT0) / CAM_DUR))
      cam = { tx: camFrom.tx + (camTo.tx - camFrom.tx) * e, ty: camFrom.ty + (camTo.ty - camFrom.ty) * e, s: camFrom.s + (camTo.s - camFrom.s) * e }
      applyCamera()
      camRAF = e < 1 ? requestAnimationFrame(step) : 0
    }
    camRAF = requestAnimationFrame(step)
  }

  // ---- drag-to-pan + entrance (mobile only) -------------------------------
  function clampPan() {
    const maxX = Math.max(0, cam.s * GEXT - VBW / 2 + 40)
    const maxY = Math.max(0, cam.s * GEXT - VBH / 2 + 40)
    panX = Math.max(-maxX, Math.min(maxX, panX))
    panY = Math.max(-maxY, Math.min(maxY, panY))
  }
  let momRAF = 0
  function stopMomentum() { if (momRAF) { cancelAnimationFrame(momRAF); momRAF = 0 } camera.style.willChange = '' }
  // Fold the live pan offset into the base camera and zero it, so a navigation
  // glide starts from exactly where the eye is (no snap-back of the pan on nav).
  function foldPan() { if (panX || panY) { cam.tx += panX; cam.ty += panY; panX = 0; panY = 0 } stopMomentum() }

  let io: IntersectionObserver | null = null
  let coachEl: HTMLElement | null = null, coachTimer = 0
  function hideCoach() { if (coachEl) coachEl.classList.remove('show'); if (coachTimer) { clearTimeout(coachTimer); coachTimer = 0 } }
  function showCoach() {
    if (reduced) return
    if (!coachEl) { coachEl = h('div', 'op-coach'); coachEl.textContent = content.coach || 'Tap a node · drag to look around'; container.appendChild(coachEl) }
    requestAnimationFrame(() => coachEl && coachEl.classList.add('show'))
    coachTimer = window.setTimeout(hideCoach, 3400)
  }
  // One-shot, purely additive: nothing is pre-hidden, so the map can never render
  // blank if the animation is skipped/unsupported.
  function enterAnim() {
    if (reduced) return
    try {
      svg.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
        { duration: 600, easing: 'cubic-bezier(0.2,0.7,0.2,1)', fill: 'backwards' })
    } catch { /* noop */ }
    const f = fit(focusId) // camera "breathe": settle in from ~8% zoomed-out
    cam = { tx: f.tx, ty: f.ty, s: f.s * 0.92 }; applyCamera()
    setCamera(f, { animate: true })
    showCoach()
  }

  // Animate ONLY on user navigation (go/onNodeClick/goUp/back/hub). Layout-driven
  // re-renders (resize/observer/settle/fonts) snap so they never tween.
  function render(animate = false) {
    const path = ancestors(focusId), childIds = byId[focusId].kids
    const grand: Record<string, 1> = {}; childIds.forEach((c) => byId[c].kids.forEach((g) => (grand[g] = 1)))
    const tier = (id: string): keyof typeof OP => (id === focusId || childIds.indexOf(id) >= 0) ? 'active' : path.indexOf(id) >= 0 ? 'spine' : grand[id] ? 'hint' : 'context'
    const desktop = isDesktop()
    // The dossier window is the single description surface, desktop and mobile:
    // select a node and its description shows here. Fill it BEFORE fit() so its
    // measured height (mobile, where it's a full-width sheet) can be reserved out
    // of the camera's usable band, otherwise the lowest nodes sit behind it.
    setDossier(selId)
    updateViewBox()
    const camTgt = fit(focusId)
    // CSS px per user unit at the current camera; lets us pin on-screen sizes.
    const rect = container.getBoundingClientRect()
    const ppu = Math.min((rect.width || 1) / VBW, (rect.height || 1) / VBH)
    const k = camTgt.s * ppu || 1
    Object.keys(nodeEls).forEach((id) => {
      const g = nodeEls[id], node = byId[id], t = tier(id), active = t === 'active'
      g.style.opacity = String(OP[t])
      g.classList.toggle('op-click', active)
      g.classList.toggle('op-focus', id === focusId)
      g.classList.toggle('op-sel', id === selId && id !== focusId)
      // bigger nodes + far bigger tap targets on touch
      const rDot = id === focusId ? (desktop ? 18 : 25) : node.depth === 1 ? (desktop ? 14 : 20) : (desktop ? 12 : 18)
      ;(g.querySelector('.op-dot') as SVGCircleElement).setAttribute('r', String(rDot))
      ;(g.querySelector('.op-hit') as SVGCircleElement).setAttribute('r', String(rDot + (desktop ? 14 : 26)))
      // Label: geometry tracks the live radius; on mobile the font is pinned to a
      // fixed CSS px size (14/15px) by expressing it in counter-scaled user units,
      // so it stays legible and never rescales as the camera zooms. Desktop keeps
      // its original 13.5/14.5-unit sizing, so its output is byte-identical.
      const lbl = g.querySelector('.op-lbl') as SVGTextElement
      lbl.style.opacity = (active && id !== focusId) ? '1' : '0'
      if (node.parent) {
        const isCat = node.depth === 1
        const fsU = desktop ? (isCat ? 13.5 : 14.5) : (isCat ? 12.5 : 14) / k
        const pn = byId[node.parent], dxp = node.x - pn.x, dyp = node.y - pn.y
        const gap = rDot + 9
        const lns = wrap(node.label, desktop ? 20 : 13)
        // Long uppercase category labels clip if placed to the side at the
        // horizontal extremes of a narrow phone, so centre those above/below the
        // node instead. Vertical-extreme categories keep side labels (they have
        // the horizontal room). Desktop + deeper nodes: original side/middle logic.
        let anchor: string, tx: number, ty: number
        if (!desktop && isCat && Math.abs(node.x) > Math.abs(node.y)) {
          anchor = 'middle'; tx = node.x
          ty = node.y >= 0 ? node.y + gap + fsU : node.y - gap - (lns.length - 1) * fsU
        } else {
          anchor = Math.abs(dxp) < 18 ? 'middle' : dxp > 0 ? 'start' : 'end'
          tx = node.x + (anchor === 'middle' ? 0 : dxp > 0 ? gap : -gap)
          ty = node.y + (anchor === 'middle'
            ? (dyp >= 0 ? gap + fsU : -gap - (lns.length - 1) * fsU)
            : fsU * 0.34 - (lns.length - 1) * fsU * 0.5)
        }
        if (lbl.getAttribute('data-lines') !== lns.join('|')) {
          lbl.textContent = ''
          lns.forEach((l) => { const ts = el('tspan'); ts.textContent = l; lbl.appendChild(ts) })
          lbl.setAttribute('data-lines', lns.join('|'))
        }
        lbl.setAttribute('x', tx.toFixed(1)); lbl.setAttribute('y', ty.toFixed(1)); lbl.setAttribute('text-anchor', anchor)
        lbl.style.fontSize = fsU.toFixed(2) + 'px'
        Array.from(lbl.children).forEach((ts, i) => { (ts as SVGTSpanElement).setAttribute('x', tx.toFixed(1)); (ts as SVGTSpanElement).setAttribute('dy', i ? fsU.toFixed(1) : '0') })
      }
    })
    Object.keys(edgeEls).forEach((id) => {
      const t = tier(id), e = edgeEls[id]
      e.setAttribute('stroke-width', (1.3 / camTgt.s).toFixed(2))
      if (t === 'active' || t === 'spine') e.setAttribute('stroke', 'rgba(236,231,220,' + (t === 'active' ? 0.5 : 0.4) + ')')
      else e.setAttribute('stroke', 'url(#opg-' + id + ')')
    })
    pmhub.style.opacity = String(OP[tier('pm')])
    pmhub.classList.toggle('op-top', focusId === 'pm')
    if (focusId !== 'pm') {
      const f = byId[focusId]; focusName.textContent = f.label; focusName.setAttribute('x', String(f.x))
      if (desktop) { focusName.style.fontSize = ''; focusName.setAttribute('y', (f.y + 38).toFixed(1)) }
      else { const fnU = 18 / k; focusName.style.fontSize = fnU.toFixed(2) + 'px'; focusName.setAttribute('y', (f.y + 25 + fnU * 0.92 + 5).toFixed(1)) }
      focusName.classList.add('on')
    } else focusName.classList.remove('on')
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
    // (dossier is set at the top of render(), before fit() measures it)
    pulseChain(selId)
  }
  function go(id: string) { foldPan(); focusId = id; selId = id; render(true) }
  function onNodeClick(id: string) {
    if (id === focusId) { goUp(); return }
    const n = byId[id]
    if (n.kids.length) go(id); else { foldPan(); selId = id; render(true) }
  }
  function goUp() { const p = byId[focusId].parent; if (p) go(p); else { foldPan(); selId = 'pm'; render(true) } }

  // ---- traveling pulse (ported from the previous graph's _pulseChain) ------
  let pulseAnims: Animation[] = [], pulseTimer = 0, pulseEl: SVGGElement | null = null
  function pulseStop() {
    pulseAnims.forEach((a) => { try { a.cancel() } catch { /* noop */ } }); pulseAnims = []
    if (pulseTimer) { clearInterval(pulseTimer); pulseTimer = 0 }
    if (pulseEl && pulseEl.parentNode) pulseEl.parentNode.removeChild(pulseEl); pulseEl = null
  }
  function pulseChain(key: string) {
    pulseStop()
    if (reduced || key === 'pm') return
    const chain: { x: number; y: number }[] = []; let pk: string | null = key, guard = 0
    while (pk && guard++ < 16) { chain.push({ x: byId[pk].x, y: byId[pk].y }); if (pk === 'pm') break; pk = byId[pk].parent }
    if (chain.length < 2) return
    const start = chain[0]
    const cum = [0]; let total = 0
    for (let i = 1; i < chain.length; i++) { total += Math.hypot(chain[i].x - chain[i - 1].x, chain[i].y - chain[i - 1].y); cum.push(total) }
    const dwell = 0.11, mids = Math.max(0, chain.length - 2), travelFrac = 1 - dwell * mids
    const dur = Math.round((950 + total * 2.6) / travelFrac)
    const g = el('g') as SVGGElement; (g as SVGElement).style.pointerEvents = 'none'
    g.appendChild(el('circle', { cx: String(start.x), cy: String(start.y), r: '10', fill: 'var(--accent)', opacity: '0.16' }))
    g.appendChild(el('circle', { cx: String(start.x), cy: String(start.y), r: '4.5', fill: 'var(--accent)' }))
    fxLayer.appendChild(g)
    const moveKf: Keyframe[] = []; let acc = 0
    chain.forEach((w, i) => {
      const tf = `translate(${(w.x - start.x).toFixed(1)}px,${(w.y - start.y).toFixed(1)}px)`
      const off = (total ? cum[i] / total : i / (chain.length - 1)) * travelFrac
      moveKf.push({ transform: tf, offset: +(off + acc).toFixed(4) })
      if (i > 0 && i < chain.length - 1) { acc += dwell; moveKf.push({ transform: tf, offset: +(off + acc).toFixed(4) }) }
    })
    const fadeKf: Keyframe[] = [{ opacity: 0, offset: 0 }, { opacity: 1, offset: 0.14 }, { opacity: 1, offset: 0.8 }, { opacity: 0, offset: 1 }]
    if (g.animate) {
      pulseAnims.push(g.animate(moveKf, { duration: dur, easing: 'linear', iterations: Infinity }))
      pulseAnims.push(g.animate(fadeKf, { duration: dur, easing: 'ease-in-out', iterations: Infinity }))
    }
    pulseEl = g
    const beat = () => {
      const core = pmhub.querySelector('.op-core') as SVGElement
      if (core && (core as any).animate) { core.style.transformBox = 'fill-box'; core.style.transformOrigin = 'center'; core.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.13)' }, { transform: 'scale(1)' }], { duration: 440, easing: 'cubic-bezier(0.2,0.7,0.2,1)' }) }
    }
    pulseTimer = window.setInterval(beat, dur)
  }

  // ---- wire back / bg / keys / resize -------------------------------------
  const onBack = () => go('pm')
  const onBg = () => { if (focusId !== 'pm') goUp() }
  const onHub = () => { if (focusId !== 'pm') go('pm') }
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && focusId !== 'pm') goUp() }
  const onResize = () => render()
  pmback.addEventListener('click', onBack)
  bg.addEventListener('click', onBg)
  ;(pmhub as SVGElement).style.cursor = 'pointer'
  pmhub.addEventListener('click', onHub)
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', onResize)

  // ---- pan gesture (mobile only; every handler no-ops on desktop) ----------
  // Anti-trap by construction: #op-svg has touch-action:pan-y on mobile, so a
  // vertical (or vertical-dominant) swipe is ALWAYS a native page scroll the JS
  // never sees — the user can always scroll out of the section. Only a clearly
  // horizontal stroke is captured as a pan.
  let pid = -1, decided = 0 // 0 undecided, 1 pan, -1 let the page scroll
  let startX = 0, startY = 0, panStartX = 0, panStartY = 0
  let moved = false, suppressClick = false
  let lastVX = 0, lastVY = 0
  const DECIDE = 8
  function startMomentum() {
    let vx = lastVX, vy = lastVY
    const stepM = () => {
      vx *= 0.92; vy *= 0.92
      if (Math.hypot(vx, vy) < 0.3) { stopMomentum(); return }
      panX += vx; panY += vy; clampPan(); applyCamera()
      momRAF = requestAnimationFrame(stepM)
    }
    momRAF = requestAnimationFrame(stepM)
  }
  const onPointerDown = (e: PointerEvent) => {
    if (isDesktop()) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if (e.pointerType === 'touch' && e.clientX < 24) return // dodge iOS edge back-swipe
    stopMomentum(); hideCoach()
    pid = e.pointerId; decided = 0; moved = false
    startX = e.clientX; startY = e.clientY; panStartX = panX; panStartY = panY
    lastVX = 0; lastVY = 0
  }
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerId !== pid) return
    const dx = e.clientX - startX, dy = e.clientY - startY
    if (decided === 0) {
      if (Math.hypot(dx, dy) < DECIDE) return
      if (Math.abs(dx) > Math.abs(dy) * 1.2) { decided = 1; try { svg.setPointerCapture(pid) } catch { /* noop */ } camera.style.willChange = 'transform' }
      else { decided = -1; pid = -1; return } // vertical → let touch-action:pan-y scroll the page
    }
    if (decided === 1) {
      e.preventDefault(); moved = true
      const rect = svg.getBoundingClientRect()
      const uPerPx = VBW / (rect.width || 1) // translate is outside scale → px→units is scale-independent
      const pvx = panX, pvy = panY
      panX = panStartX + dx * uPerPx; panY = panStartY + dy * uPerPx
      clampPan()
      lastVX = panX - pvx; lastVY = panY - pvy // units/frame, for momentum
      applyCamera() // transform write only — never render() during a pan
    }
  }
  const endDrag = (e: PointerEvent) => {
    if (e.pointerId !== pid && decided !== 1) return
    if (decided === 1) {
      try { svg.releasePointerCapture(e.pointerId) } catch { /* noop */ }
      suppressClick = moved
      if (moved && !reduced && Math.hypot(lastVX, lastVY) > 0.4) startMomentum()
      else camera.style.willChange = ''
    }
    pid = -1; decided = 0
  }
  // Swallow the synthetic click that follows a drag so a pan never navigates.
  const onClickCapture = (e: MouseEvent) => { if (suppressClick) { e.stopPropagation(); e.preventDefault(); suppressClick = false } }
  svg.addEventListener('pointerdown', onPointerDown)
  svg.addEventListener('pointermove', onPointerMove, { passive: false })
  svg.addEventListener('pointerup', endDrag)
  svg.addEventListener('pointercancel', endDrag) // iOS fires this when it steals the gesture
  svg.addEventListener('lostpointercapture', endDrag)
  svg.addEventListener('click', onClickCapture, true)

  render()
  // The viewBox aspect is derived from the container, whose final size isn't
  // known at mount (layout + webfonts still settling). A ResizeObserver re-fits
  // the moment the real size lands, and again on rotation; the timer is a
  // fallback for browsers without it.
  let ro: ResizeObserver | null = null
  if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(() => render()); ro.observe(container) }
  const settleTimer = window.setTimeout(render, 400)
  // The dossier's height (which the camera reserves out of the usable band)
  // depends on how the description wraps, which changes when the webfont swaps in.
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
    clearTimeout(settleTimer)
    if (camRAF) { cancelAnimationFrame(camRAF); camRAF = 0 }
    stopMomentum()
    if (coachTimer) { clearTimeout(coachTimer); coachTimer = 0 }
    if (io) { io.disconnect(); io = null }
    if (ro) ro.disconnect()
    pulseStop()
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('resize', onResize)
    container.innerHTML = '' // discards svg + all its pointer/click listeners
    container.classList.remove('op-live', 'op-at-top')
  }
}
