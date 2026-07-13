# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## What this is

**Peter Merc** — personal/marketing site for Peter Merc, Ph.D., crypto & fintech lawyer and venture investor in Ljubljana; **1 page (home), bilingual**: English at `/`, Slovenian at `/sl`. Vite + Vue 3 (TS) + vue-router + Tailwind SPA. Contact form via **Web3Forms** (submit wiring is a follow-up pass — the form markup is ported, the mailto/submit handler is not). All copy lives in the typed, **locale-keyed content layer** (`src/content/`); templates hold no prose. Deployed to **Netlify** from the connected GitHub repo `milosevic16/petermercspletna` — a push to `main` builds and ships. Live at `https://petermerc.netlify.app` (custom domain TBD).

> During initial build-out this file is the **spec** — when a task first needs a described piece that doesn't exist yet, create it in this shape (not preemptively). Afterwards it is the **map**.

## Commands

```bash
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the production build
npm run typecheck  # vue-tsc -b (legacy *.effects.ts are @ts-nocheck)
```

No test suite, no linter. Verification = typecheck + build + **looking at the site in the browser**.

## Source of truth

This site was ported 1:1 from the standalone bundler export `exports/indexnov.html` — a **React + "DC" page-builder** app (not static HTML). The extractor `tools/extract.mjs` was a **one-time** generator; **never re-run it** — `src/` is authoritative and accumulates hand-made fixes the extractor would clobber. Edit `src/` directly.

**Page table** (export → component → slug):

| Export | Component | Slug | Scoped rules |
|--------|-----------|------|--------------|
| `indexnov.html` | `Home.vue` + `Home.effects.ts` | `` (home) | 4 |

Assets: **37** self-hosted `woff2` (Spectral + Instrument Sans) in `public/fonts/`; **2** hero JPEGs in `public/assets/`; all content-addressed (`<sha8>.<ext>`). The builder's reactive layer (`{{ }}` / `<sc-if>` bindings + `setState`) is reconstructed imperatively in `Home.effects.ts` behind a small `DCLogic` React-shim — React/react-dom and the builder runtime are **not** shipped. Design tokens (`--paper --ink --accent --graphite --ivory --ivory2 --line`) live on `:root` (base.css default) and are re-asserted per view via `ROOT_VARS`.

## Architecture

**Imports.** `@` is aliased to `src/` (in `vite.config.ts` `resolve.alias` and the tsconfig `paths` — the Vite `vue-ts` template doesn't ship this; it's added by hand).

**Shell.** `App.vue` → `SiteChrome` (skip link, `#site-head` masthead, `#site-head-spacer`, Footer — persists across routes) → `<router-view :key="$route.path">`. The `:key` forces a full view remount per navigation — deliberate: it replays the page-entry animation and gives the ported DOM-mutating scripts a fresh DOM. `SiteChrome` clears `#site-head`'s inline `transform` in a `router.afterEach` (the hide-on-scroll header effect can be disposed mid-hide).

**SPA link interception.** Page markup keeps plain `<a href="/...">`. A global click listener in `App.vue` converts same-origin absolute-path clicks into `router.push` (skips modified clicks, `target`, protocol-relative, `mailto:`/`tel:`/external). New internal links are plain `<a href="/path">` — the interceptor handles them.

**Boot veil.** `index.html` carries an inline, dependency-free intro overlay (`#boot` + `html.pm-booting`): a draw-in of the operating-map graph that paints first and hides the SPA's staged load (chrome → lazy chunk → font swap → hero image). `src/main.ts` lifts it once route + fonts + visible hero portrait are ready (all time-capped) and replays `#main`'s entry animation under the fade; a 9s CSS failsafe (`boot-failsafe`) reveals the page even if JS never boots. The veil is Arial-only by design — a webfont reference would swap mid-intro. If the map SVG in `Home.vue` changes shape, mirror the coordinates in the veil's `<svg>`.

**Effect lifecycle (`src/composables/tracker.ts`).** Legacy page scripts live in `src/views/*.effects.ts` (`@ts-nocheck`). Each wraps the original script in `initEffects()`, which routes **all** timers, rAF loops, `IntersectionObserver`s, listeners, and Web Animations through a tracker: shadowed `setTimeout`/`requestAnimationFrame`/`IntersectionObserver` consts plus `__fx.on(el, …)` / `__fx.anim(el, …)`. `initEffects()` returns `__fx.dispose`; the view calls it in `onUnmounted`, cancelling everything. **Anything you add inside an effects file must route through `__fx`** — a bare `addEventListener` or `el.animate` leaks and stacks on every navigation. New interactivity *outside* effects files: write idiomatic Vue (refs, `computed`, lifecycle hooks) instead.

