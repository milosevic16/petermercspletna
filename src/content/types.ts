import type { Locale } from '@/i18n/locale'

// Copy is keyed by locale even while there's only one. Widening Locale later
// makes every content module missing the new key fail typecheck — that's the
// "no untranslated strings" guarantee. Views never change.
export type Localized<T> = Record<Locale, T>
