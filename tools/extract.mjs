// =============================================================================
// tools/extract.mjs — ONE-SHOT generator. DO NOT RE-RUN.
// -----------------------------------------------------------------------------
// Decodes the standalone bundler export in `exports/` and emits the Vue source
// tree (assets, fonts.css, base.css, pages.ts, the Home view + its effects).
// After the first run, `src/` is AUTHORITATIVE: it accumulates hand-made fixes
// this generator would clobber. Fix problems by editing `src/`, never by
// re-running this file. See CLAUDE.md "Source of truth".
//
// This export is a React + "DC" page-builder app (not static HTML): the <main>
// is a live template ({{ }} interpolation, <sc-if>, sc-camel-on-* bindings,
// style-hover). This generator resolves those constructs to plain DOM + hooks
// that the emitted Home.effects.ts re-animates via a tiny React-shim.
// =============================================================================
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')
const EXPORT = path.join(ROOT, 'exports', 'indexnov.html')
const SRC = path.join(ROOT, 'src')
const PUB = path.join(ROOT, 'public')

const report = { fonts: 0, images: 0, scopedRules: 0, globalRules: 0, missingUuids: [], flags: [], frameworkAssetsSkipped: [] }
const placedBinds = new Set() // binds resolved across all fragments (main + bar)

// ---------------------------------------------------------------------------
// 1. Decode the bundler sections
// ---------------------------------------------------------------------------
const raw = fs.readFileSync(EXPORT, 'utf8')
const grab = (type) => {
  const m = raw.match(new RegExp('type="' + type.replace('/', '\\/') + '">(.*?)</script>', 's'))
  return m ? m[1] : null
}
const template = JSON.parse(grab('__bundler/template'))
const manifest = JSON.parse(grab('__bundler/manifest'))
const extResources = JSON.parse(grab('__bundler/ext_resources') || '[]')

// ---------------------------------------------------------------------------
// 2. Meta
// ---------------------------------------------------------------------------
const decodeEntities = (s) => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
const norm = (s) => s.replace(/\s+/g, ' ').trim()
const title = decodeEntities(norm((template.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1] || ''))
const description = decodeEntities(norm((template.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [])[1] || ''))

// ---------------------------------------------------------------------------
// 3. Asset helpers (content-addressed, deduped by sha8)
// ---------------------------------------------------------------------------
fs.mkdirSync(path.join(PUB, 'fonts'), { recursive: true })
fs.mkdirSync(path.join(PUB, 'assets'), { recursive: true })
fs.mkdirSync(path.join(SRC, 'styles'), { recursive: true })
fs.mkdirSync(path.join(SRC, 'views'), { recursive: true })

const sha8 = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8)
const decodeAsset = (uuid) => {
  const a = manifest[uuid]
  if (!a) { report.missingUuids.push(uuid); return null }
  let buf = Buffer.from(a.data, 'base64')
  if (a.compressed) { try { buf = zlib.gunzipSync(buf) } catch { report.flags.push('gunzip failed: ' + uuid) } }
  return { buf, mime: a.mime }
}
const extFor = (buf, mime) => {
  const h = buf.subarray(0, 4).toString('hex')
  if (buf.subarray(0, 4).toString('latin1') === 'wOF2') return 'woff2'
  if (h.startsWith('ffd8ff')) return 'jpg'
  if (h === '89504e47') return 'png'
  if (buf.subarray(0, 4).toString('latin1') === 'RIFF') return 'webp'
  if (h === '3c73766720' || buf.subarray(0, 5).toString('latin1') === '<svg ') return 'svg'
  if (mime && mime.includes('woff2')) return 'woff2'
  if (mime && mime.includes('jpeg')) return 'jpg'
  if (mime && mime.includes('png')) return 'png'
  return 'bin'
}
const written = new Set()
const assetPath = (uuid) => {
  const a = decodeAsset(uuid)
  if (!a) return null
  const ext = extFor(a.buf, a.mime)
  const dir = ext === 'woff2' ? 'fonts' : 'assets'
  const name = sha8(a.buf) + '.' + ext
  const full = path.join(PUB, dir, name)
  if (!written.has(name)) {
    fs.writeFileSync(full, a.buf)
    written.add(name)
    if (ext === 'woff2') report.fonts++; else report.images++
  }
  return '/' + dir + '/' + name
}

