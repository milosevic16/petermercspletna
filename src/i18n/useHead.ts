import { watchEffect } from 'vue'
import { locale } from './locale'
import type { Localized } from '@/content/types'

interface WithMeta {
  meta: { title: string; description: string }
}

// Sets document.title + the meta description from a content module's `meta`
// field. Single-locale for now: no canonical/hreflang yet.
export function useHead<T extends WithMeta>(content: Localized<T>): void {
  watchEffect(() => {
    const c = content[locale.value]
    document.title = c.meta.title
    let tag = document.head.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', c.meta.description)
  })
}
