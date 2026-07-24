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
    visit: string
    backLabel: string
    coach: string
    /** PM hub. */
    hub: { label: string; name: string; desc: string; href: string }
    /** The five categories (each with orgs; IBEX and Lemur have sub-orgs). */
    tree: MapNode[]
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
      pullQuote: 'Five practices, one desk — everything routes through Ljubljana',
      live: 'Live — tap a node to open its branch',
      networkAria: 'Peter Merc’s operating map — practices and organisations',
      visit: 'Visit',
      backLabel: 'Back to top',
      coach: 'Tap a node · drag to look around',
      hub: {
        label: 'PM',
        name: 'Peter Merc',
        desc: 'Counsel, capital, governance, teaching and evaluation — five practices run from one desk in Ljubljana. Open a branch to explore.',
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
      pullQuote: 'Pet področij, ena miza — vse poti vodijo skozi Ljubljano',
      live: 'V živo — tapnite vozlišče in odprite vejo',
      networkAria: 'Operativni zemljevid Petra Merca — področja in organizacije',
      visit: 'Obišči',
      backLabel: 'Nazaj na vrh',
      coach: 'Tapnite vozlišče · povlecite za ogled',
      hub: {
        label: 'PM',
        name: 'Peter Merc',
        desc: 'Svetovanje, kapital, upravljanje, predavanja in ocenjevanje — pet področij, ki jih vodim z ene mize v Ljubljani. Odprite vejo za več.',
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
