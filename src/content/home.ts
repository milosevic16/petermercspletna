import type { Localized } from './types'

// All human-readable copy for the Home page, keyed by locale. Structure
// mirrors the page's sections. The *Html fields are trusted, owner-authored
// rich text rendered with v-html. The Slovenian is a first draft — flagged
// for Peter's review, especially the legal/regulatory phrasing.

// The operating map is a zoomable radial tree: PM hub → 5 categories → orgs →
// (for IBEX and Lemur) sub-orgs. Every node's label + description ships in the
// server HTML; the zoom/drill interaction is layered on client-side.
export interface MapNode {
  /** selector-safe slug — builds #node-<key> and drives the interaction. */
  key: string
  /** short label shown at the node. */
  label: string
  /** dossier heading; falls back to `label` when omitted. */
  name?: string
  /** dossier description (also shown under leaf nodes on desktop). */
  desc: string
  /** external link; omitted/'' = no "Visit" link. */
  href?: string
  children?: MapNode[]
}

/** One categorized bullet inside a role: UPPERCASE key → detail, optional link. */
interface FacetItem {
  key: string
  detail: string
  /** if present, `detail` renders as an external link. */
  href?: string
}

/** One role. A single-role entry has one; a paired entry has two (subsections). */
interface FacetSubsection {
  /** shown as a small accent header only when the entry has 2+ subsections. */
  subLabel: string
  /** short "focus — position @ orgs" line under the subLabel. */
  credential: string
  paragraphHtml: string
  list: FacetItem[]
}

/** One expandable entry in the "What I do" accordion. */
interface FacetEntry {
  /** selector-safe slug — builds ids btn-<key>/brief-<key>/ico-<key> and data-brief. */
  key: string
  /** bold, always-visible entry label, e.g. 'Counsel & Supervisor'. */
  label: string
  /** always-visible one-liner shown next to the label when collapsed. */
  credential: string
  /** feeds the sticky progress-bar label via [data-chyron]. */
  chyron: string
  subsections: FacetSubsection[]
}

/** One dot on the timeline. */
interface TimelineEntry {
  year: string
  title: string
  caption: string
}

interface MediaCard {
  kicker: string
  /** publication date, shown opposite the kicker; omitted when unknown. */
  date?: string
  title: string
  desc: string
  href: string
  external: boolean
  /** per-card call to action (Listen / Watch); falls back to `media.cta`. */
  cta?: string
  titleAttr?: string
}

export interface HomeContent {
  meta: { title: string; description: string }
  hero: {
    line1: string
    line2: string
    /** Rendered with a static accent period after it. */
    line3: string
    badgeName: string
    badgeRole: string
    imgAlt: string
  }
  docket: {
    eyebrow: string
    aria: string
    items: string[]
  }
  facets: {
    eyebrow: string
    hint: string
    entries: FacetEntry[]
  }
  record: {
    eyebrow: string
    chyron: string
    aside: string
    /** Rendered with a static accent period after it. */
    pullQuote: string
    live: string
    networkAria: string
    visit: string
    backLabel: string
    coach: string
    exit: string
    /** PM hub. */
    hub: { label: string; name: string; desc: string; href: string }
    /** The five categories (each with orgs; IBEX and Lemur have sub-orgs). */
    tree: MapNode[]
  }
  media: {
    eyebrow: string
    chyron: string
    /** Alt for the full-bleed portrait band that eases the map into this section. */
    bridgeAlt: string
    /** Label on the pill that scrolls more cards into view. */
    more: string
    prevAria: string
    nextAria: string
    cards: MediaCard[]
    cta: string
    note: string
    /** Row-style link under the cards, out to the full archive. */
    archive: { seg: string; title: string; linkLabel: string; href: string }
  }
  timeline: {
    eyebrow: string
    chyron: string
    aside: string
    /**
     * Two tracks on one line. Desktop: `above` sits over the line on accent
     * dots, `below` under it on ink dots. Mobile: the line runs down the middle
     * with `above` to its left and `below` to its right, same dot colours.
     * Each track is chronological on its own; the two are not aligned to a
     * shared year axis — ten entries and six cannot share x-positions and stay
     * readable, so each track spreads across the full width.
     */
    above: TimelineEntry[]
    below: TimelineEntry[]
  }
  contact: {
    eyebrow: string
    chyron: string
    /** Rendered with a static accent period after it. */
    headline: string
    intro: string
    regarding: string
    /**
     * `key` is the stable ENGLISH topic string: it is the data-topic value,
     * the hints lookup key, and the mail subject ("Peter Merc website — <key>"),
     * so the site owner's received data stays English for both languages.
     * Only `label` and `hint` localize.
     */
    topics: Array<{ key: string; label: string; hint: string }>
    msgHint: string
    newMessage: string
    onAir: string
    standby: string
    nameLabel: string
    namePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    messageLabel: string
    send: string
    formStates: { sending: string; success: string; error: string; invalid: string }
    /** Copy for the hCaptcha row web3forms.ts injects into the form card. */
    captcha: { label: string; required: string }
  }
  bar: {
    aria: string
    fallbackLabel: string
    partLabel: string
    jumps: Array<{ target: string; title: string; aria: string }>
  }
}

// Organisations that read as links wherever they are named in "What I do" —
// that section only, so the operating map keeps its own per-node hrefs. Both
// locales name them identically, so one list serves both. An empty href means
// the styling applies but the destination is not public yet.
// No name here may be a prefix of another: the alternation below takes the
// first branch that matches at a position, so the shorter one would always win.
const ORG_LINKS: ReadonlyArray<{ name: string; href: string }> = [
  { name: 'IBEX Equity Partners', href: '' },
  { name: 'JonatanMars Invest', href: 'https://jonatanmars.com/' },
  { name: 'Suricate Ventures', href: 'https://www.suricate.ventures/' },
  { name: 'Horizon Europe', href: 'https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe_en' },
  { name: 'NATO DIANA', href: 'https://www.diana.nato.int/' },
  { name: 'Lemur Legal', href: 'https://lemur.legal' },
  { name: 'mojaznamka.si', href: 'https://mojaznamka.si' },
]

const UNDERLINE = 'text-decoration:underline; text-underline-offset:2px;'
const ORG_NAME_RE = new RegExp(
  ORG_LINKS.map((o) => o.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
  'g',
)

const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }
const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => HTML_ESCAPES[c])

