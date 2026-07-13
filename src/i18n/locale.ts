import { ref } from 'vue'

// Copy is keyed by locale. Widening this union makes every content module
// missing the new key fail typecheck — the "no untranslated strings"
// guarantee. Views never change when a locale is added.
export type Locale = 'en' | 'sl'

export const LOCALES: readonly Locale[] = ['en', 'sl']

// Current locale. Driven by the route (see router.beforeEach): '/' → en,
// '/sl' → sl. Views/chrome read it through usePageContent's computed.
export const locale = ref<Locale>('en')

// Path prefix per locale: English lives unprefixed at '/', Slovenian at '/sl'.
export function localePath(l: Locale, hash = ''): string {
  return (l === 'en' ? '/' : '/sl') + hash
}
