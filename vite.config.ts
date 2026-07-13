import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// The `vue-ts` template does NOT ship the `@` alias; it's added by hand here and
// mirrored in tsconfig.app.json `paths`. Every generated file imports `@/...`.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
