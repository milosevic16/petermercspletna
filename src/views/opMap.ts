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
    g.appendChild(el('circle', { class: 'op-dot', cx: String(node.x), cy: String(node.y), r: isCat ? '14' : '12', fill: NODE_FILL, stroke: node.kids.length ? BRANCH_STROKE : NODE_STROKE }))
    const p = byId[node.parent!], dx = node.x - p.x, dy = node.y - p.y
    const anchor = Math.abs(dx) < 18 ? 'middle' : dx > 0 ? 'start' : 'end'
    const lines = wrap(node.label, 20), fs = isCat ? 13.5 : 14.5, gap = (isCat ? 14 : 12) + 9
    const tx = node.x + (anchor === 'middle' ? 0 : dx > 0 ? gap : -gap)
    const ty = node.y + (anchor === 'middle' ? (dy >= 0 ? gap + fs : -gap - (lines.length - 1) * fs) : fs * 0.34 - (lines.length - 1) * fs * 0.5)
    const txt = el('text', { class: 'op-lbl', x: String(tx), y: ty.toFixed(1), 'text-anchor': anchor })
    lines.forEach((l, i) => { const ts = el('tspan', { x: String(tx), dy: i ? String(fs) : '0' }); ts.textContent = l; txt.appendChild(ts) })
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
  const OP = { active: 1, spine: 0.5, hint: 0, context: 0 }
  function fit(id: string) {
    const path = ancestors(id), childIds = byId[id].kids
    const ids: Record<string, 1> = {}; path.concat(childIds).concat(['pm']).forEach((k) => (ids[k] = 1))
    const pts = Object.keys(ids).map((k) => [byId[k].x, byId[k].y])
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
    const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys)
    const pad = 105, bw = maxx - minx + pad * 2, bh = maxy - miny + pad * 2, cx = (minx + maxx) / 2, cy = (miny + maxy) / 2
    let s = Math.min(1040 / bw, 720 / bh); s = Math.max(0.6, Math.min(s, 2.2))
    return { t: `translate(${(-s * cx).toFixed(1)} ${(-s * cy).toFixed(1)}) scale(${s.toFixed(3)})`, s }
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
    const cam = fit(focusId)
    const desktop = isDesktop()
    const childrenAllLeaves = childIds.length > 0 && childIds.every((k) => byId[k].leaf)
    Object.keys(nodeEls).forEach((id) => {
      const g = nodeEls[id], node = byId[id], t = tier(id), active = t === 'active'
      g.style.opacity = String(OP[t])
      g.classList.toggle('op-click', active)
      g.classList.toggle('op-focus', id === focusId)
      g.classList.toggle('op-sel', id === selId && id !== focusId)
      ;(g.querySelector('.op-dot') as SVGCircleElement).setAttribute('r', id === focusId ? '18' : (node.depth === 1 ? '14' : '12'))
      ;(g.querySelector('.op-lbl') as SVGTextElement).style.opacity = (active && id !== focusId) ? '1' : '0'
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
    if (focusId !== 'pm') { const f = byId[focusId]; focusName.textContent = f.label; focusName.setAttribute('x', String(f.x)); focusName.setAttribute('y', (f.y + 38).toFixed(1)); focusName.classList.add('on') } else focusName.classList.remove('on')
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
    // dossier: mobile always; desktop only when NOT showing inline leaf descriptions
    if (!desktop || !childrenAllLeaves || focusId === 'pm') setDossier(selId)
    else dossier.classList.remove('show')
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

  return () => {
    pulseStop()
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('resize', onResize)
    container.innerHTML = ''
    container.classList.remove('op-live', 'op-at-top')
  }
}
