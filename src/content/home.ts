import type { Localized } from './types'

// All human-readable copy for the Home page, keyed by locale. Structure
// mirrors the page's sections. The *Html fields are trusted, owner-authored
// rich text rendered with v-html. The Slovenian is a first draft — flagged
// for Peter's review, especially the legal/regulatory phrasing.

export type EntityKey =
  | 'pm'
  | 'lemur'
  | 'suricate'
  | 'blocksquare'
  | 'bloctopus'
  | 'fintech'
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

interface BriefRow {
  label: string
  value: string
}

interface Brief {
  title: string
  tagline: string
  /** Feeds the sticky progress-bar label via [data-chyron]. */
  chyron: string
  paragraphHtml: string
  rows: BriefRow[]
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
    counsel: Brief
    investor: Brief
    voice: Brief & { quoteWords: string[] }
    founder: Brief
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
     * the hints lookup key, and the mail subject ("Website inquiry — <key>"),
     * so the site owner's received data stays English for both languages.
     * Only `label` and `hint` localize.
     */
    topics: Array<{ key: string; label: string; hint: string }>
    msgHint: string
    newMessage: string
    onAir: string
    standby: string
    toLabel: string
    toName: string
    toConfirm: string
    subjectLabel: string
    messageLabel: string
    send: string
    sentNote: string
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
      badgeRole: 'Ph.D. in law · founder · investor — Ljubljana',
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
      hint: 'open a line to read the brief',
      counsel: {
        title: 'Counsel',
        tagline: 'crypto & fintech law — MiCA, licensing, listing opinions',
        chyron: 'Counsel — crypto & fintech law',
        paragraphHtml:
          'MiCA white papers and licensing, token classification, the legal opinions that get assets listed. Years in bank supervision and capital markets before any of this had a rulebook — now I help write the filings my clients live by.',
        rows: [
          { label: 'White papers', value: 'MiCA-compliant drafting and notification' },
          { label: 'Licensing', value: 'CASP authorisation across the EU' },
          { label: 'Opinions', value: 'Token classification for exchange listings' },
          { label: 'Background', value: 'Central-bank supervision and capital markets' },
        ],
      },
      investor: {
        title: 'Investor',
        tagline: 'early-stage venture — co-founder & managing partner, Suricate',
        chyron: 'Investor — Suricate Ventures',
        paragraphHtml:
          'Co-founder and managing partner of an early-stage fund backing fintech, gaming, health and logistics teams. I invest in the kind of founders I advise, which keeps the advice honest.',
        rows: [
          { label: 'Fund', value: 'Suricate Ventures, early-stage' },
          { label: 'Sectors', value: 'Fintech, gaming, health, logistics' },
          { label: 'Stage', value: 'Pre-seed and seed' },
          { label: 'Edge', value: 'Legal depth on regulated markets' },
        ],
      },
      voice: {
        title: 'Voice',
        tagline: 'media & stages — the one who gets called when rules shift',
        chyron: 'Voice — media & stages',
        quoteWords: ['When', 'the', 'regulation', 'shifts,', 'I’m', 'who', 'gets', 'called', 'to', 'explain', 'it'],
        paragraphHtml:
          'A regular translator of EU crypto rules for Slovenian and international press, and a panelist where the token questions actually get asked.',
        rows: [
          { label: 'Formats', value: 'TV and print commentary, panels, keynotes' },
          { label: 'Topics', value: 'MiCA, crypto taxation, tokenization' },
          { label: 'Teaching', value: 'Assistant Professor, New University Ljubljana' },
        ],
      },
      founder: {
        title: 'Founder',
        tagline: 'built what I counsel — Lemur, Blocksquare, Bloctopus',
        chyron: 'Founder — builder, not just adviser',
        paragraphHtml:
          'I’ve built what I counsel: <a href="https://lemur.legal" target="_blank" rel="noopener">Lemur Legal</a>, <strong style="font-weight:600;">Suricate Ventures</strong>, and co-founded <strong style="font-weight:600;">Blocksquare</strong> (real-world-asset tokenization) and <strong style="font-weight:600;">Bloctopus Intelligence</strong>. Board member, Blockchain Think Tank Slovenia.',
        rows: [
          { label: 'Lemur Legal', value: 'Specialist tech-law office, Ljubljana' },
          { label: 'Blocksquare', value: 'Real-world-asset tokenization infrastructure' },
          { label: 'Bloctopus', value: 'Blockchain intelligence and crypto recovery' },
          { label: 'Fintech Factory', value: 'Fintech consultancy' },
        ],
      },
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
          href: '',
          nodeLabel: '',
          aria: 'Peter Merc — principal',
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
        suricate: {
          tag: 'Co-founded',
          name: 'Suricate Ventures',
          role: 'Co-founder & Managing Partner',
          desc: 'Early-stage venture fund backing fintech, gaming, health and logistics teams across the region.',
          href: 'https://suricate.ventures',
          nodeLabel: 'Suricate Ventures',
          aria: 'Suricate Ventures',
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
        bloctopus: {
          tag: 'Managing',
          name: 'Bloctopus Intelligence',
          role: 'Managing Partner',
          desc: 'Blockchain intelligence and crypto-asset recovery.',
          href: '',
          nodeLabel: 'Bloctopus',
          aria: 'Bloctopus Intelligence',
        },
        fintech: {
          tag: 'Founded',
          name: 'Fintech Factory',
          role: 'Founder',
          desc: 'Fintech consultancy — regulatory strategy for banks and startups.',
          href: '',
          nodeLabel: 'Fintech Factory',
          aria: 'Fintech Factory',
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
      visit: 'Visit ↗',
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
      linkLabel: 'lemur.legal/blog ↗',
      note: '⚠ Topic lines shown — swap in final article titles, links and the LinkedIn destination before publishing.',
    },
    contact: {
      eyebrow: 'Contact',
      chyron: 'Contact',
      headline: 'If what you’re building runs ahead of the rulebook, we should talk',
      intro:
        'Pick a topic and fill in the draft below — the button opens the finished email in your own mail app. Nothing sends from this page.',
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
      newMessage: 'New message — draft',
      onAir: 'On air',
      standby: 'Standby',
      toLabel: 'To',
      toName: 'Peter Merc',
      toConfirm: '⚠ to confirm',
      subjectLabel: 'Subject',
      messageLabel: 'Message',
      send: 'Open the draft in my mail app ↗',
      sentNote: 'Draft opened — press send there to deliver it ✓',
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
      badgeRole: 'doktor prava · ustanovitelj · vlagatelj — Ljubljana',
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
      hint: 'odprite vrstico in preberite povzetek',
      counsel: {
        title: 'Svetovalec',
        tagline: 'kripto in fintech pravo — MiCA, licenciranje, mnenja za uvrstitve',
        chyron: 'Svetovalec — kripto in fintech pravo',
        paragraphHtml:
          'Beli papirji po MiCA in licenciranje, klasifikacija žetonov, pravna mnenja, s katerimi se sredstva uvrstijo na borze. Leta v bančnem nadzoru in na kapitalskih trgih, še preden je vse to imelo pravila — danes pomagam pisati vloge, po katerih živijo moje stranke.',
        rows: [
          { label: 'Beli papirji', value: 'Priprava in notifikacija skladno z MiCA' },
          { label: 'Licenciranje', value: 'Dovoljenja CASP po vsej EU' },
          { label: 'Mnenja', value: 'Klasifikacija žetonov za uvrstitve na borze' },
          { label: 'Ozadje', value: 'Nadzor centralne banke in kapitalski trgi' },
        ],
      },
      investor: {
        title: 'Vlagatelj',
        tagline: 'zgodnje naložbe — soustanovitelj in vodilni partner, Suricate',
        chyron: 'Vlagatelj — Suricate Ventures',
        paragraphHtml:
          'Soustanovitelj in vodilni partner sklada za zgodnje faze, ki podpira ekipe s področij fintecha, iger, zdravja in logistike. Vlagam v takšne ustanovitelje, kakršnim svetujem — in to ohranja nasvete iskrene.',
        rows: [
          { label: 'Sklad', value: 'Suricate Ventures, zgodnje faze' },
          { label: 'Sektorji', value: 'Fintech, igre, zdravje, logistika' },
          { label: 'Faza', value: 'Pre-seed in seed' },
          { label: 'Prednost', value: 'Pravna globina na reguliranih trgih' },
        ],
      },
      voice: {
        title: 'Glas',
        tagline: 'mediji in odri — tisti, ki ga pokličejo, ko se pravila spremenijo',
        chyron: 'Glas — mediji in odri',
        quoteWords: ['Ko', 'se', 'regulativa', 'premakne,', 'pokličejo', 'mene,', 'da', 'jo', 'razložim'],
        paragraphHtml:
          'Redni prevajalec evropskih kripto pravil za slovenske in mednarodne medije ter panelist tam, kjer se vprašanja o žetonih zares zastavljajo.',
        rows: [
          { label: 'Formati', value: 'TV in tiskani komentarji, paneli, predavanja' },
          { label: 'Teme', value: 'MiCA, obdavčitev kriptovalut, tokenizacija' },
          { label: 'Poučevanje', value: 'Docent, Nova univerza v Ljubljani' },
        ],
      },
      founder: {
        title: 'Ustanovitelj',
        tagline: 'zgradil, kar svetujem — Lemur, Blocksquare, Bloctopus',
        chyron: 'Ustanovitelj — graditelj, ne le svetovalec',
        paragraphHtml:
          'Zgradil sem, kar svetujem: <a href="https://lemur.legal" target="_blank" rel="noopener">Lemur Legal</a>, <strong style="font-weight:600;">Suricate Ventures</strong>, soustanovil pa <strong style="font-weight:600;">Blocksquare</strong> (tokenizacija stvarnega premoženja) in <strong style="font-weight:600;">Bloctopus Intelligence</strong>. Član odbora, Blockchain Think Tank Slovenija.',
        rows: [
          { label: 'Lemur Legal', value: 'Specializirana pisarna za tehnološko pravo, Ljubljana' },
          { label: 'Blocksquare', value: 'Infrastruktura za tokenizacijo stvarnega premoženja' },
          { label: 'Bloctopus', value: 'Blockchain forenzika in povrnitev kripto sredstev' },
          { label: 'Fintech Factory', value: 'Fintech svetovanje' },
        ],
      },
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
          href: '',
          nodeLabel: '',
          aria: 'Peter Merc — nosilec',
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
        suricate: {
          tag: 'Soustanovil',
          name: 'Suricate Ventures',
          role: 'Soustanovitelj in vodilni partner',
          desc: 'Sklad tveganega kapitala za zgodnje faze, ki v regiji podpira ekipe s področij fintecha, iger, zdravja in logistike.',
          href: 'https://suricate.ventures',
          nodeLabel: 'Suricate Ventures',
          aria: 'Suricate Ventures',
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
        bloctopus: {
          tag: 'Vodi',
          name: 'Bloctopus Intelligence',
          role: 'Vodilni partner',
          desc: 'Blockchain forenzika in povrnitev kripto sredstev.',
          href: '',
          nodeLabel: 'Bloctopus',
          aria: 'Bloctopus Intelligence',
        },
        fintech: {
          tag: 'Ustanovil',
          name: 'Fintech Factory',
          role: 'Ustanovitelj',
          desc: 'Fintech svetovanje — regulatorna strategija za banke in startupe.',
          href: '',
          nodeLabel: 'Fintech Factory',
          aria: 'Fintech Factory',
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
      visit: 'Obišči ↗',
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
      linkLabel: 'lemur.legal/blog ↗',
      note: '⚠ Prikazane so tematske vrstice — pred objavo zamenjajte s končnimi naslovi člankov, povezavami in LinkedIn destinacijo.',
    },
    contact: {
      eyebrow: 'Kontakt',
      chyron: 'Kontakt',
      headline: 'Če to, kar gradite, prehiteva pravila, se morava pogovoriti',
      intro:
        'Izberite temo in izpolnite osnutek spodaj — gumb odpre pripravljeno e-pošto v vašem poštnem odjemalcu. S te strani se ne pošlje nič.',
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
      newMessage: 'Novo sporočilo — osnutek',
      onAir: 'V etru',
      standby: 'V pripravljenosti',
      toLabel: 'Za',
      toName: 'Peter Merc',
      toConfirm: '⚠ za potrditev',
      subjectLabel: 'Zadeva',
      messageLabel: 'Sporočilo',
      send: 'Odpri osnutek v mojem poštnem odjemalcu ↗',
      sentNote: 'Osnutek odprt — tam pritisnite pošlji, da ga dostavite ✓',
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
