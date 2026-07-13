// Route table. The router generates page × locale lazy routes from this list;
// this stays the single source of truth for slugs. Head meta (title /
// description) lives in each page's content module (src/content/<page>.ts,
// keyed by locale) and is applied by useHead — not here.
export interface PageMeta {
  slug: string
  name: string
}

export const pages: PageMeta[] = [
  {
    slug: '',
    name: 'Home',
  },
]