**Per-view design tokens (`src/composables/useTheme.ts`).** Each view declares `ROOT_VARS` and calls `useRootVars(ROOT_VARS)` in `onMounted` — tokens become inline styles on `documentElement`, applied at runtime so pages with different palettes/fonts never collide in CSS. There is **no cleanup by design**: the next view's mount overwrites. Consequence: every view must set the complete token set it depends on; a var only one page sets leaks to the next.

**CSS scoping.** Chrome selectors (masthead/footer/shared primitives) are **global** in `src/styles/base.css`; all page CSS lives in that view's `<style scoped>`, including its `@media` blocks. Same-named classes on different pages don't collide *because of scoping* — keep it that way: page styles never go in `base.css`; chrome tweaks never go in a view. Runtime-created DOM (nodes inserted by effects) doesn't get the scope attribute — style it via `:deep()` in the owning view.

**Tailwind.** Preflight is **off** (the ported CSS provides the reset). `tailwind.config.js` maps tokens to the CSS custom properties. Use utilities for new layout; keep the bespoke CSS for existing sections.

## Copy & i18n (ACTIVE — English + Slovenian)

The site is bilingual: **English at `/`, Slovenian at `/sl`** (real per-locale routes, generated page × locale in `src/router.ts` from `pages.ts`; each route carries `meta.locale` and a `beforeEach` guard syncs the `locale` ref before the view renders). The masthead has an **EN | SL toggle** (plain `<a>`s via `localePath()`, hash-preserving, `aria-current`/`hreflang`/`lang` attributes, visible on mobile). Switching locale changes `$route.path` → the route-keyed `<router-view>` **remounts the view**, re-running `initEffects` with the new language's copy.

