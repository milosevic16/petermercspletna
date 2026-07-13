import { computed, type ComputedRef } from 'vue'
import { locale } from './locale'
import type { Localized } from '@/content/types'

// Views read copy through this helper, never the raw object:
//   const t = usePageContent(home); template reads {{ t.hero.kicker }}
export function usePageContent<T>(content: Localized<T>): ComputedRef<T> {
  return computed(() => content[locale.value])
}
