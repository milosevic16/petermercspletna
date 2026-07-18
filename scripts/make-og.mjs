// One-off asset generator (run locally, NOT part of the Netlify build):
//   node scripts/make-og.mjs
// Produces the social share image + the raster favicons, committed to public/:
//   - og.jpg               1200x630 photo-forward share card
//   - favicon-32.png       32x32 tab icon (fallback for the SVG favicon)
//   - apple-touch-icon.png 180x180 iOS home-screen icon
// Uses @resvg/resvg-js to rasterise SVG (with the site's self-hosted brand
// fonts) and sharp for the photo crop + compositing. Re-run after changing the
// portrait, wordmark, or brand tuning below.
import { readFileSync, writeFileSync, readdirSync, mkdtempSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { Resvg } from '@resvg/resvg-js'
import { decompress } from 'wawoff2'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const p = (...s) => resolve(root, ...s)
// SVG is XML — escape text so '&' etc. don't read as entity references.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// resvg reads TTF/OTF, not woff2 — decompress the brand fonts to a temp dir so
// <text> renders in the real Spectral / Instrument Sans faces.
async function brandFontDir() {
  const dir = mkdtempSync(resolve(tmpdir(), 'pm-fonts-'))
  for (const f of readdirSync(p('public/fonts')).filter((f) => f.endsWith('.woff2'))) {
    const ttf = await decompress(readFileSync(p('public/fonts', f)))
    writeFileSync(resolve(dir, f.replace('.woff2', '.ttf')), Buffer.from(ttf))
  }
  return dir
}
let FONT_DIR = p('public/fonts')

// --- tunables ---------------------------------------------------------------
const W = 1200, H = 630
const PORTRAIT = p('public/assets/b56f58c1.jpg') // 1400x1555 desktop crop
const FOCUS = 0.22 // vertical crop focus (0=top .. 1=bottom): keep the face w/ headroom
const WORDMARK = 'PETER MERC'
const ROLE = 'CRYPTO & FINTECH LAWYER · VENTURE INVESTOR'
const INK = '#ECE7DC', MUTE = '#B4AEA1', ACCENT = '#D2453E', SCRIM = '#141517'
// ----------------------------------------------------------------------------

// Rasterise an SVG string to a PNG buffer at a target width, loading the brand
// woff2 fonts from public/fonts so <text> renders in Spectral / Instrument Sans.
function svgToPng(svg, width) {
  const r = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    background: 'rgba(0,0,0,0)',
    font: { fontDirs: [FONT_DIR], loadSystemFonts: false, defaultFontFamily: 'Instrument Sans' },
    shapeRendering: 2,
    textRendering: 2,
  })
  return r.render().asPng()
}

async function buildOg() {
  // 1. Portrait -> cover-crop to 1200x630 with a tuned vertical focus.
  const resized = await sharp(PORTRAIT).resize({ width: W }).toBuffer({ resolveWithObject: true })
  const fullH = resized.info.height
  const top = Math.max(0, Math.round((fullH - H) * FOCUS))
  const photo = await sharp(resized.data)
    .extract({ left: 0, top, width: W, height: Math.min(H, fullH) })
    .modulate({ brightness: 1.02 })
    .toBuffer()

  // 2. Scrim + wordmark overlay (transparent PNG), rendered with brand fonts.
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="scrim" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stop-color="${SCRIM}" stop-opacity="0.94"/>
        <stop offset="0.38" stop-color="${SCRIM}" stop-opacity="0.55"/>
        <stop offset="0.72" stop-color="${SCRIM}" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="floor" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="${SCRIM}" stop-opacity="0.8"/>
        <stop offset="0.32" stop-color="${SCRIM}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#scrim)"/>
    <rect width="${W}" height="${H}" fill="url(#floor)"/>
    <rect x="72" y="452" width="46" height="3" fill="${ACCENT}"/>
    <text x="70" y="524" font-family="Spectral" font-weight="600" font-size="78" fill="${INK}">${esc(WORDMARK)}<tspan fill="${ACCENT}">.</tspan></text>
    <text x="72" y="566" font-family="Instrument Sans" font-weight="600" font-size="25" letter-spacing="3.4" fill="${MUTE}">${esc(ROLE)}</text>
  </svg>`
  const overlayPng = svgToPng(overlay, W)

  // 3. Composite -> JPEG.
  await sharp(photo)
    .composite([{ input: overlayPng, top: 0, left: 0 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(p('public/og.jpg'))
}

async function buildIcons() {
  const faviconSvg = readFileSync(p('public/favicon.svg'), 'utf8')
  // 32px tab icon — keep the rounded transparent corners.
  writeFileSync(p('public/favicon-32.png'), svgToPng(faviconSvg, 32))
  // 180px iOS icon — flatten onto graphite so it's a full square (iOS masks it).
  const appleRaw = svgToPng(faviconSvg, 180)
  await sharp(appleRaw).flatten({ background: '#26282C' }).png().toFile(p('public/apple-touch-icon.png'))
}

FONT_DIR = await brandFontDir()
await buildOg()
await buildIcons()
console.log('OK — wrote public/og.jpg, public/favicon-32.png, public/apple-touch-icon.png')