// ---------------------------------------------------------------------------
// 4. CSS: gather, resolve font urls, dedupe @font-face, sanitize, classify
// ---------------------------------------------------------------------------
const styleBlocks = [...template.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1])
let css = styleBlocks.join('\n')

// resolve every url("<uuid>") -> local path (fonts land in /fonts, rest /assets)
css = css.replace(/url\(\s*["']?([0-9a-f-]{36})["']?\s*\)/gi, (m, uuid) => {
  const p = assetPath(uuid)
  return p ? `url("${p}")` : m
})

// strip /* comments */ before structural work
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '')

// split a css string into top-level rules with a brace-depth scanner
function splitTopLevel(s) {
  const out = []
  let depth = 0, buf = ''
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    buf += c
    if (c === '{') depth++
    else if (c === '}') { depth--; if (depth === 0) { out.push(buf.trim()); buf = '' } }
  }
  if (buf.trim()) out.push(buf.trim())
  return out.filter(Boolean)
}

const cssClean = stripComments(css)
const rules = splitTopLevel(cssClean)

// pull @font-face out (dedupe by normalized text) -> fonts.css
const faceSet = new Map()
const nonFace = []
for (const r of rules) {
  if (/^@font-face\b/.test(r)) {
    const key = norm(r)
    if (!faceSet.has(key)) faceSet.set(key, r)
  } else nonFace.push(r)
}

// sanitize: drop bare-identifier junk declarations PostCSS rejects
const sanitize = (s) => s.replace(/(?<=[;{])\s*[a-zA-Z][\w-]*\s*(?=[;}])/g, '')

// classify a selector rule as global (chrome/reset) or scoped (page content).
// Styling here is almost entirely inline; the only real content rules target
// the #contact / #network / #media-strip sections -> scoped. Everything else
// (resets on html/body/a/::selection, @keyframes, reduced-motion) is global.
const CONTENT_RE = /#(contact|network|media-strip)\b/
function isGlobalSelector(sel) {
  return !CONTENT_RE.test(sel)
}

const globalRules = []
const scopedRules = []
function routeRule(r) {
  const at = r.match(/^@([\w-]+)/)
  if (at) {
    const name = at[1].toLowerCase()
    if (name === 'keyframes' || name === 'media' && /prefers-reduced-motion/.test(r)) { globalRules.push(r); return }
    if (name === 'media') {
      // split inner rules, partition, re-wrap each partition under the prelude
      const prelude = r.slice(0, r.indexOf('{'))
      const inner = r.slice(r.indexOf('{') + 1, r.lastIndexOf('}'))
      const innerRules = splitTopLevel(inner)
      const g = innerRules.filter((x) => isGlobalSelector(x.split('{')[0]))
      const s = innerRules.filter((x) => !isGlobalSelector(x.split('{')[0]))
      if (g.length) globalRules.push(prelude + '{\n' + g.join('\n') + '\n}')
      if (s.length) scopedRules.push(prelude + '{\n' + s.join('\n') + '\n}')
      return
    }
    globalRules.push(r); return
  }
  const sel = r.split('{')[0]
  if (isGlobalSelector(sel)) globalRules.push(r); else scopedRules.push(r)
}
nonFace.forEach(routeRule)
report.globalRules = globalRules.length
report.scopedRules = scopedRules.length

// rewrite font-face urls already done above; build fonts.css
const fontsCss = [...faceSet.values()].join('\n\n') + '\n'

// ---------------------------------------------------------------------------
// 5. Capture design tokens from #pm-root inline style -> ROOT_VARS + :root
// ---------------------------------------------------------------------------
const pmRootStyle = (template.match(/id="pm-root"\s+style="([^"]*)"/) || [])[1] || ''
const ROOT_VARS = {}
for (const m of pmRootStyle.matchAll(/(--[\w-]+)\s*:\s*([^;]+)/g)) ROOT_VARS[m[1]] = m[2].trim()

const rootDefault = ':root {\n' + Object.entries(ROOT_VARS).map(([k, v]) => `  ${k}: ${v};`).join('\n') + '\n}'

// viewport-split utilities (reproduce <sc-if isDesktop/isMobile/showNav> without JS)
const viewportUtils = `/* viewport-split helpers: reproduce the builder's <sc-if isDesktop/isMobile> */
.pm-desktop-only { display: contents; }
.pm-mobile-only { display: none; }
@media (max-width: 819px) {
  .pm-desktop-only { display: none; }
  .pm-mobile-only { display: contents; }
}`

