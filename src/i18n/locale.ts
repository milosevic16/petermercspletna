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

// One-shot flag: set by the router guard on an IN-APP locale switch (not the
// initial load), consumed by the view's onMounted to run the language-switch
// transition (suppress the page-entry rise — whose translateY flashes a
// paper-colored gap under the masthead — and retype the visible copy instead).
let langSwitch = false
export function markLangSwitch(): void {
  langSwitch = true
}
export function consumeLangSwitch(): boolean {
  const v = langSwitch
  langSwitch = false
  return v
}