- **All human-readable copy lives in typed modules under `src/content/`** (`home.ts`, `chrome.ts`), keyed by locale — never inline in `.vue` markup. `src/i18n/locale.ts` has `Locale = 'en' | 'sl'`, `locale` ref, `LOCALES`, `localePath()`. `Localized<T> = Record<Locale, T>` (`src/content/types.ts`): a content module missing a locale key **fails typecheck** — the "no untranslated strings" guarantee.
- **Views read through the helper, never the raw object.** `usePageContent` (`src/i18n/useContent.ts`) = `computed(() => content[locale.value])`. In a view: `const t = usePageContent(home)`, template reads `{{ t.hero.line1 }}`. Effects files receive the resolved copy as a parameter: `initEffects(t.value)`.
- **Head/SEO.** `useHead(content)` in `<script setup>` sets `document.title`, meta description, `<html lang>`, the per-locale canonical, and `hreflang` alternates (en / sl / x-default). No view sets `document.title` directly.
- **Owner data stays English by design.** Contact `topics[i].key` is the stable English string — it is the `data-topic` attribute, the hints lookup key, and the mail subject (`'Website inquiry — ' + key`); only `label`/`hint` localize. The future Web3Forms payload is therefore English for both languages.
- **The Slovenian is a first draft** (marked for Peter's review — legal phrasing especially). Fix wording in `src/content/*.ts` only; templates never change for copy edits.
- **Locale-switch transition.** An in-app switch suppresses the page-entry animations for that mount (the `#main` rise's translateY flashes a paper-colored gap under the masthead) and instead re-types the first-viewport copy (`src/composables/retype.ts`, same ▌ caret as the briefs' typeout; ~0.85s, skipped for reduced-motion/hidden tabs). Wiring: router guard `markLangSwitch()` → view `consumeLangSwitch()` in `onMounted`. Opt an element out with `data-no-retype` (the toggle itself and the brand carry it).
- The boot veil in `index.html` is deliberately language-neutral ("PM", "PETER MERC.") — don't localize it; it paints before any JS.
- **Adding a third language** stays additive: widen `Locale`, add the key to each content module (typecheck lists what's missing), done — routes/toggle/hreflang derive from `LOCALES`.

## Web3Forms (WIRED)

The contact form (`#contact-form`) submits to Web3Forms. Named inputs: `name`, `email`, `topic` (hidden; `pickTopic` mirrors the chosen Regarding button's **stable English key** into it), `message`, and the `botcheck` honeypot. The visible topic label localizes; the submitted `topic` and the email `subject` stay English (owner data).

- One shared helper: `src/composables/web3forms.ts` → `wireWeb3Form(fx, opts)`. **All** submit logic lives there; `Home.effects.ts` calls it once at the end of `initEffects` (its listener goes through the tracker `fx.on`, so it tears down on route change). It validates (name/email/message + email shape), honours the honeypot, disables the button + swaps its label while sending, writes a color-coded `.js-form-status` line, and clears the form on success. State strings live in `content.contact.formStates` (localized).
- **The access key is an env var, NOT committed** — `import.meta.env.VITE_WEB3FORMS_KEY`. Local dev: `.env.local` (gitignored; `.env.example` is the committed template). Production: set `VITE_WEB3FORMS_KEY` in **Netlify → Site settings → Environment variables**. It's public-by-design (ships in the client bundle), so `netlify.toml` sets `SECRETS_SCAN_OMIT_KEYS = "VITE_WEB3FORMS_KEY"` to stop Netlify's secret scanner blocking the deploy. **If you rotate the key, update it in both `.env.local` and Netlify.**
- Submit: JSON POST to `https://api.web3forms.com/submit` with `access_key`, `subject`, `from_name`, `replyto`, custom `page` field, plus all `[name]` fields collected under `root`. Success = `(await r.json()).success`.
- UX contract: disable the button and swap its label while sending; color-coded status line (reuse an existing `.form-note`/`.form-status`, else create one); clear fields on success.
- **Harden it** (don't ship the naive version): include Web3Forms' `botcheck` honeypot (a hidden field; drop the submission client-side if it's filled), and validate required fields (name/email/message present, email shape) *before* posting. Put the `sending`/`success`/`error` strings in the page's content module (the `meta` sibling), not hardcoded in the helper — then they localize for free the day a second language ships.

## Conventions

- Match the surrounding file's style, naming, and comment density. Prefer editing existing files; prefer the smallest change that works.
- No new `@ts-nocheck` or `any` outside the legacy `*.effects.ts` files.
- **New page checklist**: a view SFC (script shape: `content` import → `usePageContent` → `useHead` → `ROOT_VARS` → `onMounted`/`onUnmounted`) + a typed content module in `src/content/` + a route entry (`src/pages.ts` → the router generates from it) + footer/nav links if the page belongs there.
- Comments only for constraints the code can't show (positional couplings, iOS/Safari workarounds, "no cleanup by design").

## Done means

1. `npm run typecheck` clean and `npm run build` succeeds.
2. The change is verified **visually in the browser** — desktop and 375 px for layout work — with the console free of new errors.
3. Anything touching effects: navigate away and back twice; no doubled animations, stacked listeners, or accelerating loops.
4. Anything touching a form: submit it and confirm a real Web3Forms delivery (success state + the email arrives), and that the honeypot/validation reject paths behave.
5. Honest reporting: failures, skips, and unverified pieces stated plainly.

## Guardrails

- **No `Co-Authored-By` trailers in commit messages.** Netlify's free plan allows one Git contributor on private repos and counts co-author trailers as contributors — a commit with one gets the deploy **blocked** ("unrecognized Git contributor"). Plain commit messages only.
- `.gitignore` covers `node_modules/`, `dist/`, `.env`, `.env.*.local` — never commit build artifacts or secrets.
- **A push to `main` auto-deploys to production** (Netlify builds from the connected repo), so verify locally first (`npm run build`) and don't push to `main` unless the user asks. Don't run destructive git commands (`reset --hard`, force-push) unless asked.
- Don't run any `tools/` script marked one-shot.

## Deployment — Netlify (connected GitHub repo)

Netlify builds from source on every push — nothing is built or uploaded by hand, and `dist/` is **not** committed (it's gitignored; Netlify runs `npm run build` itself). Netlify's built-in Git integration is the whole pipeline — there is no GitHub Actions / CI workflow, and none should be added.

**`netlify.toml`** (repo root, committed):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

# SPA rewrite: every path serves index.html so client-side routes and deep links
# resolve (status 200 = rewrite, not redirect). Without this, /contact 404s on reload.
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Vite fingerprints asset filenames → cache them forever; never cache the HTML shell.
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "no-cache"
```

**One-time connect** (Netlify UI): *Add new site → Import an existing project → GitHub →* pick the repo. Netlify reads `netlify.toml`, so the build command and publish dir auto-fill — confirm and deploy. Nothing else to configure.

**`main` is production.** After connecting, a push to `main` auto-deploys to the live site. The normal flow is local: `npm run dev` while building, `npm run build && npm run preview` to sanity-check the production output, then push to `main` to ship. (Netlify will also build any *other* branch you push as a preview at its own URL — there if you ever want to preview a risky change before it hits production, but nothing requires it.)

**Env vars:** none required by this template — Web3Forms' key is public and inlined. If a layer that needs one is added later (e.g. Contentful), set `VITE_*` vars in *Netlify → Site settings → Environment variables*; they're read at build time, so trigger a redeploy after changing them.

**Custom domain:** *Netlify → Domain settings →* add the domain and point DNS (or use Netlify DNS). HTTPS is automatic.

**Build gotcha:** Netlify builds on **case-sensitive Linux**. An import with the wrong case (`@/components/masthead` for `Masthead.vue`) works locally on Windows/macOS and **fails the Netlify build** — always `npm run build` locally before pushing to `main`.
