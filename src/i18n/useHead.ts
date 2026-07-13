import { watchEffect } from 'vue'
import { locale, localePath, LOCALES } from './locale'
import type { Localized } from '@/content/types'

interface WithMeta {
  meta: { title: string; description: string }
}

function upsertMeta(name: string, content: string): void {
  let tag = document.head.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertLink(rel: string, href: string, hreflang?: string): void {
  const sel = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`
  let tag = document.head.querySelector(sel)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    if (hreflang) tag.setAttribute('hreflang', hreflang)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

// Sets document.title, the meta description, <html lang>, the per-locale
// canonical, and hreflang alternates from a content module's `meta` field.
// Reactive to the locale ref, so a locale switch updates the head in place.
export function useHead<T extends WithMeta>(content: Localized<T>): void {
  watchEffect(() => {
    const l = locale.value
    const c = content[l]
    document.title = c.meta.title
    upsertMeta('description', c.meta.description)
    document.documentElement.setAttribute('lang', l)
    const origin = window.location.origin
    upsertLink('canonical', origin + localePath(l))
    for (const alt of LOCALES) upsertLink('alternate', origin + localePath(alt), alt)
    upsertLink('alternate', origin + localePath('en'), 'x-default')
  })
}
