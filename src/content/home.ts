import type { Localized } from './types'

// All human-readable copy for the Home page, keyed by locale. Structure
// mirrors the page's sections. The *Html fields are trusted, owner-authored
// rich text rendered with v-html. The Slovenian is a first draft — flagged
// for Peter's review, especially the legal/regulatory phrasing.

// The operating map is a 3-tier tree: pm → 4 categories → 7 leaves.
export type EntityKey =
  | 'pm'
  | 'investment'
  | 'startup'
  | 'advisory'
  | 'lecture'
  | 'suricate'
  | 'ibex'
  | 'bloctopus'
  | 'blocksquare'
  | 'lemur'
  | 'thinktank'
  | 'faculty'

export interface EntityCopy {
  tag: string
  name: string
  role: string
  desc: string
  /** External link; same across locales, '' = no link (hides "Visit"). */
  href: string
  /** Short label under the SVG node (pm's "PM" hub text stays static). */
  nodeLabel: string
  aria: string
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

interface MediaCard {
  kicker: string
  title: string
  desc: string
  href: string
  external: boolean
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
    ents: Record<EntityKey, EntityCopy>
    visit: string
    prevAria: string
    nextAria: string
    orTap: string
  }
  media: {
    eyebrow: string
    chyron: string
    prevAria: string
    nextAria: string
    cards: MediaCard[]
    cta: string
    note: string
    extras: Array<{ label: string; name: string; detail: string }>
  }
  timeline: {
    eyebrow: string
    chyron: string
    aside: string
    entries: Array<{ year: string; title: string; caption: string }>
    note: string
  }
  writing: {
    eyebrow: string
    chyron: string
    segments: Array<{ seg: string; title: string }>
    linkLabel: string
    note: string
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
  }
  bar: {
    aria: string
    fallbackLabel: string
    partLabel: string
    jumps: Array<{ target: string; title: string; aria: string }>
  }
}

