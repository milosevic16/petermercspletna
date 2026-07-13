import { ref } from 'vue'

// Copy is keyed by locale from day one, even with a single language. Widening
// this union later makes every content module missing the new key fail
// typecheck — the "no untranslated strings" guarantee. Views never change.
export type Locale = 'en'

export const locale = ref<Locale>('en')
