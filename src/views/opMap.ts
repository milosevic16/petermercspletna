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
  const edgesG = el('g', { id: 'op-edges' }), nodesG = el('g', { id: 'op-nodes' }), descG = el('g', { id: 'op-desc' })
  const fxLayer = el('g', { id: 'op-fx', 'aria-hidden': 'true' }); (fxLayer as SVGElement).style.pointerEvents = 'none'
  const focusName = el('text', { id: 'op-focusname' })
  const pmhub = el('g', { id: 'op-hub' })
  pmhub.appendChild(el('circle', { class: 'op-core', r: '32' }))
  pmhub.appendChild(el('circle', { class: 'op-ring', r: '40' }))
  const pmTxt = el('text', { 'text-anchor': 'middle', y: '6.5', 'font-size': '18' }); pmTxt.textContent = content.hub.label; pmhub.appendChild(pmTxt)
  camera.append(edgesG, descG, nodesG, focusName, pmhub, fxLayer)
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

  const nodeEls: Record<string, SVGGElement> = {}, edgeEls: Record<string, SVGLineElement> = {}, descEls: Record<string, SVGGElement> = {}
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
    const p = byId[node.parent!], dy = node.y - p.y
    // Label text only — its geometry (anchor, offset, wrap, font size) is set per
    // render() so it can track the live node radius and, on mobile, a font size
    // pinned in CSS px (counter-scaled against the camera) instead of shrinking.
    const txt = el('text', { class: 'op-lbl' })
    g.appendChild(txt); nodesG.appendChild(g); nodeEls[node.key] = g
    g.addEventListener('click', (e) => { e.stopPropagation(); onNodeClick(node.key) })
    g.addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNodeClick(node.key) } })

    // desktop leaf description (below the node), rendered as foreignObject
    if (node.leaf) {
      const below = dy >= -6
      const fo = el('g', { class: 'op-leafdesc' }) as SVGGElement
      const fw = 190, fx = node.x - fw / 2
      const fyTop = below ? node.y + 30 : node.y - 30
      const foX = el('foreignObject', { x: String(fx), width: String(fw), y: String(below ? fyTop : fyTop - 120), height: '120' })
      const div = document.createElement('div'); div.className = 'op-leafdesc-box' + (below ? '' : ' up')
      div.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
      div.textContent = node.desc
      foX.appendChild(div); fo.appendChild(foX); descG.appendChild(fo); descEls[node.key] = fo
    }
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
  function insets(dossierShown: boolean) {
    if (isDesktop()) return { top: 0, bottom: 0, side: 0 }
    const px2u = VBH / (container.getBoundingClientRect().height || 1)
    const crumbH = crumbs.getBoundingClientRect().height || 34
    const topPx = Math.max(crumbH, pmback.hidden ? 0 : 40)
    const sheetH = dossierShown ? (dossier.getBoundingClientRect().height || 170) : 0
    // +28 at the bottom so the lowest node's dot clears the sheet (the band
    // centres node CENTRES; the dot extends below its centre). ~26px each side
    // keeps the centred category labels on screen when the fit is width-bound on
    // a narrow phone, without starving the scale on wider ones.
    return { top: (topPx + 8) * px2u, bottom: sheetH ? (sheetH + 28) * px2u : 0, side: 26 * px2u }
  }
  function fit(id: string, dossierShown: boolean) {
    const path = ancestors(id), childIds = byId[id].kids
    const ids: Record<string, 1> = {}; path.concat(childIds).concat(['pm']).forEach((k) => (ids[k] = 1))
    const pts = Object.keys(ids).map((k) => [byId[k].x, byId[k].y])
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
    const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys)
    // Mobile hides the leaf-description foreignObjects, so vertical padding can be
    // much tighter there; horizontal stays generous for the side labels.
    const pad = isDesktop() ? 105 : 70
    const bw = maxx - minx + pad * 2, bh = maxy - miny + pad * 2, cx = (minx + maxx) / 2, cy = (miny + maxy) / 2
    const ins = insets(dossierShown)
    const availH = Math.max(160, VBH - ins.top - ins.bottom)
    const availW = Math.max(160, VBW - ins.side * 2)
    let s = Math.min(availW / bw, availH / bh); s = Math.max(0.6, Math.min(s, 2.6))
    const bandCy = -VBH / 2 + ins.top + availH / 2 // vertical centre of the free band, in viewBox coords
    return { t: `translate(${(-s * cx).toFixed(1)} ${(bandCy - s * cy).toFixed(1)}) scale(${s.toFixed(3)})`, s }
  }
  function setDossier(id: string) {
    const n = byId[id]
    ;(dossier.querySelector('.op-d-name') as HTMLElement).textContent = n.name
    ;(dossier.querySelector('.op-d-desc') as HTMLElement).textContent = n.desc
    const v = dossier.querySelector('.op-d-visit') as HTMLAnchorElement
    if (n.href) { v.hidden = false; v.href = n.href; v.textContent = content.visit + ' ↗' } else v.hidden = true
    dossier.classList.add('show')
  }
  function render() {
    const path = ancestors(focusId), childIds = byId[focusId].kids
    const grand: Record<string, 1> = {}; childIds.forEach((c) => byId[c].kids.forEach((g) => (grand[g] = 1)))
    const tier = (id: string): keyof typeof OP => (id === focusId || childIds.indexOf(id) >= 0) ? 'active' : path.indexOf(id) >= 0 ? 'spine' : grand[id] ? 'hint' : 'context'
    const desktop = isDesktop()
    const childrenAllLeaves = childIds.length > 0 && childIds.every((k) => byId[k].leaf)
    // The dossier must be filled BEFORE fit() so its measured height can be
    // reserved out of the camera's usable band (otherwise the lowest nodes sit
    // behind it). On mobile it is always shown; on desktop only when it isn't
    // superseded by the inline leaf descriptions.
    const dossierShown = !desktop || !childrenAllLeaves || focusId === 'pm'
    if (dossierShown) setDossier(selId)
    else dossier.classList.remove('show')
    updateViewBox()
    const cam = fit(focusId, dossierShown)
    // CSS px per user unit at the current camera; lets us pin on-screen sizes.
    const rect = container.getBoundingClientRect()
    const ppu = Math.min((rect.width || 1) / VBW, (rect.height || 1) / VBH)
    const k = cam.s * ppu || 1
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
      // leaf description under this node: desktop only, when it's an active leaf child of the focus
      if (descEls[id]) descEls[id].style.opacity = (desktop && active && childrenAllLeaves && id !== focusId) ? '1' : '0'
    })
    Object.keys(edgeEls).forEach((id) => {
      const t = tier(id), e = edgeEls[id]
      e.setAttribute('stroke-width', (1.3 / cam.s).toFixed(2))
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
    camera.setAttribute('transform', cam.t)
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
  function go(id: string) { focusId = id; selId = id; render() }
  function onNodeClick(id: string) {
    if (id === focusId) { goUp(); return }
    const n = byId[id]
    if (n.kids.length) go(id); else { selId = id; render() }
  }
  function goUp() { const p = byId[focusId].parent; if (p) go(p); else { selId = 'pm'; render() } }

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

  return () => {
    clearTimeout(settleTimer)
    if (ro) ro.disconnect()
    pulseStop()
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('resize', onResize)
    container.innerHTML = ''
    container.classList.remove('op-live', 'op-at-top')
  }
}
