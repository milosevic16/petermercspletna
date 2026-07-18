import { computed } from 'vue'
import { useHead as useUnhead } from '@unhead/vue'
import { locale, localePath, LOCALES, type Locale } from './locale'
import type { Localized } from '@/content/types'

interface WithMeta {
  meta: { title: string; description: string }
}

// Absolute origin used for canonical / hreflang / og:url / JSON-LD `url`. These
// must be absolute in the server-rendered HTML, so it can't come from
// `window.location` (undefined at build) — it's the production origin.
// Update this if the site moves to a custom domain.
const SITE_ORIGIN = 'https://petermerc.netlify.app'

// Stable, locale-specific facts for the Person structured data. Only verifiable
// public facts already shown on the page — name, role, firm, Ljubljana, links.
const ROLE: Record<Locale, string> = {
  en: 'Crypto & fintech lawyer · Venture investor',
  sl: 'Pravnik za kripto in fintech · Vlagatelj tveganega kapitala',
}
const KNOWS_ABOUT: Record<Locale, string[]> = {
  en: ['Crypto regulation', 'MiCA', 'Fintech law', 'Blockchain', 'Tokenization', 'Venture capital'],
  sl: ['Kripto regulativa', 'MiCA', 'Fintech pravo', 'Blockchain', 'Tokenizacija', 'Tvegani kapital'],
}

// Drives the document head from a content module's `meta` field: title, meta
// description, <html lang>, per-locale canonical, hreflang alternates, Open
// Graph / Twitter tags, and a Person JSON-LD block. Reactive to the locale ref,
// so an in-app language switch updates the head in place; rendered into the
// static HTML at build time (vite-ssg) so crawlers get it without running JS.
export function useHead<T extends WithMeta>(content: Localized<T>): void {
  useUnhead(
    computed(() => {
      const l = locale.value
      const c = content[l]
      const url = SITE_ORIGIN + localePath(l)
      const personLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Peter Merc',
        honorificSuffix: 'Ph.D.',
        jobTitle: ROLE[l],
        description: c.meta.description,
        url,
        address: { '@type': 'PostalAddress', addressLocality: 'Ljubljana', addressCountry: 'SI' },
        worksFor: { '@type': 'Organization', name: 'Lemur Legal', url: 'https://lemur.legal' },
        knowsAbout: KNOWS_ABOUT[l],
        sameAs: ['https://www.linkedin.com/in/petermerc/', 'https://lemur.legal'],
      }
      return {
        title: c.meta.title,
        htmlAttrs: { lang: l },
        meta: [
          { name: 'description', content: c.meta.description },
          { property: 'og:type', content: 'profile' },
          { property: 'og:site_name', content: 'Peter Merc' },
          { property: 'og:title', content: c.meta.title },
          { property: 'og:description', content: c.meta.description },
          { property: 'og:url', content: url },
          { property: 'og:locale', content: l === 'sl' ? 'sl_SI' : 'en_US' },
          { property: 'og:locale:alternate', content: l === 'sl' ? 'en_US' : 'sl_SI' },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: c.meta.title },
          { name: 'twitter:description', content: c.meta.description },
        ],
        link: [
          { rel: 'canonical', href: url },
          ...LOCALES.map((alt) => ({ rel: 'alternate', hreflang: alt, href: SITE_ORIGIN + localePath(alt) })),
          { rel: 'alternate', hreflang: 'x-default', href: SITE_ORIGIN + localePath('en') },
        ],
        script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(personLd) }],
      }
    }),
  )
}
