import type { Localized } from './types'

// Copy for the persistent chrome (skip link, masthead, footer), keyed by
// locale. The chrome components read this reactively — they persist across
// route changes, so a locale switch updates them in place.

export interface ChromeContent {
  skip: string
  navAria: string
  langAria: string
  nav: {
    facets: string
    record: string
    media: string
    writing: string
  }
  cta: string
  footer: {
    location: string
    emailPrefix: string
    toConfirm: string
    linkedinPrefix: string
    lemur: string
    copyright: string
  }
}

const chrome: Localized<ChromeContent> = {
  en: {
    skip: 'Skip to content',
    navAria: 'Site',
    langAria: 'Language',
    nav: {
      facets: 'What I do',
      record: 'Track record',
      media: 'Media',
      writing: 'Writing',
    },
    cta: 'Get in touch',
    footer: {
      location: 'Ljubljana · working across the EU',
      emailPrefix: 'email',
      toConfirm: 'to confirm ⚠',
      linkedinPrefix: 'LinkedIn',
      lemur: 'Lemur Legal — lemur.legal',
      copyright: '© 2026 Peter Merc',
    },
  },
  sl: {
    skip: 'Preskoči na vsebino',
    navAria: 'Spletno mesto',
    langAria: 'Jezik',
    nav: {
      facets: 'Kaj počnem',
      record: 'Dosedanje delo',
      media: 'Mediji',
      writing: 'Objave',
    },
    cta: 'Stopite v stik',
    footer: {
      location: 'Ljubljana · delujem po vsej EU',
      emailPrefix: 'e-pošta',
      toConfirm: 'za potrditev ⚠',
      linkedinPrefix: 'LinkedIn',
      lemur: 'Lemur Legal — lemur.legal',
      copyright: '© 2026 Peter Merc',
    },
  },
}

export default chrome