const baseCss = [
  '/* Generated once by tools/extract.mjs. Global chrome + resets + tokens.',
  '   Page-specific CSS lives in each view\'s <style scoped>. */',
  '',
  '/* Default design tokens — the chrome needs sane tokens before any view mounts.',
  '   Each view re-asserts its complete set at runtime via ROOT_VARS. */',
  rootDefault,
  '',
  sanitize(globalRules.join('\n\n')),
  '',
  viewportUtils,
  '',
].join('\n')

// ---------------------------------------------------------------------------
// 6. Markup transform (the DC-framework -> plain DOM + hooks)
// ---------------------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escAttr = (s) => esc(s).replace(/"/g, '&quot;')

// initial render values (mirror renderVals() at the initial state:
// docket=0, sel='lemur', mobile=false, part=0, label='', bar=false, topic='',
// onAir=false, sent=false; props docketStyle=ring, contactEmail=peter@lemur.legal)
const INITIAL = {
  docketText: 'MiCA white papers & CASP licensing',
  docketIdx: '01 / 08',
  selTag: 'Founded',
  selName: 'Lemur Legal',
  selRole: 'Founder & Managing Partner',
  selDesc: 'Specialist tech-law office: MiCA white papers, CASP licensing and the token opinions that get assets listed.',
  selHref: 'https://lemur.legal',
  netIdx: '02 / 08',
  contactAddr: 'peter@lemur.legal',
  mailSubject: 'Website inquiry — General',
  msgHint: 'A few lines about what you have in mind is plenty.',
  barLabel: 'On record',
  barPart: '01 / 05',
}
// how each dynamic <sc-if> is handled
const IF_STATIC_TRUE = new Set(['dsRing'])
const IF_STATIC_FALSE = new Set(['dsDial', 'dsRise'])
const IF_DESKTOP = new Set(['isDesktop', 'showNav'])
const IF_MOBILE = new Set(['isMobile'])
const IF_DYN_SHOW = new Set(['hasLink', 'offAir']) // initially visible
const IF_DYN_HIDE = new Set(['onAir', 'sentNote', 'barOn']) // initially hidden
const TEXT_BINDS = ['docketText', 'docketIdx', 'selTag', 'selName', 'selRole', 'selDesc', 'netIdx', 'mailSubject', 'barLabel', 'barPart']

const camelCase = (kebab) => kebab.replace(/-([a-z])/g, (_, c) => c.toUpperCase())

function resolveScIf(html) {
  const re = /<sc-if\b[^>]*value="\{\{\s*(\w+)\s*\}\}"[^>]*>((?:(?!<sc-if\b)[\s\S])*?)<\/sc-if>/
  let guard = 0
  while (re.test(html)) {
    if (guard++ > 1000) { report.flags.push('sc-if resolve runaway'); break }
    html = html.replace(re, (m, cond, inner) => {
      if (IF_STATIC_TRUE.has(cond)) return inner
      if (IF_STATIC_FALSE.has(cond)) return ''
      if (IF_DESKTOP.has(cond)) return `<div class="pm-desktop-only">${inner}</div>`
      if (IF_MOBILE.has(cond)) return `<div class="pm-mobile-only">${inner}</div>`
      if (IF_DYN_SHOW.has(cond)) return `<div data-if="${cond}" style="display:contents">${inner}</div>`
      if (IF_DYN_HIDE.has(cond)) return `<div data-if="${cond}" style="display:none">${inner}</div>`
      report.flags.push('unhandled sc-if: ' + cond)
      return inner
    })
  }
  return html
}

