import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import type { ViteSSGOptions } from 'vite-ssg'

// The `vue-ts` template does NOT ship the `@` alias; it's added by hand here and
// mirrored in tsconfig.app.json `paths`. Every generated file imports `@/...`.
const config: UserConfig & { ssgOptions?: ViteSSGOptions } = {
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Static Site Generation (vite-ssg): pre-render every route to real HTML so
  // crawlers and AI/LLM retrieval get the full page from the server.
  ssgOptions: {
    // 'flat' => dist/sl.html, which Netlify serves at /sl with a clean 200.
    // 'nested' (dist/sl/index.html) makes Netlify 301 /sl -> /sl/, so our
    // canonical/hreflang (/sl, no trailing slash) would point at a redirect.
    dirStyle: 'flat',
    concurrency: 1, // render routes sequentially — the locale ref is a module
    // singleton, so parallel renders could interleave and cross-render languages.
    crittersOptions: false, // keep the CSS pipeline identical to the SPA build
    formatting: 'minify',
    includedRoutes: () => ['/', '/sl'], // skip the catch-all redirect routes
  },
}

export default defineConfig(config)