function linkOrgNames(text: string): string {
  let out = ''
  let from = 0
  ORG_NAME_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = ORG_NAME_RE.exec(text)) !== null) {
    const name = m[0]
    const href = ORG_LINKS.find((o) => o.name === name)?.href
    out += escapeHtml(text.slice(from, m.index))
    out += href
      ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener" style="color:inherit; ${UNDERLINE}">${escapeHtml(name)}</a>`
      : `<span style="${UNDERLINE}">${escapeHtml(name)}</span>`
    from = m.index + name.length
  }
  return out + escapeHtml(text.slice(from))
}

/**
 * Renders a "What I do" string as HTML with every organisation in ORG_LINKS
 * linked. Tags already in the string pass through untouched and everything
 * else is escaped, so this takes the plain fields (`credential`, a list item's
 * `key`/`detail`) and the trusted `paragraphHtml` alike.
 */
export function withOrgLinks(copy: string): string {
  return copy
    .split(/(<[^>]*>)/)
    .map((part) => (/^<[^>]*>$/.test(part) ? part : linkOrgNames(part)))
    .join('')
}

const home: Localized<HomeContent> = {
  en: {
    meta: {
      title: 'Peter Merc — crypto & fintech lawyer · venture investor',
      description:
        'Peter Merc, Ph.D. — tech & crypto lawyer and venture investor in Ljubljana. Founder of Lemur Legal, managing partner at Suricate Ventures, co-founder of Blocksquare and Bloctopus Intelligence.',
    },
    hero: {
      line1: 'Technology moves fast.',
      line2: 'Law & capital must keep up.',
      line3: 'I help close the gap',
      badgeName: 'Peter Merc',
      badgeRole: 'legal counsel · investor · mentor · evaluator · lecturer',
      imgAlt: 'Peter Merc — black-and-white studio portrait',
    },
    docket: {
      eyebrow: 'On the docket',
      aria: 'Show next practice area',
      items: [
        'MiCA white papers & CASP licensing',
        'Token classification & listing opinions',
        'RWA tokenization',
        'Venture capital',
        'Blockchain forensics',
        'Regulatory strategy for fintechs',
        'Panels, lectures & commentary',
        'Defence & dual-use',
      ],
    },
    facets: {
      eyebrow: 'What I do',
      hint: 'open a line to read the detail',
      entries: [
        {
          key: 'counsel',
          label: 'Counsel & Supervisor',
          credential: 'crypto, fintech & tech law · compliance · financial supervision',
          chyron: 'Counsel — crypto & fintech law',
          subsections: [
            {
              subLabel: 'Counsel',
              credential: 'crypto, fintech & tech law — managing partner @ Lemur Legal, head of compliance @ GateHub',
              paragraphHtml:
                'Technology rarely waits for regulation. With Lemur Legal I advise founders, financial institutions and technology companies where law, finance and emerging technology intersect — from MiCA, PSD2 and DORA to token launches, contracts and regulatory strategy. Move fast and break things, with me in the support role.',
              list: [
                { key: 'Licensing', detail: 'PSD2 and MiCA (CASP authorisation), AML' },
                { key: 'White papers', detail: 'MiCA-compliant drafting and notification' },
                { key: 'Contracts', detail: 'Licensing agreements, IPR protection, EULA, SW development agreements' },
                { key: 'Compliance', detail: 'Acting as an external regulatory compliance officer' },
                { key: 'Intellectual property', detail: 'Web portal for brands and design protection — mojaznamka.si' },
              ],
            },
            {
              subLabel: 'Supervisor',
              credential: 'financial supervision — supervisory board @ JonatanMars Invest',
              paragraphHtml:
                'In regulated finance, growth must be matched by sound governance. As President of the Supervisory Board at JonatanMars Invest, a regulated asset management and brokerage company, I provide strategic oversight of management, governance, risk and regulatory compliance. I bring experience from banking, capital markets, fintech and corporate law to the boardroom, helping ensure that ambitious business decisions are supported by robust controls and long-term accountability.',
              list: [
                { key: 'Board', detail: 'President of the Supervisory Board @ JonatanMars Invest' },
                { key: 'Oversight', detail: 'Management, governance, risk and regulatory compliance' },
                { key: 'Background', detail: 'Banking, capital markets, fintech, corporate law and MiFID II' },
              ],
            },
          ],
        },
        {
          key: 'investor',
          label: 'Investor',
          credential: 'early-stage venture capital — Suricate Ventures & IBEX Equity Partners',
          chyron: 'Investor — venture capital',
          subsections: [
            {
              subLabel: 'Investor',
              credential: 'early-stage venture capital — managing partner @ Suricate Ventures & IBEX Equity Partners',
              paragraphHtml:
                'As an angel investor, I back exceptional individuals and early ideas directly. As Managing Partner at Suricate Ventures, a generalist micro-VC, I invest across technology sectors and help founders navigate the realities of building and scaling a company. At IBEX Equity Partners, our focus is on defence technology, dual-use innovation and technologies with strategic relevance. For me, investing is not only about providing capital — it is about smart money: sharing experience, opening doors and helping strong teams turn bold ideas into enduring companies.',
              list: [
                { key: 'Fund #1', detail: 'Suricate Ventures — early-stage, industry agnostic' },
                { key: 'Fund #2', detail: 'IBEX Defence Fund — early-stage, defence-tech & dual-use' },
                { key: 'Accelerator', detail: 'IBEX Defence Accelerator — accelerating defence and dual-use startups' },
                { key: 'Angel', detail: 'Pre-seed and seed investments in tech startups' },
              ],
            },
          ],
        },
        {
          key: 'founder',
          label: 'Founder',
          credential: 'DLT, RWA tokenization & forensics — Blocksquare & Bloctopus Intelligence',
          chyron: 'Founder — deep-tech ventures',
          subsections: [
            {
              subLabel: 'Founder',
              credential: 'co-founder @ Blocksquare & Bloctopus Intelligence',
              paragraphHtml:
                'I have co-founded two deep-tech ventures. Blocksquare provides a turn-key, regulatory-compliant solution for real-estate tokenization. Bloctopus Intelligence is the crypto forensics and crypto recovery business.',
              list: [
                { key: 'Blocksquare', detail: 'Real-world-asset (real estate) tokenization infrastructure, DLT' },
                { key: 'Bloctopus', detail: 'Blockchain intelligence and crypto recovery, forensics services' },
              ],
            },
          ],
        },
        {
          key: 'mentor',
          label: 'Mentor & Evaluator',
          credential: 'startup mentoring · deep-tech & defence evaluation',
          chyron: 'Mentor & Evaluator',
          subsections: [
            {
              subLabel: 'Mentor',
              credential: 'IP, legal & investment readiness — mentor @ Start:Up Slovenia',
              paragraphHtml:
                'Founders rarely need theory. They need clarity on what to do next. I mentor startups on intellectual property, legal strategy, investment readiness and business development. Drawing on my experience as a founder, investor and legal counsel, I help teams identify critical risks, strengthen their business model and prepare for investors, partners and international growth.',
              list: [
                { key: 'Mentor', detail: 'Start:Up Slovenia mentor profile', href: 'https://www.startup.si/en-us/startup-map/mentors/peter-merc' },
              ],
            },
            {
              subLabel: 'Evaluator',
              credential: 'deep-tech, defence-tech & dual-use — external evaluator',
              paragraphHtml:
                'As an external evaluator for NATO DIANA, Horizon Europe and other innovation programmes, I assess deep-tech, defence-tech and dual-use projects from commercial, strategic and investment perspectives. I evaluate the strength of the team, market potential, scalability, business model and the project’s ability to deliver meaningful results. A good evaluator does not simply score a proposal — they identify whether an ambitious idea can become a credible and impactful venture.',
              list: [
                { key: 'NATO DIANA', detail: 'External commercial evaluator for defence and dual-use proposals' },
                { key: 'Horizon Europe', detail: 'External evaluator for deep-tech proposals (fintech, DLT, AI)' },
                { key: 'Other', detail: 'External evaluator @ Research and Innovation Foundation (Cyprus), EIC Accelerator' },
              ],
            },
          ],
        },
        {
          key: 'lecturer',
          label: 'Lecturer & Voice',
          credential: 'assistant professor · media & stages',
          chyron: 'Lecturer & Voice',
          subsections: [
            {
              subLabel: 'Lecturer',
              credential: 'assistant professor — Alma Mater Europaea, EMUNI, New University, GEA College',
              paragraphHtml:
                'Assistant Professor lecturing on digital and technology law, web economics, entrepreneurship, digital-finance regulation and public-sector digitalization at Alma Mater Europaea, EMUNI University, New University (Nova univerza) and GEA College.',
              list: [
                { key: 'Alma Mater', detail: 'Fundamentals of Entrepreneurship; Web Economics and Business Models; Digital Finance and Law of Financial Markets; Legal Aspects of Modern Digital Finance' },
                { key: 'EMUNI', detail: 'Regulatory Framework for Digital Technologies; Risk Management in the Digital Age' },
                { key: 'New University', detail: 'Digitalization of Public Administration' },
                { key: 'GEA College', detail: 'Legal and regulatory compliance aspects of Web 3.0 projects' },
              ],
            },
            {
              subLabel: 'Voice',
              credential: 'media & stages',
              paragraphHtml:
                'Through media appearances, conference stages, panels and podcasts, I explain developments in technology, finance, regulation and venture capital in a clear and practical way. I contribute as a speaker, commentator and moderator, connecting technical detail with the broader business and societal context.',
              list: [
                { key: 'Appearances', detail: 'Every public appearance — TV shows, podcasts and articles', href: 'https://lemur.legal/media' },
              ],
            },
          ],
        },
      ],
    },
    record: {
      eyebrow: 'The operating map',
      chyron: 'Track record',
      aside: 'all verifiable',
      pullQuote: 'Several hats, one desk — everything routes through Ljubljana',
      live: 'Live — tap a node to open its branch',
      networkAria: 'Peter Merc’s operating map — practices and organisations',
      visit: 'Visit',
      backLabel: 'Back to top',
      coach: 'Tap the nodes to explore the map',
      exit: 'Close',
      hub: {
        label: 'PM',
        name: 'Peter Merc',
        desc: 'Counsel, capital, governance, teaching and evaluation — several practices run from one desk in Ljubljana. Open a branch to explore.',
        href: 'https://www.linkedin.com/in/petermerc/',
      },
      tree: [
        { key: 'vc', label: 'Venture Capital', desc: 'Early-stage venture capital — backing exceptional founders directly and through two funds.', children: [
          { key: 'ibex', label: 'IBEX', name: 'IBEX Equity Partners', desc: 'Defence technology, dual-use innovation and technologies with strategic relevance.', children: [
            { key: 'ibex-eq', label: 'IBEX Equity Fund', desc: 'Early-stage equity fund.' },
            { key: 'ibex-da', label: 'IBEX Defence Accelerator', desc: 'Accelerator for defence and dual-use ventures.' },
          ] },
          { key: 'suricate', label: 'Suricate Ventures', desc: 'Managing partner of a generalist micro-VC investing across technology sectors.', href: 'https://suricate.ventures' },
        ] },
        { key: 'startups', label: 'Startups', desc: 'Two deep-tech ventures co-founded from the ground up.', children: [
          { key: 'bloctopus', label: 'Bloctopus', name: 'Bloctopus Intelligence', desc: 'Crypto forensics and crypto recovery.' },
          { key: 'blocksquare', label: 'Blocksquare', desc: 'Turn-key, regulatory-compliant real-estate tokenization infrastructure (DLT).', href: 'https://blocksquare.io' },
        ] },
        { key: 'advisory', label: 'Advisory & Supervision', desc: 'Crypto & fintech legal counsel and financial-sector governance.', children: [
          { key: 'lemur', label: 'Lemur Legal', desc: 'Managing partner — crypto, fintech & tech law.', href: 'https://lemur.legal', children: [
            { key: 'moja', label: 'Moja znamka', desc: 'Trademark and brand-protection service.', href: 'https://mojaznamka.si' },
          ] },
          { key: 'gatehub', label: 'GateHub', desc: 'Head of compliance — external regulatory compliance officer.', href: 'https://gatehub.net' },
          { key: 'jonatan', label: 'JonatanMars Invest', desc: 'President of the Supervisory Board — regulated asset management and brokerage.' },
        ] },
        { key: 'lecturing', label: 'Lecturing', desc: 'Assistant professor of digital and technology law across four institutions.', children: [
          { key: 'emuni', label: 'EMUNI', name: 'EMUNI University', desc: 'Regulatory framework for digital technologies; risk management in the digital age.' },
          { key: 'alma', label: 'Alma Mater Europaea', desc: 'Entrepreneurship, web economics, digital finance and financial-markets law.' },
          { key: 'newuni', label: 'New University', name: 'New University (Nova univerza)', desc: 'Digitalization of public administration.' },
          { key: 'gea', label: 'GEA College', desc: 'Legal and regulatory compliance for Web 3.0 projects.' },
        ] },
        { key: 'mentoring', label: 'Mentoring & Evaluating', desc: 'Startup mentoring and deep-tech / defence project evaluation.', children: [
          { key: 'nato', label: 'NATO DIANA', desc: 'External commercial evaluator — defence and dual-use proposals.' },
          { key: 'horizon', label: 'Horizon Europe', desc: 'External evaluator — deep-tech proposals (fintech, DLT, AI).' },
          { key: 'rif', label: 'Research and Innovation Foundation (Cyprus)', name: 'Research and Innovation Foundation', desc: 'External evaluator, Cyprus.' },
          { key: 'startup-si', label: 'Start:Up Slovenia', desc: 'Mentor — IP, legal strategy and investment readiness.', href: 'https://www.startup.si/en-us/startup-map/mentors/peter-merc' },
        ] },
      ],
    },
    media: {
      eyebrow: 'On record — media',
      chyron: 'Media & press',
      bridgeAlt: 'Peter Merc speaking on stage, microphone in hand',
      more: 'See more',
      prevAria: 'Scroll coverage back',
      nextAria: 'Scroll coverage forward',
      cards: [
        {
          kicker: 'Podcast — Money-How',
          date: '2 Jul 2026',
          title: 'MiCA is here: are crypto investors truly better protected now?',
          desc: 'On the impact of MiCA on the European crypto market, Binance’s position in the EU, and what the new regime changes for crypto service providers and investors.',
          href: 'https://money-how.si/podcast/mica-je-tu-so-kriptovlagatelji-zdaj-res-bolj-varni/',
          external: true,
          cta: 'Listen',
        },
        {
          kicker: 'Article — Bloomberg Adria',
          date: '30 Jun 2026',
          title: 'Confirmed: Binance did not obtain a licence and is shutting down services in the EU. What should users do?',
          desc: 'Quoted as an expert on Binance’s EU licence, the MiCA regime, and what it means for users in practice.',
          href: 'https://si.bloombergadria.com/financni-trgi/kripto-trg/107641/binance-brez-licence-v-eu-kaj-naj-storijo-uporabniki/news',
          external: true,
          cta: 'Read more',
        },
        {
          kicker: 'Television — RTV SLO',
          date: '9 Jun 2026',
          title: 'Flip the Coin: the instalment society — why seemingly affordable purchases cost us dearly',
          desc: 'The programme on why instalment payments are less harmless than they appear, and how small monthly commitments become an expensive financial trap.',
          href: 'https://www.rtvslo.si/rtv-vsebine/druzba-obrokov-zakaj-nas-navidezno-ugodni-nakupi-drago-stanejo/784730',
          external: true,
          cta: 'Watch',
        },
        {
          kicker: 'Interview — Delo',
          date: '8 May 2026',
          title: 'You would not be far off in saying that Europe could be heading back to the Middle Ages',
          desc: 'On digital sovereignty, control over data, technological infrastructure and business resilience.',
          href: 'https://www.delo.si/delov-poslovni-center/mobilnost/ne-bi-zelo-zgresili-ce-bi-rekli-da-gre-evropa-lahko-nazaj-v-srednji-vek-video',
          external: true,
          cta: 'Read more',
        },
        {
          kicker: 'Interview — AmCham Slovenija',
          title: 'Think Forward — the interview',
          desc: 'On camera for AmCham’s Think Forward series — tech law and building Lemur Legal.',
          href: 'https://www.youtube.com/watch?v=ci0cpjHI-F8',
          external: true,
          cta: 'Watch',
        },
        {
          kicker: 'Column — Podjetnik.si',
          title: 'Blockchain revolucija — kaj je in kaj prinaša?',
          desc: 'Why blockchain is more than Bitcoin — and what it changes first.',
          href: 'https://podjetnik.media.si/blockchain-bitcoin-revolucija-kaj-je/',
          external: true,
          cta: 'Read more',
        },
      ],
      cta: 'Open coverage',
      note: 'Drop a photo straight onto each card — it sticks. ⚠ Every card is still waiting on its image.',
      archive: {
        seg: 'Archive',
        title: 'Every interview, column and mention — collected on Lemur Legal',
        linkLabel: 'lemur.legal/media',
        href: 'https://lemur.legal/media',
      },
    },
    timeline: {
      eyebrow: 'Personal timeline',
      chyron: 'Personal timeline',
      aside: 'direction #tech',
      above: [
        { year: '2015', title: 'Ph.D. in banking law', caption: 'Faculty of Law, University of Ljubljana' },
        { year: '2017', title: 'Blockchain Think Tank Slovenia', caption: 'Co-founder' },
        { year: '2019', title: 'Alma Mater Europaea', caption: 'Academic career begins' },
        { year: '2020', title: 'Horizon 2020', caption: 'External expert' },
        { year: '2021', title: 'Slovenian Council for Digitalisation', caption: 'Member' },
        { year: '2026', title: 'NATO DIANA', caption: 'External evaluator' },
      ],
      below: [
        { year: '2008', title: 'NLB d.d.', caption: 'Legal counsel — capital markets & regulatory compliance' },
        { year: '2009', title: 'Municipality of Ljubljana', caption: 'Finance Committee, member' },
        { year: '2014', title: 'Hypo Alpe-Adria-Bank d.d.', caption: 'Legal counsel — regulatory compliance' },
        { year: '2016', title: 'Abanka d.d.', caption: 'Member of the supervisory board' },
        { year: '2016', title: 'Lemur Legal', caption: 'Tech-law office opens' },
        { year: '2018', title: 'Blocksquare', caption: 'RWA tokenization, co-founded' },
        { year: '2021', title: 'Suricate Ventures', caption: 'Early-stage VC fund, co-founded' },
        { year: '2025', title: 'IBEX Equity Partners', caption: 'Early-stage defence-tech VC fund, co-founded' },
        { year: '2026', title: 'Bloctopus Intelligence', caption: 'Blockchain forensics, co-founded' },
        { year: '2026', title: 'JonatanMars Invest', caption: 'Brokerage company, president of the supervisory board' },
      ],
    },
    contact: {
      eyebrow: 'Contact',
      chyron: 'Contact',
      headline: 'If what you’re building runs ahead of the rulebook, we should talk',
      intro:
        'Pick a topic, add your details and a few lines, then send — I read every message myself and reply.',
      regarding: 'Regarding',
      topics: [
        {
          key: 'Crypto regulation',
          label: 'Crypto regulation',
          hint: 'Which market, which token, and when you need to be live.',
        },
        {
          key: 'Fintech',
          label: 'Fintech',
          hint: 'The licence you are after, the regulator you are facing, and your timeline.',
        },
        {
          key: 'Defence-tech',
          label: 'Defence-tech',
          hint: 'What you are building, and where it sits on the dual-use line.',
        },
        {
          key: 'Venture capital',
          label: 'Venture capital',
          hint: 'Stage, round, and what you are building.',
        },
        {
          key: 'Crypto scams',
          label: 'Crypto scams',
          hint: 'What you lost and when, plus any wallet addresses or exchanges involved.',
        },
        {
          key: 'Something else',
          label: 'Something else',
          hint: 'Two sentences is plenty — you will get next steps back.',
        },
      ],
      msgHint: 'A few lines about what you have in mind is plenty.',
      newMessage: 'New message',
      onAir: 'Ready for input',
      standby: 'Standby',
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Email',
      emailPlaceholder: 'you@company.com',
      messageLabel: 'Message',
      send: 'Send message',
      formStates: {
        sending: 'Sending…',
        success: 'Thanks — your message is on its way. I’ll be in touch.',
        error: 'Something went wrong — please try again, or email me directly.',
        invalid: 'Please add your name, a valid email and a message.',
      },
      captcha: { label: 'Verify', required: 'Please confirm you are not a robot.' },
    },
    bar: {
      aria: 'Page progress',
      fallbackLabel: 'On record',
      partLabel: 'Part',
      jumps: [
        { target: 'facets', title: 'Part 1 — What I do', aria: 'Jump to What I do' },
        { target: 'record', title: 'Part 2 — Track record', aria: 'Jump to Track record' },
        { target: 'media', title: 'Part 3 — Media & press', aria: 'Jump to Media and press' },
        { target: 'contact', title: 'Part 4 — Contact', aria: 'Jump to Contact' },
      ],
    },
  },

  sl: {
    meta: {
      title: 'Peter Merc — pravnik za kripto in fintech · vlagatelj tveganega kapitala',
      description:
        'Peter Merc, doktor prava — pravnik za tehnologijo in kripto ter vlagatelj tveganega kapitala v Ljubljani. Ustanovitelj Lemur Legal, vodilni partner pri Suricate Ventures, soustanovitelj Blocksquare in Bloctopus Intelligence.',
    },
    hero: {
      line1: 'Tehnologija hiti naprej.',
      line2: 'Pravo in kapital morata slediti.',
      line3: 'Pomagam premostiti vrzel',
      badgeName: 'Peter Merc',
      badgeRole: 'pravni svetovalec · vlagatelj · mentor · ocenjevalec · predavatelj',
      imgAlt: 'Peter Merc — črno-beli studijski portret',
    },
    docket: {
      eyebrow: 'Na dnevnem redu',
      aria: 'Pokaži naslednje področje dela',
      items: [
        'Beli papirji po MiCA in licenciranje CASP',
        'Klasifikacija žetonov in mnenja za uvrstitve',
        'Tokenizacija stvarnega premoženja (RWA)',
        'Tvegani kapital',
        'Forenzika blockchaina',
        'Regulatorna strategija za finteche',
        'Paneli, predavanja in komentarji',
        'Obrambne in dvonamenske tehnologije',
      ],
    },
    facets: {
      eyebrow: 'Kaj počnem',
      hint: 'odprite vrstico in preberite podrobnosti',
      entries: [
        {
          key: 'counsel',
          label: 'Svetovalec in nadzornik',
          credential: 'kripto, fintech in tehnološko pravo · skladnost · finančni nadzor',
          chyron: 'Svetovalec — kripto in fintech pravo',
          subsections: [
            {
              subLabel: 'Svetovalec',
              credential: 'kripto, fintech in tehnološko pravo — vodilni partner @ Lemur Legal, vodja skladnosti @ GateHub',
              paragraphHtml:
                'Tehnologija le redko počaka na regulativo. V pisarni Lemur Legal svetujem ustanoviteljem, finančnim institucijam in tehnološkim podjetjem tam, kjer se prepletajo pravo, finance in nastajajoče tehnologije — od MiCA, PSD2 in DORA do izdaj žetonov, pogodb in regulativne strategije. »Move fast and break things«, z mano v podporni vlogi.',
              list: [
                { key: 'Licenciranje', detail: 'PSD2 in MiCA (dovoljenje CASP), AML' },
                { key: 'Beli papirji', detail: 'Priprava in notifikacija skladno z MiCA' },
                { key: 'Pogodbe', detail: 'Licenčne pogodbe, zaščita IP, EULA, pogodbe o razvoju programske opreme' },
                { key: 'Skladnost', detail: 'Delovanje kot zunanji pooblaščenec za regulativno skladnost' },
                { key: 'Intelektualna lastnina', detail: 'Spletni portal za zaščito znamk in modelov — mojaznamka.si' },
              ],
            },
            {
              subLabel: 'Nadzornik',
              credential: 'finančni nadzor — nadzorni svet @ JonatanMars Invest',
              paragraphHtml:
                'V regulirani finančni panogi mora rast spremljati zdravo upravljanje. Kot predsednik nadzornega sveta v družbi JonatanMars Invest, regulirani družbi za upravljanje premoženja in borzno posredovanje, zagotavljam strateški nadzor nad vodenjem, upravljanjem, tveganji in regulativno skladnostjo. V sejno sobo prinašam izkušnje iz bančništva, kapitalskih trgov, fintecha in gospodarskega prava ter pomagam zagotoviti, da ambiciozne poslovne odločitve podpirajo trdni kontrolni mehanizmi in dolgoročna odgovornost.',
              list: [
                { key: 'Nadzorni svet', detail: 'Predsednik nadzornega sveta @ JonatanMars Invest' },
                { key: 'Nadzor', detail: 'Vodenje, upravljanje, tveganja in regulativna skladnost' },
                { key: 'Ozadje', detail: 'Bančništvo, kapitalski trgi, fintech, gospodarsko pravo in MiFID II' },
              ],
            },
          ],
        },
        {
          key: 'investor',
          label: 'Vlagatelj',
          credential: 'naložbe v zgodnjih fazah — Suricate Ventures in IBEX Equity Partners',
          chyron: 'Vlagatelj — tvegani kapital',
          subsections: [
            {
              subLabel: 'Vlagatelj',
              credential: 'naložbe v zgodnjih fazah — vodilni partner @ Suricate Ventures in IBEX Equity Partners',
              paragraphHtml:
                'Kot poslovni angel neposredno podpiram izjemne posameznike in zgodnje ideje. Kot vodilni partner v skladu Suricate Ventures, generalističnem mikroskladu tveganega kapitala, vlagam v različne tehnološke panoge in ustanoviteljem pomagam pri izzivih graditve in rasti podjetja. V skladu IBEX Equity Partners je naš fokus obrambna tehnologija, dvonamenske inovacije in tehnologije s strateškim pomenom. Vlaganje zame ni le zagotavljanje kapitala — je pametni kapital: deljenje izkušenj, odpiranje vrat in pomoč močnim ekipam, da pogumne ideje spremenijo v trajna podjetja.',
              list: [
                { key: 'Sklad #1', detail: 'Suricate Ventures — zgodnje faze, panožno nevtralen' },
                { key: 'Sklad #2', detail: 'IBEX Defence Fund — zgodnje faze, obrambne in dvonamenske tehnologije' },
                { key: 'Pospeševalnik', detail: 'IBEX Defence Accelerator — za startupe na področju obrambnih in dvonamenskih tehnologij' },
                { key: 'Angel', detail: 'Pred-semenske in semenske naložbe v tehnološke startupe' },
              ],
            },
          ],
        },
        {
          key: 'founder',
          label: 'Ustanovitelj',
          credential: 'DLT, tokenizacija RWA in forenzika — Blocksquare in Bloctopus Intelligence',
          chyron: 'Ustanovitelj — globokotehnološka podjetja',
          subsections: [
            {
              subLabel: 'Ustanovitelj',
              credential: 'soustanovitelj @ Blocksquare in Bloctopus Intelligence',
              paragraphHtml:
                'Soustanovil sem dve globokotehnološki (deep-tech) podjetji. Blocksquare ponuja celovito, regulativno skladno rešitev za tokenizacijo nepremičnin. Bloctopus Intelligence je podjetje za kripto forenziko in povrnitev kripto sredstev.',
              list: [
                { key: 'Blocksquare', detail: 'Infrastruktura za tokenizacijo stvarnega premoženja (nepremičnin), DLT' },
                { key: 'Bloctopus', detail: 'Blockchain obveščanje in povrnitev kripto sredstev, forenzične storitve' },
              ],
            },
          ],
        },
        {
          key: 'mentor',
          label: 'Mentor in ocenjevalec',
          credential: 'mentoriranje startupov · ocenjevanje deep-tech in obrambnih projektov',
          chyron: 'Mentor in ocenjevalec',
          subsections: [
            {
              subLabel: 'Mentor',
              credential: 'IP, pravo in pripravljenost na naložbe — mentor @ Start:Up Slovenija',
              paragraphHtml:
                'Ustanovitelji redko potrebujejo teorijo. Potrebujejo jasnost o naslednjem koraku. Startupe mentoriram na področjih intelektualne lastnine, pravne strategije, pripravljenosti na naložbe in razvoja poslovanja. Na podlagi izkušenj ustanovitelja, vlagatelja in pravnega svetovalca ekipam pomagam prepoznati ključna tveganja, okrepiti poslovni model ter se pripraviti na vlagatelje, partnerje in mednarodno rast.',
              list: [
                { key: 'Mentor', detail: 'Profil mentorja Start:Up Slovenija', href: 'https://www.startup.si/en-us/startup-map/mentors/peter-merc' },
              ],
            },
            {
              subLabel: 'Ocenjevalec',
              credential: 'deep-tech, obrambne in dvonamenske tehnologije — zunanji ocenjevalec',
              paragraphHtml:
                'Kot zunanji ocenjevalec za NATO DIANA, Horizon Europe in druge inovacijske programe ocenjujem globokotehnološke, obrambne in dvonamenske projekte s komercialnega, strateškega in naložbenega vidika. Ocenjujem moč ekipe, tržni potencial, skalabilnost, poslovni model in sposobnost projekta, da doseže pomembne rezultate. Dober ocenjevalec predloga ne le točkuje — prepozna, ali lahko ambiciozna ideja postane verodostojno in vplivno podjetje.',
              list: [
                { key: 'NATO DIANA', detail: 'Zunanji komercialni ocenjevalec za obrambne in dvonamenske predloge' },
                { key: 'Horizon Europe', detail: 'Zunanji ocenjevalec za globokotehnološke predloge (fintech, DLT, UI)' },
                { key: 'Drugo', detail: 'Zunanji ocenjevalec @ Research and Innovation Foundation (Ciper), EIC Accelerator' },
              ],
            },
          ],
        },
        {
          key: 'lecturer',
          label: 'Predavatelj in glas',
          credential: 'docent · mediji in odri',
          chyron: 'Predavatelj in glas',
          subsections: [
            {
              subLabel: 'Predavatelj',
              credential: 'docent — Alma Mater Europaea, EMUNI, Nova univerza, GEA College',
              paragraphHtml:
                'Docent, ki predava digitalno in tehnološko pravo, spletno ekonomijo, podjetništvo, regulativo digitalnih financ in digitalizacijo javnega sektorja na Alma Mater Europaea, Univerzi EMUNI, Novi univerzi in GEA College.',
              list: [
                { key: 'Alma Mater', detail: 'Temelji podjetništva; Spletna ekonomija in poslovni modeli; Digitalne finance in pravo finančnih trgov; Pravni vidiki sodobnih digitalnih financ' },
                { key: 'EMUNI', detail: 'Regulativni okvir za digitalne tehnologije; Upravljanje tveganj v digitalni dobi' },
                { key: 'Nova univerza', detail: 'Digitalizacija javne uprave' },
                { key: 'GEA College', detail: 'Pravni in regulativni vidiki skladnosti projektov Web 3.0' },
              ],
            },
            {
              subLabel: 'Glas',
              credential: 'mediji in odri',
              paragraphHtml:
                'Prek medijskih nastopov, konferenčnih odrov, panelov in podkastov razumljivo in praktično pojasnjujem dogajanje v tehnologiji, financah, regulativi in tveganem kapitalu. Sodelujem kot govorec, komentator in moderator ter povezujem tehnične podrobnosti s širšim poslovnim in družbenim kontekstom.',
              list: [
                { key: 'Nastopi', detail: 'Vsi javni nastopi — TV-oddaje, podkasti in članki', href: 'https://lemur.legal/media' },
              ],
            },
          ],
        },
      ],
    },
    record: {
      eyebrow: 'Operativni zemljevid',
      chyron: 'Dosedanje delo',
      aside: 'vse preverljivo',
      pullQuote: 'Več vlog, ena miza — vse poti vodijo skozi Ljubljano',
      live: 'V živo — tapnite vozlišče in odprite vejo',
      networkAria: 'Operativni zemljevid Petra Merca — področja in organizacije',
      visit: 'Obišči',
      backLabel: 'Nazaj na vrh',
      coach: 'Tapnite vozlišča za raziskovanje',
      exit: 'Zapri',
      hub: {
        label: 'PM',
        name: 'Peter Merc',
        desc: 'Svetovanje, kapital, upravljanje, predavanja in ocenjevanje — več vlog, ki jih vodim z ene mize v Ljubljani. Odprite vejo za več.',
        href: 'https://www.linkedin.com/in/petermerc/',
      },
      tree: [
        { key: 'vc', label: 'Tvegani kapital', desc: 'Naložbe tveganega kapitala v zgodnjih fazah — neposredno in prek dveh skladov.', children: [
          { key: 'ibex', label: 'IBEX', name: 'IBEX Equity Partners', desc: 'Obrambna tehnologija, dvonamenske inovacije in tehnologije s strateškim pomenom.', children: [
            { key: 'ibex-eq', label: 'IBEX Equity Fund', desc: 'Sklad lastniškega kapitala za zgodnje faze.' },
            { key: 'ibex-da', label: 'IBEX Defence Accelerator', desc: 'Pospeševalnik za obrambne in dvonamenske projekte.' },
          ] },
          { key: 'suricate', label: 'Suricate Ventures', desc: 'Vodilni partner generalističnega mikrosklada tveganega kapitala, ki vlaga v različne tehnološke panoge.', href: 'https://suricate.ventures' },
        ] },
        { key: 'startups', label: 'Startupi', desc: 'Dve soustanovljeni globokotehnološki (deep-tech) podjetji.', children: [
          { key: 'bloctopus', label: 'Bloctopus', name: 'Bloctopus Intelligence', desc: 'Kripto forenzika in povrnitev kripto sredstev.' },
          { key: 'blocksquare', label: 'Blocksquare', desc: 'Celovita, regulativno skladna infrastruktura za tokenizacijo nepremičnin (DLT).', href: 'https://blocksquare.io' },
        ] },
        { key: 'advisory', label: 'Svetovanje in nadzor', desc: 'Pravno svetovanje za kripto in fintech ter upravljanje v finančnem sektorju.', children: [
          { key: 'lemur', label: 'Lemur Legal', desc: 'Vodilni partner — kripto, fintech in tehnološko pravo.', href: 'https://lemur.legal', children: [
            { key: 'moja', label: 'Moja znamka', desc: 'Storitev za zaščito blagovnih znamk.', href: 'https://mojaznamka.si' },
          ] },
          { key: 'gatehub', label: 'GateHub', desc: 'Vodja skladnosti — zunanji pooblaščenec za regulativno skladnost.', href: 'https://gatehub.net' },
          { key: 'jonatan', label: 'JonatanMars Invest', desc: 'Predsednik nadzornega sveta — regulirano upravljanje premoženja in borzno posredovanje.' },
        ] },
        { key: 'lecturing', label: 'Predavanja', desc: 'Docent za digitalno in tehnološko pravo na štirih ustanovah.', children: [
          { key: 'emuni', label: 'EMUNI', name: 'Univerza EMUNI', desc: 'Regulativni okvir za digitalne tehnologije; upravljanje tveganj v digitalni dobi.' },
          { key: 'alma', label: 'Alma Mater Europaea', desc: 'Podjetništvo, spletna ekonomija, digitalne finance in pravo finančnih trgov.' },
          { key: 'newuni', label: 'Nova univerza', name: 'Nova univerza', desc: 'Digitalizacija javne uprave.' },
          { key: 'gea', label: 'GEA College', desc: 'Pravna in regulativna skladnost projektov Web 3.0.' },
        ] },
        { key: 'mentoring', label: 'Mentorstvo in ocenjevanje', desc: 'Mentoriranje startupov ter ocenjevanje globokotehnoloških in obrambnih projektov.', children: [
          { key: 'nato', label: 'NATO DIANA', desc: 'Zunanji komercialni ocenjevalec — obrambni in dvonamenski predlogi.' },
          { key: 'horizon', label: 'Horizon Europe', desc: 'Zunanji ocenjevalec — globokotehnološki predlogi (fintech, DLT, UI).' },
          { key: 'rif', label: 'Research and Innovation Foundation (Cyprus)', name: 'Research and Innovation Foundation', desc: 'Zunanji ocenjevalec, Ciper.' },
          { key: 'startup-si', label: 'Start:Up Slovenia', desc: 'Mentor — intelektualna lastnina, pravna strategija in pripravljenost na naložbe.', href: 'https://www.startup.si/en-us/startup-map/mentors/peter-merc' },
        ] },
      ],
    },
    media: {
      eyebrow: 'Za zapisnik — mediji',
      chyron: 'Mediji in tisk',
      bridgeAlt: 'Peter Merc med nastopom na odru, z mikrofonom v roki',
      more: 'Prikaži več',
      prevAria: 'Pomakni prispevke nazaj',
      nextAria: 'Pomakni prispevke naprej',
      cards: [
        {
          kicker: 'Podkast — Money-How',
          date: '2. jul. 2026',
          title: 'MiCA je tu: so kriptovlagatelji zdaj res bolj varni?',
          desc: 'O vplivu uredbe MiCA na evropski kripto trg, o položaju borze Binance v EU in o tem, kaj nova ureditev spreminja za ponudnike kripto storitev in vlagatelje.',
          href: 'https://money-how.si/podcast/mica-je-tu-so-kriptovlagatelji-zdaj-res-bolj-varni/',
          external: true,
          cta: 'Poslušaj',
        },
        {
          kicker: 'Članek — Bloomberg Adria',
          date: '30. jun. 2026',
          title: 'Binance brez licence v EU: kaj naj storijo uporabniki?',
          desc: 'Strokovni komentar o licenci borze Binance v EU, o ureditvi MiCA in o tem, kaj to v praksi pomeni za uporabnike.',
          href: 'https://si.bloombergadria.com/financni-trgi/kripto-trg/107641/binance-brez-licence-v-eu-kaj-naj-storijo-uporabniki/news',
          external: true,
          cta: 'Preberi',
        },
        {
          kicker: 'Televizija — RTV SLO',
          date: '9. jun. 2026',
          title: 'Družba obrokov: zakaj nas navidezno ugodni nakupi drago stanejo',
          desc: 'Zakaj navidezno ugodni obroki le redko ostanejo tako neškodljivi, kot se zdijo, in kako se majhne mesečne obveznosti spremenijo v drago finančno past.',
          href: 'https://www.rtvslo.si/rtv-vsebine/druzba-obrokov-zakaj-nas-navidezno-ugodni-nakupi-drago-stanejo/784730',
          external: true,
          cta: 'Oglej si',
        },
        {
          kicker: 'Intervju — Delo',
          date: '8. maj 2026',
          title: '»Ne bi zelo zgrešili, če bi rekli, da gre Evropa lahko nazaj v srednji vek«',
          desc: 'O digitalni suverenosti, nadzoru nad podatki, tehnološki infrastrukturi in odpornosti podjetij.',
          href: 'https://www.delo.si/delov-poslovni-center/mobilnost/ne-bi-zelo-zgresili-ce-bi-rekli-da-gre-evropa-lahko-nazaj-v-srednji-vek-video',
          external: true,
          cta: 'Preberi',
        },
        {
          kicker: 'Intervju — AmCham Slovenija',
          title: 'Think Forward — intervju',
          desc: 'Pred kamero v AmChamovi seriji Think Forward — tehnološko pravo in gradnja Lemur Legal.',
          href: 'https://www.youtube.com/watch?v=ci0cpjHI-F8',
          external: true,
          cta: 'Oglej si',
        },
        {
          kicker: 'Kolumna — Podjetnik.si',
          title: 'Blockchain revolucija — kaj je in kaj prinaša?',
          desc: 'Zakaj je blockchain več kot bitcoin — in kaj spremeni najprej.',
          href: 'https://podjetnik.media.si/blockchain-bitcoin-revolucija-kaj-je/',
          external: true,
          cta: 'Preberi',
        },
      ],
      cta: 'Odpri prispevek',
      note: 'Fotografijo spustite naravnost na kartico — obstane. ⚠ Vse kartice še čakajo na slike.',
      archive: {
        seg: 'Arhiv',
        title: 'Vsi intervjuji, kolumne in omembe — zbrani na spletni strani Lemur Legal',
        linkLabel: 'lemur.legal/media',
        href: 'https://lemur.legal/media',
      },
    },
    timeline: {
      eyebrow: 'Osebna kronologija',
      chyron: 'Osebna kronologija',
      aside: 'smer #tech',
      above: [
        { year: '2015', title: 'Doktorat iz bančnega prava', caption: 'Pravna fakulteta Univerze v Ljubljani' },
        { year: '2017', title: 'Blockchain Think Tank Slovenija', caption: 'Soustanovitelj' },
        { year: '2019', title: 'Alma Mater Europaea', caption: 'Začetek akademske poti' },
        { year: '2020', title: 'Horizon 2020', caption: 'Zunanji strokovnjak' },
        { year: '2021', title: 'Strateški svet za digitalizacijo', caption: 'Član' },
        { year: '2026', title: 'NATO DIANA', caption: 'Zunanji ocenjevalec' },
      ],
      below: [
        { year: '2008', title: 'NLB d.d.', caption: 'Pravni svetovalec — kapitalski trgi in regulativna skladnost' },
        { year: '2009', title: 'Mestna občina Ljubljana', caption: 'Član odbora za finance' },
        { year: '2014', title: 'Hypo Alpe-Adria-Bank d.d.', caption: 'Pravni svetovalec — regulativna skladnost' },
        { year: '2016', title: 'Abanka d.d.', caption: 'Član nadzornega sveta' },
        { year: '2016', title: 'Lemur Legal', caption: 'Odprtje pisarne za tehnološko pravo' },
        { year: '2018', title: 'Blocksquare', caption: 'Tokenizacija stvarnega premoženja, soustanovitelj' },
        { year: '2021', title: 'Suricate Ventures', caption: 'Sklad tveganega kapitala za zgodnje faze, soustanovitelj' },
        { year: '2025', title: 'IBEX Equity Partners', caption: 'Sklad tveganega kapitala za zgodnje faze na področju obrambnih tehnologij, soustanovitelj' },
        { year: '2026', title: 'Bloctopus Intelligence', caption: 'Forenzika blockchaina, soustanovitelj' },
        { year: '2026', title: 'JonatanMars Invest', caption: 'Borznoposredniška družba, predsednik nadzornega sveta' },
      ],
    },
    contact: {
      eyebrow: 'Kontakt',
      chyron: 'Kontakt',
      headline: 'Če to, kar gradite, prehiteva pravila, se morava pogovoriti',
      intro:
        'Izberite temo, dodajte svoje podatke in nekaj vrstic ter pošljite — vsako sporočilo preberem osebno in odgovorim.',
      regarding: 'Glede',
      topics: [
        {
          key: 'Crypto regulation',
          label: 'Regulacija kriptovalut',
          hint: 'Kateri trg, kateri žeton in do kdaj morate biti operativni.',
        },
        {
          key: 'Fintech',
          label: 'Fintech',
          hint: 'Katero dovoljenje potrebujete, kateri regulator je pristojen in do kdaj.',
        },
        {
          key: 'Defence-tech',
          label: 'Obrambne tehnologije',
          hint: 'Kaj gradite in kje pri tem poteka meja med civilno in vojaško rabo.',
        },
        {
          key: 'Venture capital',
          label: 'Tvegani kapital',
          hint: 'Faza, krog in kaj gradite.',
        },
        {
          key: 'Crypto scams',
          label: 'Prevare s kriptovalutami',
          hint: 'Kaj ste izgubili in kdaj ter kateri naslovi denarnic in kriptoborze so vpleteni.',
        },
        {
          key: 'Something else',
          label: 'Nekaj drugega',
          hint: 'Dva stavka zadoščata — v odgovor dobite naslednje korake.',
        },
      ],
      msgHint: 'Nekaj vrstic o tem, kaj imate v mislih, povsem zadošča.',
      newMessage: 'Novo sporočilo',
      onAir: 'V pripravljenosti',
      standby: 'V mirovanju',
      nameLabel: 'Ime',
      namePlaceholder: 'Vaše ime',
      emailLabel: 'E-pošta',
      emailPlaceholder: 'vi@podjetje.com',
      messageLabel: 'Sporočilo',
      send: 'Pošlji sporočilo',
      formStates: {
        sending: 'Pošiljam…',
        success: 'Hvala — vaše sporočilo je na poti. Kmalu se oglasim.',
        error: 'Nekaj je šlo narobe — poskusite znova ali mi pišite neposredno.',
        invalid: 'Prosimo, dodajte ime, veljaven e-naslov in sporočilo.',
      },
      captcha: { label: 'Preverba', required: 'Prosimo, potrdite, da niste robot.' },
    },
    bar: {
      aria: 'Napredek strani',
      fallbackLabel: 'Za zapisnik',
      partLabel: 'Del',
      jumps: [
        { target: 'facets', title: '1. del — Kaj počnem', aria: 'Skoči na Kaj počnem' },
        { target: 'record', title: '2. del — Dosedanje delo', aria: 'Skoči na Dosedanje delo' },
        { target: 'media', title: '3. del — Mediji in tisk', aria: 'Skoči na Mediji in tisk' },
        { target: 'contact', title: '4. del — Kontakt', aria: 'Skoči na Kontakt' },
      ],
    },
  },
}

export default home