function transformMarkup(html) {
  // a0) resolve asset UUIDs in src/srcset (hero portraits) -> local /assets path
  html = html.replace(/\b(src|srcset)="([^"]*)"/g, (m, attr, val) => {
    const out = val.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,
      (uuid) => assetPath(uuid) || (report.missingUuids.push(uuid), uuid))
    return out === val ? m : `${attr}="${out}"`
  })
  // a) <sc-if> conditionals
  html = resolveScIf(html)
  // b) <x-import> empty builder image-slots -> empty styled box (keep id + style)
  html = html.replace(/<x-import\b([^>]*)><\/x-import>/g, (m, attrs) => {
    const id = (attrs.match(/\bid="([^"]*)"/) || [])[1]
    const style = (attrs.match(/\bstyle="([^"]*)"/) || [])[1] || ''
    return `<div${id ? ` id="${id}"` : ''} style="${style}"></div>`
  })
  // c) sc-camel-on-*  ->  data-on-* (event bindings, wired in effects)
  html = html.replace(/\bsc-camel-on-([\w-]+)="\{\{\s*(\w+)\s*\}\}"/g,
    (m, ev, handler) => `data-on-${ev.replace(/-/g, '')}="${handler}"`)
  // d) remaining sc-camel-*  ->  camelCased attribute (viewBox, preserveAspectRatio)
  html = html.replace(/\bsc-camel-([\w-]+)="([^"]*)"/g, (m, attr, val) => `${camelCase(attr)}="${val}"`)
  // e) style-hover / style-focus  ->  data-hover / data-focus (JS reproduces on hover/focus)
  html = html.replace(/\bstyle-hover="([^"]*)"/g, (m, v) => `data-hover="${v}"`)
  html = html.replace(/\bstyle-focus="([^"]*)"/g, (m, v) => `data-focus="${v}"`)
  // f) attribute mustaches
  html = html.replace(/href="\{\{\s*selHref\s*\}\}"/g, () => { placedBinds.add('selHref'); return `href="${escAttr(INITIAL.selHref)}" data-bind-href="selHref"` })
  html = html.replace(/placeholder="\{\{\s*msgHint\s*\}\}"/g, () => { placedBinds.add('msgHint'); return `placeholder="${escAttr(INITIAL.msgHint)}" data-bind-placeholder="msgHint"` })
  // g) text mustaches with a target for __render (data-bind on the enclosing tag)
  for (const key of TEXT_BINDS) {
    const re = new RegExp(`<(\\w+)((?:[^>]*?))>(\\s*)\\{\\{\\s*${key}\\s*\\}\\}(\\s*)</\\1>`, 'g')
    html = html.replace(re, (m, tag, attrs, a, b) => { placedBinds.add(key); return `<${tag}${attrs} data-bind="${key}">${a}${esc(INITIAL[key])}${b}</${tag}>` })
  }
  // h) static text mustache
  html = html.replace(/\{\{\s*contactAddr\s*\}\}/g, esc(INITIAL.contactAddr))
  // i) drop leftover builder attrs
  html = html.replace(/\s+hint-[\w-]+="[^"]*"/g, '')
  // j) flag anything left
  for (const m of html.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g)) report.flags.push('unresolved mustache: ' + m[1])
  html = html.replace(/\{\{[\s\S]*?\}\}/g, '')
  return html
}

const mainRaw = template.match(/<main\b[^>]*>[\s\S]*?<\/main>/)
if (!mainRaw) { console.error('FATAL: no <main> found'); process.exit(1) }
const barRaw = (raw && template.match(/<sc-if\b[^>]*value="\{\{\s*barOn\s*\}\}"[^>]*>[\s\S]*?<\/sc-if>/) || [])[0] || ''
if (!barRaw) report.flags.push('progress bar (barOn) block not found')

const mainOut = transformMarkup(mainRaw[0])
const barOut = barRaw ? transformMarkup(barRaw) : ''

// flag any binding that never found a home across all fragments
for (const k of [...TEXT_BINDS, 'selHref', 'msgHint']) {
  if (!placedBinds.has(k)) report.flags.push('bind not placed anywhere: ' + k)
}