const home: Localized<HomeContent> = {
  en: {
    meta: {
      title: 'Peter Merc — crypto & fintech lawyer · venture investor',
      description:
        'Peter Merc, Ph.D. — tech & crypto lawyer and venture investor in Ljubljana. Founder of Lemur Legal, managing partner at Suricate Ventures, co-founder of Blocksquare and Bloctopus Intelligence.',
    },
    hero: {
      line1: 'The law moves slowly.',
      line2: 'The people I back don’t.',
      line3: 'I close the gap',
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
        'Crypto taxation',
        'Fund formation & venture deals',
        'Regulatory strategy for fintechs',
        'Panels, lectures & commentary',
        'Board & policy work',
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
                'Technology rarely waits for regulation. I advise founders, financial institutions and technology companies where law, finance and emerging technology intersect — from MiCA, PSD2 and DORA to token launches, contracts and regulatory strategy. Move fast and break things, with me in the support role.',
              list: [
                { key: 'Licensing', detail: 'PSD2 and MiCA (CASP authorisation), AML' },
                { key: 'White papers', detail: 'MiCA-compliant drafting and notification' },
                { key: 'Contracts', detail: 'Licensing agreements, IPR protection, EULA, SW development agreements' },
                { key: 'Compliance', detail: 'Acting as an external regulatory compliance officer' },
                { key: 'Intellectual property', detail: 'mojaznamka.si', href: 'https://mojaznamka.si' },
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
                { key: 'Background', detail: 'Banking, capital markets, fintech and corporate law' },
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
                'I have co-founded two deep-tech ventures. <strong style="font-weight:600;">Blocksquare</strong> provides a turn-key, regulatory-compliant solution for real-estate tokenization. <strong style="font-weight:600;">Bloctopus Intelligence</strong> is the crypto forensics and crypto recovery business.',
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
              list: [],
            },
          ],
        },
      ],
    },
    record: {
      eyebrow: 'The operating map',
      chyron: 'Track record',
      aside: 'all verifiable',
      pullQuote: 'Seven hats, one desk — everything routes through Ljubljana',
      live: 'Live — tap a node to open its dossier',
      networkAria: 'Peter Merc’s company network',
      ents: {
        pm: {
          tag: 'Principal',
          name: 'Peter Merc',
          role: 'Lawyer · investor · founder',
          desc: 'Every node routes through one desk in Ljubljana — counsel, capital and the occasional board seat, the same judgment applied three ways.',
          href: 'https://www.linkedin.com/in/petermerc/',
          nodeLabel: '',
          aria: 'Peter Merc — principal',
        },
        investment: {
          tag: 'Category',
          name: 'Investment',
          role: 'Venture & angel investing',
          desc: 'Early-stage capital through Suricate Ventures and IBEX — backing the kind of founders I advise.',
          href: '',
          nodeLabel: 'Investment',
          aria: 'Investment — Suricate Ventures and IBEX',
        },
        startup: {
          tag: 'Category',
          name: 'Startups',
          role: 'Co-founder & operator',
          desc: 'Building on-chain infrastructure and intelligence — co-founder at Blocksquare and Bloctopus.',
          href: '',
          nodeLabel: 'Startups',
          aria: 'Startups — Bloctopus and Blocksquare',
        },
        advisory: {
          tag: 'Category',
          name: 'Advisory',
          role: 'Legal & regulatory counsel',
          desc: 'Specialist tech-law counsel through Lemur Legal — MiCA, licensing and the opinions that get assets listed.',
          href: '',
          nodeLabel: 'Advisory',
          aria: 'Advisory — Lemur Legal',
        },
        lecture: {
          tag: 'Category',
          name: 'Lecturing & mentoring',
          role: 'Academia & policy',
          desc: 'Teaching financial and technology law at the New University, and policy work at Blockchain Think Tank Slovenia.',
          href: '',
          nodeLabel: 'Lecturing',
          aria: 'Lecturing and mentoring — Think Tank and New University',
        },
        suricate: {
          tag: 'Co-founded',
          name: 'Suricate Ventures',
          role: 'Co-founder & Managing Partner',
          desc: 'Early-stage venture fund backing fintech, gaming, health and logistics teams across the region.',
          href: 'https://suricate.ventures',
          nodeLabel: 'Suricate Ventures',
          aria: 'Suricate Ventures',
        },
        ibex: {
          tag: 'Investing',
          name: 'IBEX',
          role: 'Investor',
          desc: 'Angel and venture investing alongside Suricate — details to confirm. ⚠',
          href: '',
          nodeLabel: 'IBEX',
          aria: 'IBEX',
        },
        bloctopus: {
          tag: 'Managing',
          name: 'Bloctopus Intelligence',
          role: 'Managing Partner',
          desc: 'Blockchain intelligence and crypto-asset recovery.',
          href: '',
          nodeLabel: 'Bloctopus',
          aria: 'Bloctopus Intelligence',
        },
        blocksquare: {
          tag: 'Co-founded',
          name: 'Blocksquare',
          role: 'Co-founder & Chief Legal Officer',
          desc: 'Real-world-asset tokenization infrastructure — bringing property on-chain, compliantly.',
          href: 'https://blocksquare.io',
          nodeLabel: 'Blocksquare',
          aria: 'Blocksquare',
        },
        lemur: {
          tag: 'Founded',
          name: 'Lemur Legal',
          role: 'Founder & Managing Partner',
          desc: 'Specialist tech-law office: MiCA white papers, CASP licensing and the token opinions that get assets listed.',
          href: 'https://lemur.legal',
          nodeLabel: 'Lemur Legal',
          aria: 'Lemur Legal',
        },
        thinktank: {
          tag: 'Board',
          name: 'Blockchain Think Tank Slovenia',
          role: 'Board member & initiator',
          desc: 'Policy work where the Slovenian rules get drafted.',
          href: '',
          nodeLabel: 'Think Tank',
          aria: 'Blockchain Think Tank Slovenia',
        },
        faculty: {
          tag: 'Academic',
          name: 'Law Faculty, New University',
          role: 'Assistant Professor',
          desc: 'Ph.D. in law; teaching financial and technology law in Ljubljana.',
          href: 'https://www.nova-uni.si',
          nodeLabel: 'Law Faculty',
          aria: 'Law Faculty, New University Ljubljana',
        },
      },
      visit: 'Visit',
      prevAria: 'Previous — cycle the map',
      nextAria: 'Next — cycle the map',
      orTap: '— or tap any node',
    },
    media: {
      eyebrow: 'On record — media',
      chyron: 'Media & press',
      prevAria: 'Scroll coverage back',
      nextAria: 'Scroll coverage forward',
      cards: [
        {
          kicker: 'Interview — AmCham Slovenija',
          title: 'Think Forward — the interview',
          desc: 'On camera for AmCham’s Think Forward series — tech law and building Lemur Legal.',
          href: 'https://www.youtube.com/watch?v=ci0cpjHI-F8',
          external: true,
        },
        {
          kicker: 'Column — Podjetnik.si',
          title: 'Blockchain revolucija — kaj je in kaj prinaša?',
          desc: 'Why blockchain is more than Bitcoin — and what it changes first.',
          href: 'https://podjetnik.media.si/blockchain-bitcoin-revolucija-kaj-je/',
          external: true,
        },
        {
          kicker: 'Series — Bloomberg Adria · link ⚠',
          title: 'Kriptovalute: praktični koraki za upravljanje',
          desc: 'Bloomberg Adria’s crypto-education series, made with industry experts — Peter among them.',
          href: '#media',
          external: false,
          titleAttr: 'Bloomberg Adria link to confirm ⚠',
        },
      ],
      cta: 'Open coverage',
      note: 'Drop a photo straight onto each card — it sticks. ⚠ Bloomberg Adria link still to confirm; send more mentions from lemur.legal/media and they drop in.',
      extras: [
        { label: 'Stage', name: 'Money Motion', detail: '— fintech conference' },
        { label: 'Mentor', name: 'startup.si', detail: '· Startup+ / SPS programs' },
      ],
    },
    timeline: {
      eyebrow: 'The record, in order',
      chyron: 'The record, in order',
      aside: 'seven moves, one direction',
      entries: [
        { year: '2008', title: 'Bank of Slovenia', caption: 'Legal counsel — banking supervision' },
        { year: '2013', title: 'Ph.D. in law', caption: 'Doctorate — financial law' },
        { year: '2016', title: 'Fintech Factory', caption: 'Consultancy founded' },
        { year: '2017', title: 'Lemur Legal', caption: 'Tech-law office opens, Ljubljana' },
        { year: '2018', title: 'Blocksquare', caption: 'RWA tokenization, co-founded' },
        { year: '2021', title: 'Suricate Ventures', caption: 'Early-stage fund, co-founded' },
        { year: '2024', title: 'The MiCA era', caption: 'Licensing practice & Bloctopus Intelligence' },
      ],
      note: '⚠ Years indicative — send corrections and they drop straight in.',
    },
    writing: {
      eyebrow: 'Writing',
      chyron: 'Writing',
      segments: [
        { seg: 'Seg 01', title: 'MiCA compliance, in practice' },
        { seg: 'Seg 02', title: 'Token classification, and the opinions that get assets listed' },
        { seg: 'Seg 03', title: 'Crypto taxation in Slovenia' },
      ],
      linkLabel: 'lemur.legal/blog',
      note: '⚠ Topic lines shown — swap in final article titles, links and the LinkedIn destination before publishing.',
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
          key: 'MiCA & licensing',
          label: 'MiCA & licensing',
          hint: 'Which market, which token, and when you need to be live.',
        },
        {
          key: 'Listing opinion',
          label: 'Listing opinion',
          hint: 'Which asset, which venue, and the timeline you are working against.',
        },
        {
          key: 'Venture & funds',
          label: 'Venture & funds',
          hint: 'Stage, round, and what you are building.',
        },
        {
          key: 'Speaking & media',
          label: 'Speaking & media',
          hint: 'Format, date, audience.',
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
    },
    bar: {
      aria: 'Page progress',
      fallbackLabel: 'On record',
      partLabel: 'Part',
      jumps: [
        { target: 'facets', title: 'Part 1 — What I do', aria: 'Jump to What I do' },
        { target: 'record', title: 'Part 2 — Track record', aria: 'Jump to Track record' },
        { target: 'media', title: 'Part 3 — Media & press', aria: 'Jump to Media and press' },
        { target: 'writing', title: 'Part 4 — Writing', aria: 'Jump to Writing' },
        { target: 'contact', title: 'Part 5 — Contact', aria: 'Jump to Contact' },
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
      line1: 'Pravo se premika počasi.',
      line2: 'Ljudje, ki jih podpiram, pa ne.',
      line3: 'Jaz zapiram vrzel',
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
        'Obdavčitev kriptovalut',
        'Ustanavljanje skladov in naložbe tveganega kapitala',
        'Regulatorna strategija za finteche',
        'Paneli, predavanja in komentarji',
        'Delo v odborih in oblikovanje politik',
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
                'Tehnologija le redko počaka na regulativo. Svetujem ustanoviteljem, finančnim institucijam in tehnološkim podjetjem tam, kjer se prepletajo pravo, finance in nastajajoče tehnologije — od MiCA, PSD2 in DORA do izdaj žetonov, pogodb in regulativne strategije. »Move fast and break things«, z mano v podporni vlogi.',
              list: [
                { key: 'Licenciranje', detail: 'PSD2 in MiCA (dovoljenje CASP), AML' },
                { key: 'Beli papirji', detail: 'Priprava in notifikacija skladno z MiCA' },
                { key: 'Pogodbe', detail: 'Licenčne pogodbe, zaščita IP, EULA, pogodbe o razvoju programske opreme' },
                { key: 'Skladnost', detail: 'Delovanje kot zunanji pooblaščenec za regulativno skladnost' },
                { key: 'Intelektualna lastnina', detail: 'mojaznamka.si', href: 'https://mojaznamka.si' },
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
                { key: 'Ozadje', detail: 'Bančništvo, kapitalski trgi, fintech in gospodarsko pravo' },
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
                'Soustanovil sem dve globokotehnološki (deep-tech) podjetji. <strong style="font-weight:600;">Blocksquare</strong> ponuja celovito, regulativno skladno rešitev za tokenizacijo nepremičnin. <strong style="font-weight:600;">Bloctopus Intelligence</strong> je podjetje za kripto forenziko in povrnitev kripto sredstev.',
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
              list: [],
            },
          ],
        },
      ],
    },
    record: {
      eyebrow: 'Operativni zemljevid',
      chyron: 'Dosedanje delo',
      aside: 'vse preverljivo',
      pullQuote: 'Sedem klobukov, ena miza — vse poti vodijo skozi Ljubljano',
      live: 'V živo — tapnite vozlišče in odprite dosje',
      networkAria: 'Mreža podjetij Petra Merca',
      ents: {
        pm: {
          tag: 'Nosilec',
          name: 'Peter Merc',
          role: 'Pravnik · vlagatelj · ustanovitelj',
          desc: 'Vsako vozlišče vodi skozi eno mizo v Ljubljani — svetovanje, kapital in tu in tam sedež v odboru; ista presoja, uporabljena na tri načine.',
          href: 'https://www.linkedin.com/in/petermerc/',
          nodeLabel: '',
          aria: 'Peter Merc — nosilec',
        },
        investment: {
          tag: 'Kategorija',
          name: 'Naložbe',
          role: 'Tvegani kapital in angelske naložbe',
          desc: 'Kapital za zgodnje faze prek Suricate Ventures in IBEX — podpiram takšne ustanovitelje, kakršnim svetujem.',
          href: '',
          nodeLabel: 'Naložbe',
          aria: 'Naložbe — Suricate Ventures in IBEX',
        },
        startup: {
          tag: 'Kategorija',
          name: 'Startupi',
          role: 'Soustanovitelj in operativec',
          desc: 'Gradnja verižne infrastrukture in forenzike — soustanovitelj pri Blocksquare in Bloctopus.',
          href: '',
          nodeLabel: 'Startupi',
          aria: 'Startupi — Bloctopus in Blocksquare',
        },
        advisory: {
          tag: 'Kategorija',
          name: 'Svetovanje',
          role: 'Pravno in regulatorno svetovanje',
          desc: 'Specializirano tehnološko-pravno svetovanje prek Lemur Legal — MiCA, licenciranje in mnenja, s katerimi se sredstva uvrstijo.',
          href: '',
          nodeLabel: 'Svetovanje',
          aria: 'Svetovanje — Lemur Legal',
        },
        lecture: {
          tag: 'Kategorija',
          name: 'Predavanja in mentorstvo',
          role: 'Akademsko delo in politike',
          desc: 'Predavanja finančnega in tehnološkega prava na Novi univerzi ter delo pri politikah v Blockchain Think Tank Slovenija.',
          href: '',
          nodeLabel: 'Predavanja',
          aria: 'Predavanja in mentorstvo — Think Tank in Nova univerza',
        },
        suricate: {
          tag: 'Soustanovil',
          name: 'Suricate Ventures',
          role: 'Soustanovitelj in vodilni partner',
          desc: 'Sklad tveganega kapitala za zgodnje faze, ki v regiji podpira ekipe s področij fintecha, iger, zdravja in logistike.',
          href: 'https://suricate.ventures',
          nodeLabel: 'Suricate Ventures',
          aria: 'Suricate Ventures',
        },
        ibex: {
          tag: 'Naložbe',
          name: 'IBEX',
          role: 'Vlagatelj',
          desc: 'Angelske in tvegane naložbe ob Suricate — podrobnosti za potrditev. ⚠',
          href: '',
          nodeLabel: 'IBEX',
          aria: 'IBEX',
        },
        bloctopus: {
          tag: 'Vodi',
          name: 'Bloctopus Intelligence',
          role: 'Vodilni partner',
          desc: 'Blockchain forenzika in povrnitev kripto sredstev.',
          href: '',
          nodeLabel: 'Bloctopus',
          aria: 'Bloctopus Intelligence',
        },
        blocksquare: {
          tag: 'Soustanovil',
          name: 'Blocksquare',
          role: 'Soustanovitelj in glavni pravnik',
          desc: 'Infrastruktura za tokenizacijo stvarnega premoženja — nepremičnine na verigi, skladno s predpisi.',
          href: 'https://blocksquare.io',
          nodeLabel: 'Blocksquare',
          aria: 'Blocksquare',
        },
        lemur: {
          tag: 'Ustanovil',
          name: 'Lemur Legal',
          role: 'Ustanovitelj in vodilni partner',
          desc: 'Specializirana pisarna za tehnološko pravo: beli papirji po MiCA, licenciranje CASP in mnenja o žetonih, s katerimi se sredstva uvrstijo na borze.',
          href: 'https://lemur.legal',
          nodeLabel: 'Lemur Legal',
          aria: 'Lemur Legal',
        },
        thinktank: {
          tag: 'Odbor',
          name: 'Blockchain Think Tank Slovenija',
          role: 'Član odbora in pobudnik',
          desc: 'Delo pri politikah, kjer nastajajo slovenska pravila.',
          href: '',
          nodeLabel: 'Think Tank',
          aria: 'Blockchain Think Tank Slovenija',
        },
        faculty: {
          tag: 'Akademsko',
          name: 'Pravna fakulteta, Nova univerza',
          role: 'Docent',
          desc: 'Doktor prava; predava finančno in tehnološko pravo v Ljubljani.',
          href: 'https://www.nova-uni.si',
          nodeLabel: 'Pravna fakulteta',
          aria: 'Pravna fakulteta, Nova univerza v Ljubljani',
        },
      },
      visit: 'Obišči',
      prevAria: 'Prejšnje — kroženje po zemljevidu',
      nextAria: 'Naslednje — kroženje po zemljevidu',
      orTap: '— ali tapnite katerokoli vozlišče',
    },
    media: {
      eyebrow: 'Za zapisnik — mediji',
      chyron: 'Mediji in tisk',
      prevAria: 'Pomakni prispevke nazaj',
      nextAria: 'Pomakni prispevke naprej',
      cards: [
        {
          kicker: 'Intervju — AmCham Slovenija',
          title: 'Think Forward — intervju',
          desc: 'Pred kamero v AmChamovi seriji Think Forward — tehnološko pravo in gradnja Lemur Legal.',
          href: 'https://www.youtube.com/watch?v=ci0cpjHI-F8',
          external: true,
        },
        {
          kicker: 'Kolumna — Podjetnik.si',
          title: 'Blockchain revolucija — kaj je in kaj prinaša?',
          desc: 'Zakaj je blockchain več kot bitcoin — in kaj spremeni najprej.',
          href: 'https://podjetnik.media.si/blockchain-bitcoin-revolucija-kaj-je/',
          external: true,
        },
        {
          kicker: 'Serija — Bloomberg Adria · povezava ⚠',
          title: 'Kriptovalute: praktični koraki za upravljanje',
          desc: 'Izobraževalna kripto serija Bloomberg Adria, posneta z industrijskimi strokovnjaki — med njimi Peter.',
          href: '#media',
          external: false,
          titleAttr: 'Povezava Bloomberg Adria za potrditev ⚠',
        },
      ],
      cta: 'Odpri prispevek',
      note: 'Fotografijo spustite naravnost na kartico — obstane. ⚠ Povezavo Bloomberg Adria še potrjujemo; pošljite več omemb z lemur.legal/media in jih dodamo.',
      extras: [
        { label: 'Oder', name: 'Money Motion', detail: '— fintech konferenca' },
        { label: 'Mentor', name: 'startup.si', detail: '· programa Startup+ / SPS' },
      ],
    },
    timeline: {
      eyebrow: 'Kronologija',
      chyron: 'Kronologija',
      aside: 'sedem potez, ena smer',
      entries: [
        { year: '2008', title: 'Banka Slovenije', caption: 'Pravni svetovalec — bančni nadzor' },
        { year: '2013', title: 'Doktorat iz prava', caption: 'Doktorat — finančno pravo' },
        { year: '2016', title: 'Fintech Factory', caption: 'Ustanovljeno svetovalno podjetje' },
        { year: '2017', title: 'Lemur Legal', caption: 'Odprtje pisarne za tehnološko pravo, Ljubljana' },
        { year: '2018', title: 'Blocksquare', caption: 'Tokenizacija stvarnega premoženja, soustanovitelj' },
        { year: '2021', title: 'Suricate Ventures', caption: 'Sklad za zgodnje faze, soustanovitelj' },
        { year: '2024', title: 'Doba MiCA', caption: 'Praksa licenciranja in Bloctopus Intelligence' },
      ],
      note: '⚠ Letnice so okvirne — pošljite popravke in takoj jih vnesemo.',
    },
    writing: {
      eyebrow: 'Objave',
      chyron: 'Objave',
      segments: [
        { seg: 'Seg 01', title: 'Skladnost z MiCA v praksi' },
        { seg: 'Seg 02', title: 'Klasifikacija žetonov in mnenja, s katerimi se sredstva uvrstijo' },
        { seg: 'Seg 03', title: 'Obdavčitev kriptovalut v Sloveniji' },
      ],
      linkLabel: 'lemur.legal/blog',
      note: '⚠ Prikazane so tematske vrstice — pred objavo zamenjajte s končnimi naslovi člankov, povezavami in LinkedIn destinacijo.',
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
          key: 'MiCA & licensing',
          label: 'MiCA in licenciranje',
          hint: 'Kateri trg, kateri žeton in do kdaj morate biti operativni.',
        },
        {
          key: 'Listing opinion',
          label: 'Mnenje za uvrstitev',
          hint: 'Katero sredstvo, katera borza in kakšen je vaš časovni okvir.',
        },
        {
          key: 'Venture & funds',
          label: 'Naložbe in skladi',
          hint: 'Faza, krog in kaj gradite.',
        },
        {
          key: 'Speaking & media',
          label: 'Nastopi in mediji',
          hint: 'Format, datum, občinstvo.',
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
    },
    bar: {
      aria: 'Napredek strani',
      fallbackLabel: 'Za zapisnik',
      partLabel: 'Del',
      jumps: [
        { target: 'facets', title: '1. del — Kaj počnem', aria: 'Skoči na Kaj počnem' },
        { target: 'record', title: '2. del — Dosedanje delo', aria: 'Skoči na Dosedanje delo' },
        { target: 'media', title: '3. del — Mediji in tisk', aria: 'Skoči na Mediji in tisk' },
        { target: 'writing', title: '4. del — Objave', aria: 'Skoči na Objave' },
        { target: 'contact', title: '5. del — Kontakt', aria: 'Skoči na Kontakt' },
      ],
    },
  },
}

export default home
