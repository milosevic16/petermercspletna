/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Web3Forms access key — injected from .env.local (dev) / Netlify env (prod). */
  readonly VITE_WEB3FORMS_KEY: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}