// ---------------------------------------------------------------------------
// 7. Script: extract the DC React component, apply the tracker rewrites
// ---------------------------------------------------------------------------
let script = (template.match(/<script[^>]*data-dc-script[^>]*>([\s\S]*?)<\/script>/) || [])[1] || ''
script = script.trim()
// drop framework self-call (theme is baked into #pm-root inline + :root tokens)
script = script.replace(/^\s*this\._applyTheme\(\);\s*$/m, '// (framework self-call removed: theme is baked into :root / #pm-root)')
// route window.<timer> through the tracker shadows (source uses window.-prefixed timers)
script = script.replace(/\bwindow\.(setTimeout|clearTimeout|setInterval|clearInterval|requestAnimationFrame|cancelAnimationFrame)\b/g, '$1')
// the two spec rewrites: listeners + web animations -> tracker
script = script.replace(/(?<![.\w$])([A-Za-z_$][\w$]*)\.addEventListener\(/g, '__fx.on($1, ')
script = script.replace(/(?<![.\w$])([A-Za-z_$][\w$]*)\.animate\(/g, '__fx.anim($1, ')
// pick the VISIBLE timeline variant (both tl-h and tl-v now exist; CSS hides one)
script = script.replace(
  "var tlWrap = document.getElementById('tl-h') || document.getElementById('tl-v');",
  "var tlWrap = [document.getElementById('tl-h'), document.getElementById('tl-v')].filter(function (x) { return x && x.offsetParent !== null; })[0] || document.getElementById('tl-h') || document.getElementById('tl-v');"
)
const indented = script.split('\n').map((l) => (l ? '    ' + l : l)).join('\n')

// ---------------------------------------------------------------------------
// 8. Emit files
// ---------------------------------------------------------------------------
const effects = [
  '// @ts-nocheck',
  '// PORTED VERBATIM from the original page script (one-time generation).',
  '// The source is a React + "DC" page-builder component; React/react-dom and the',
  '// builder runtime are NOT shipped. A tiny DCLogic shim below stands in for the',
  '// React base: setState re-syncs the specific {{ }} / <sc-if> bindings imperatively',
  '// (__render), and the builder\'s declarative sc-camel-on-* / style-hover bindings',
  '// are wired generically from the data-* hooks the extractor emitted (__wire).',
  '// Timers / listeners / observers / animations route through a tracker so they tear',
  '// down on route change. Edit THIS file directly from now on.',
  "import { createTracker } from '@/composables/tracker'",
  '',
  'export function initEffects(): () => void {',
  '  const __fx = createTracker()',
  '  const requestAnimationFrame = __fx.raf',
  '  const cancelAnimationFrame = __fx.caf',
  '  const setTimeout = __fx.setTimeout',
  '  const clearTimeout = __fx.clearTimeout',
  '  const setInterval = __fx.setInterval',
  '  const clearInterval = __fx.clearInterval',
  '  const IntersectionObserver = __fx.IO',
  '',
  '  // Effective builder props (the data-props editor-schema defaults, resolved).',
  "  const PROPS = { accent: '#D2453E', graphite: '#26282C', briefAnim: 'typeout', mapAnim: 'surge', docketStyle: 'ring', contactEmail: 'peter@lemur.legal', showChyron: true }",
  '',
  '  try {',
  '    // Minimal stand-in for the page-builder React base class. Replaces',
  '    // setState-driven reconciliation with an imperative sync of the bindings',
  '    // this template actually uses (see __render). Defined INSIDE the try so it',
  '    // shares block scope with __render (a block-scoped function declaration).',
  '    class DCLogic {',
  '      constructor() { this.props = PROPS }',
  '      setState(patch, cb) {',
  '        const next = typeof patch === "function" ? patch(this.state) : patch',
  '        Object.assign(this.state, next)',
  '        __render(this)',
  '        if (cb) cb()',
  '      }',
  '    }',
  '',
  indented,
  '',
  '    // ---- reactive binding sync (stands in for React re-render of {{ }} / <sc-if>) ----',
  '    function __render(c) {',
  '      const v = c.renderVals()',
  '      document.querySelectorAll("[data-bind]").forEach(function (el) {',
  '        const k = el.getAttribute("data-bind")',
  '        if (k in v && el.textContent !== String(v[k])) el.textContent = v[k]',
  '      })',
  '      document.querySelectorAll("[data-bind-href]").forEach(function (el) {',
  '        el.setAttribute("href", v[el.getAttribute("data-bind-href")] || "")',
  '      })',
  '      document.querySelectorAll("[data-bind-placeholder]").forEach(function (el) {',
  '        el.setAttribute("placeholder", v[el.getAttribute("data-bind-placeholder")] || "")',
  '      })',
  '      document.querySelectorAll("[data-if]").forEach(function (el) {',
  '        el.style.display = v[el.getAttribute("data-if")] ? "contents" : "none"',
  '      })',
  '    }',
  '',
  '    // ---- generic event + pseudo-state wiring (stands in for sc-camel-on-* / style-hover) ----',
  '    // NOTE: submit is intentionally NOT wired — form submit is the Web3Forms follow-up pass.',
  '    // Scoped to the VIEW roots (main + progress bar) so chrome hovers, wired by',
  '    // SiteChrome/Masthead, are not double-bound.',
  '    const __EVMAP = { click: "click", keydown: "keydown", focus: "focusin", blur: "focusout" }',
  '    function __viewRoots() {',
  '      return [document.getElementById("main"), document.querySelector("[data-if=\\"barOn\\"]")].filter(Boolean)',
  '    }',
  '    function __wire(c) {',
  '      __viewRoots().forEach(function (root) {',
  '        Object.keys(__EVMAP).forEach(function (kind) {',
  '          root.querySelectorAll("[data-on-" + kind + "]").forEach(function (el) {',
  '            const fn = c[el.getAttribute("data-on-" + kind)]',
  '            if (typeof fn === "function") __fx.on(el, __EVMAP[kind], fn)',
  '          })',
  '        })',
  '        root.querySelectorAll("[data-hover]").forEach(function (el) {',
  '          const hov = el.getAttribute("data-hover")',
  '          __fx.on(el, "mouseenter", function () { el.__b = el.style.cssText; el.style.cssText = el.__b + ";" + hov })',
  '          __fx.on(el, "mouseleave", function () { if (el.__b != null) el.style.cssText = el.__b })',
  '        })',
  '        root.querySelectorAll("[data-focus]").forEach(function (el) {',
  '          const foc = el.getAttribute("data-focus")',
  '          __fx.on(el, "focus", function () { el.__b = el.style.cssText; el.style.cssText = el.__b + ";" + foc })',
  '          __fx.on(el, "blur", function () { if (el.__b != null) el.style.cssText = el.__b })',
  '        })',
  '      })',
  '    }',
  '',
  '    const __c = new Component()',
  '    __wire(__c)',
  '    __c.componentDidMount()',
  '    __render(__c)',
  '    __fx.onDispose(function () { try { __c.componentWillUnmount() } catch (e) {} })',
  '  } catch (e) { console.error("[effects] init failed", e) }',
  '  return __fx.dispose',
  '}',
  '',
].join('\n')

const rootVarsLiteral = '{\n' + Object.entries(ROOT_VARS).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n') + '\n}'

const homeVue = `<template>
${mainOut}
${barOut}
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { initEffects } from './Home.effects'
import { useRootVars } from '@/composables/useTheme'

// This page's design tokens (baked from the original #pm-root inline vars).
// Applied at runtime so pages with different palettes never clobber each other.
const ROOT_VARS: Record<string, string> = ${rootVarsLiteral}

let dispose: (() => void) | undefined
onMounted(() => {
  document.title = ${JSON.stringify(title)}
  useRootVars(ROOT_VARS)
  dispose = initEffects()
})
onUnmounted(() => dispose && dispose())
</script>

<style scoped>
${sanitize(scopedRules.join('\n\n'))}
</style>
`

const pagesTs = `// Route + <head> table. The router generates lazy routes from this list;
// this stays the single source of truth for slugs and per-page meta.
export interface PageMeta {
  slug: string
  name: string
  title: string
  description: string
}

export const pages: PageMeta[] = [
  {
    slug: '',
    name: 'Home',
    title: ${JSON.stringify(title)},
    description: ${JSON.stringify(description)},
  },
]
`

fs.writeFileSync(path.join(SRC, 'styles', 'fonts.css'), fontsCss)
fs.writeFileSync(path.join(SRC, 'styles', 'base.css'), baseCss)
fs.writeFileSync(path.join(SRC, 'views', 'Home.vue'), homeVue)
fs.writeFileSync(path.join(SRC, 'views', 'Home.effects.ts'), effects)
fs.writeFileSync(path.join(SRC, 'pages.ts'), pagesTs)

// note framework assets we deliberately skipped
for (const r of extResources) report.frameworkAssetsSkipped.push(r.id)

// ---------------------------------------------------------------------------
// 9. Report
// ---------------------------------------------------------------------------
console.log('=== EXTRACT REPORT ===')
console.log('title:', title)
console.log('description:', description.slice(0, 80) + '…')
console.log('fonts written:', report.fonts, '| images written:', report.images)
console.log('global rules:', report.globalRules, '| scoped rules:', report.scopedRules)
console.log('ROOT_VARS:', JSON.stringify(ROOT_VARS))
console.log('main bytes:', mainOut.length, '| bar bytes:', barOut.length)
console.log('effects bytes:', effects.length)
console.log('framework assets skipped:', report.frameworkAssetsSkipped)
console.log('missing UUIDs:', report.missingUuids)
console.log('FLAGS:', report.flags.length ? report.flags : '(none)')
