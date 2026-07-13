// Route + <head> table. The router generates lazy routes from this list;
// this stays the single source of truth for slugs and per-page meta.
export interface PageMeta {
  slug: string
  name: string
  title: string
  description: string
}

export const pages: PageMeta[] = [
  {
    slug: '',
    name: 'Home',
    title: "Peter Merc — crypto & fintech lawyer · venture investor",
    description: "Peter Merc, Ph.D. — tech & crypto lawyer and venture investor in Ljubljana. Founder of Lemur Legal, managing partner at Suricate Ventures, co-founder of Blocksquare and Bloctopus Intelligence.",
  },
]
