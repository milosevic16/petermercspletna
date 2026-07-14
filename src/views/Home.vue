<template>
<main id="main">

    <section id="hero" data-screen-label="Hero" data-chyron="__hide" style="position:relative; background:#6E6E6E; color:#F4F1EA; min-height:min(92svh, 62rem); display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 30rem), 1fr)); overflow:hidden;">
      <div style="container-type:inline-size; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; gap:clamp(1.7rem, 4vh, 2.8rem); padding:clamp(3.5rem, 9vh, 7rem) clamp(1rem, 3vw, 3rem) clamp(3rem, 7vh, 5rem) clamp(1.25rem, 5vw, 5rem);">
        <h1 style="margin:0; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:min(3.3rem, 7.4cqw); line-height:1.1; letter-spacing:-0.015em; color:#FAF8F2;">
          <span id="mline-1" style="display:block; font-weight:300; font-style:italic; color:#E2DED2; margin-bottom:0.5em; will-change:transform; animation:pm-rise 0.7s cubic-bezier(0.2,0.7,0.2,1) 0.05s backwards;">{{ t.hero.line1 }}</span>
          <span id="mline-2" style="display:block; font-weight:600; will-change:transform; animation:pm-rise 0.7s cubic-bezier(0.2,0.7,0.2,1) 0.24s backwards;">{{ t.hero.line2 }}</span>
          <span id="mline-3" style="display:block; font-weight:600; color:#C8C3B6; margin-top:0.42em; transition:color 0.5s cubic-bezier(0.4,0,0.2,1); animation:pm-rise 0.7s cubic-bezier(0.2,0.7,0.2,1) 0.44s backwards;">{{ t.hero.line3 }}<span id="mline-period" style="display:inline-block; color:var(--accent);">.</span></span>
        </h1>
        <p style="margin:0; display:inline-flex; align-items:center; gap:0.9rem; flex-wrap:wrap; background:var(--graphite); border-left:3px solid var(--accent); padding:0.72rem 1.15rem; animation:pm-slide 0.6s cubic-bezier(0.2,0.7,0.2,1) 0.75s backwards;">
          <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.62rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#C9C4B8;">{{ t.hero.badgeName }}</span>
          <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; color:var(--ivory2);">{{ t.hero.badgeRole }}</span>
        </p>
      </div>
      <div style="position:relative; min-height:min(64svh, 42rem); overflow:hidden;">
        <div class="pm-desktop-only">
          <img id="hero-img" src="/assets/b56f58c1.jpg" :alt="t.hero.imgAlt" loading="eager" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:50% 0%; filter:grayscale(1) contrast(1.02); transform-origin:50% 0%; animation:pm-settle 2.4s cubic-bezier(0.22,0.61,0.36,1) backwards;">
          <div aria-hidden="true" style="position:absolute; inset:0; background:#6E6E6E; mask-image:linear-gradient(to right, black 0%, transparent 12%); -webkit-mask-image:linear-gradient(to right, black 0%, transparent 12%); pointer-events:none;"></div>
        </div>
        <div class="pm-mobile-only">
          <img id="hero-img-m" src="/assets/dac13693.jpg" :alt="t.hero.imgAlt" loading="eager" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:50% 0%; filter:grayscale(1) contrast(1.02); transform-origin:50% 0%; animation:pm-settle 2.4s cubic-bezier(0.22,0.61,0.36,1) backwards;">
          <div aria-hidden="true" style="position:absolute; inset:0; background:#6E6E6E; mask-image:linear-gradient(to bottom, black 0%, rgba(0,0,0,0.58) 3.5%, rgba(0,0,0,0.3) 6.5%, rgba(0,0,0,0.1) 9%, transparent 11.5%); -webkit-mask-image:linear-gradient(to bottom, black 0%, rgba(0,0,0,0.58) 3.5%, rgba(0,0,0,0.3) 6.5%, rgba(0,0,0,0.1) 9%, transparent 11.5%); pointer-events:none;"></div>
        </div>
      </div>
    </section>

    <button id="docket" type="button" data-on-click="advanceDocket" :aria-label="t.docket.aria" style="display:flex; flex-wrap:wrap; align-items:center; gap:0.5rem 1.1rem; width:100%; box-sizing:border-box; background:var(--graphite); border:0; padding:0.7rem clamp(1.25rem, 4vw, 3rem); cursor:pointer; text-align:left; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="background:color-mix(in oklab, var(--graphite) 93%, #FFFFFF);">
      <span style="flex:none; display:inline-flex; align-items:center; background:var(--ivory); border-left:3px solid var(--accent); color:var(--graphite); padding:0.38rem 0.7rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.62rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;">{{ t.docket.eyebrow }}</span>
      <span style="flex:1 1 14rem; min-width:0; overflow:hidden;"><span id="docket-item" style="display:block; font-family:'Spectral', Georgia, serif; font-style:italic; font-size:1.05rem; line-height:1.4; color:var(--ivory);" data-bind="docketText">{{ t.docket.items[0] }}</span></span>
      <span style="flex:none; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.7rem; font-weight:600; letter-spacing:0.18em; color:#948E81; font-variant-numeric:tabular-nums;" data-bind="docketIdx">01 / 08</span>

        <span aria-hidden="true" style="flex:none; width:18px; height:18px; display:inline-flex;">
          <svg viewBox="0 0 18 18" style="width:100%; height:100%; transform:rotate(-90deg); display:block;">
            <circle cx="9" cy="9" r="7.5" fill="none" stroke="rgba(236,231,220,0.18)" stroke-width="1.5"></circle>
            <circle id="docket-prog-ring" cx="9" cy="9" r="7.5" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="47.12" stroke-dashoffset="47.12"></circle>
          </svg>
        </span>



    </button>

    <section id="facets" data-screen-label="What I do" style="background:var(--paper); padding:clamp(3rem, 6.5vw, 4.8rem) 0;">
      <div style="max-width:76rem; margin:0 auto; padding-left:clamp(1.25rem, 5vw, 4rem); padding-right:clamp(1.25rem, 5vw, 4rem); display:flex; flex-direction:column; gap:0;">
        <h2 style="margin:0 0 clamp(1.3rem, 2.8vw, 1.9rem); display:flex; align-items:center; gap:1.1rem;">
          <span style="display:inline-flex; align-items:center; background:var(--graphite); border-left:3px solid var(--accent); color:#D6D1C5; padding:0.5rem 0.85rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;">{{ t.facets.eyebrow }}</span>
          <span aria-hidden="true" data-rule="" style="flex:1; border-top:1px solid var(--line);"></span>
          <em style="font-family:'Spectral', Georgia, serif; font-weight:400; font-style:italic; font-size:0.9rem; color:var(--ink2);">{{ t.facets.hint }}</em>
        </h2>

        <article id="counsel" :data-chyron="t.facets.counsel.chyron" data-reveal="0" style="margin:0;">
          <button id="btn-counsel" type="button" data-on-click="toggleCounsel" aria-expanded="false" aria-controls="brief-counsel" style="display:flex; flex-wrap:wrap; align-items:center; gap:0.3rem 1.4rem; width:100%; box-sizing:border-box; text-align:left; background:transparent; border:0; border-top:1px solid var(--line); padding:1rem 0.2rem; min-height:44px; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="background:rgba(23,24,26,0.04);">
            <strong style="flex:0 0 10.5rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.3rem; color:var(--ink);">{{ t.facets.counsel.title }}</strong>
            <em style="flex:1 1 16rem; font-family:'Spectral', Georgia, serif; font-style:italic; font-weight:400; font-size:0.97rem; color:var(--ink2);">{{ t.facets.counsel.tagline }}</em>
            <span id="ico-counsel" style="margin-left:auto; display:inline-flex; align-items:center; justify-content:center; width:1.5rem; height:1.5rem; border:1px solid var(--ink2); color:var(--ink2); font-size:1.05rem; line-height:1; flex:none; transition:transform 0.35s cubic-bezier(0.2,0.7,0.2,1), color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);">+</span>
          </button>
          <div id="brief-counsel" style="display:grid; grid-template-rows:0fr; transition:grid-template-rows 0.5s cubic-bezier(0.2,0.7,0.2,1);">
            <div style="overflow:hidden; min-height:0;">
              <div style="padding:0.2rem 0.2rem 1.4rem; max-width:62ch;">
                <p style="margin:0 0 0.7rem; font-size:1.03rem; line-height:1.64; color:#34332E;" v-html="t.facets.counsel.paragraphHtml"></p>
                <div v-for="row in t.facets.counsel.rows" :key="row.label" style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">{{ row.label }}</span><span style="flex:1 1 16rem; font-size:0.98rem; color:#34332E;">{{ row.value }}</span></div>
              </div>
            </div>
          </div>
        </article>

        <article id="investor" :data-chyron="t.facets.investor.chyron" data-reveal="1" style="margin:0;">
          <button id="btn-investor" type="button" data-on-click="toggleInvestor" aria-expanded="false" aria-controls="brief-investor" style="display:flex; flex-wrap:wrap; align-items:center; gap:0.3rem 1.4rem; width:100%; box-sizing:border-box; text-align:left; background:transparent; border:0; border-top:1px solid var(--line); padding:1rem 0.2rem; min-height:44px; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="background:rgba(23,24,26,0.04);">
            <strong style="flex:0 0 10.5rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.3rem; color:var(--ink);">{{ t.facets.investor.title }}</strong>
            <em style="flex:1 1 16rem; font-family:'Spectral', Georgia, serif; font-style:italic; font-weight:400; font-size:0.97rem; color:var(--ink2);">{{ t.facets.investor.tagline }}</em>
            <span id="ico-investor" style="margin-left:auto; display:inline-flex; align-items:center; justify-content:center; width:1.5rem; height:1.5rem; border:1px solid var(--ink2); color:var(--ink2); font-size:1.05rem; line-height:1; flex:none; transition:transform 0.35s cubic-bezier(0.2,0.7,0.2,1), color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);">+</span>
          </button>
          <div id="brief-investor" style="display:grid; grid-template-rows:0fr; transition:grid-template-rows 0.5s cubic-bezier(0.2,0.7,0.2,1);">
            <div style="overflow:hidden; min-height:0;">
              <div style="padding:0.2rem 0.2rem 1.4rem; max-width:62ch;">
                <p style="margin:0 0 0.7rem; font-size:1.03rem; line-height:1.64; color:#34332E;" v-html="t.facets.investor.paragraphHtml"></p>
                <div v-for="row in t.facets.investor.rows" :key="row.label" style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">{{ row.label }}</span><span style="flex:1 1 12rem; font-size:0.98rem; color:#34332E;">{{ row.value }}</span></div>
              </div>
            </div>
          </div>
        </article>

        <article id="voice" :data-chyron="t.facets.voice.chyron" data-reveal="2" style="margin:0;">
          <button id="btn-voice" type="button" data-on-click="toggleVoice" aria-expanded="false" aria-controls="brief-voice" style="display:flex; flex-wrap:wrap; align-items:center; gap:0.3rem 1.4rem; width:100%; box-sizing:border-box; text-align:left; background:transparent; border:0; border-top:1px solid var(--line); padding:1rem 0.2rem; min-height:44px; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="background:rgba(23,24,26,0.04);">
            <strong style="flex:0 0 10.5rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.3rem; color:var(--ink);">{{ t.facets.voice.title }}</strong>
            <em style="flex:1 1 16rem; font-family:'Spectral', Georgia, serif; font-style:italic; font-weight:400; font-size:0.97rem; color:var(--ink2);">{{ t.facets.voice.tagline }}</em>
            <span id="ico-voice" style="margin-left:auto; display:inline-flex; align-items:center; justify-content:center; width:1.5rem; height:1.5rem; border:1px solid var(--ink2); color:var(--ink2); font-size:1.05rem; line-height:1; flex:none; transition:transform 0.35s cubic-bezier(0.2,0.7,0.2,1), color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);">+</span>
          </button>
          <div id="brief-voice" style="display:grid; grid-template-rows:0fr; transition:grid-template-rows 0.5s cubic-bezier(0.2,0.7,0.2,1);">
            <div style="overflow:hidden; min-height:0;">
              <div style="padding:0.4rem 0.2rem 1.4rem; max-width:62ch;">
                <p id="voice-quote" style="margin:0 0 0.9rem; font-family:'Spectral', Georgia, serif; font-style:italic; font-weight:500; font-size:clamp(1.3rem, 2.2vw, 1.7rem); line-height:1.35; color:var(--ink); max-width:26ch;"><template v-for="(w, wi) in t.facets.voice.quoteWords" :key="wi"><span style="display:inline-block; overflow:hidden; padding-bottom:0.12em; margin-bottom:-0.12em;"><span data-qw="" style="display:inline-block;">{{ w }}<span v-if="wi === t.facets.voice.quoteWords.length - 1" id="voice-period" style="display:inline-block; color:var(--accent); font-style:normal;">.</span></span></span>{{ ' ' }}</template></p>
                <p style="margin:0 0 0.7rem; font-size:1.03rem; line-height:1.64; color:#34332E;" v-html="t.facets.voice.paragraphHtml"></p>
                  <div v-for="row in t.facets.voice.rows" :key="row.label" style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">{{ row.label }}</span><span style="flex:1 1 12rem; font-size:0.98rem; color:#34332E;">{{ row.value }}</span></div>
              </div>
            </div>
          </div>
        </article>

        <article id="founder" :data-chyron="t.facets.founder.chyron" data-reveal="3" style="margin:0; border-bottom:1px solid var(--line);">
          <button id="btn-founder" type="button" data-on-click="toggleFounder" aria-expanded="false" aria-controls="brief-founder" style="display:flex; flex-wrap:wrap; align-items:center; gap:0.3rem 1.4rem; width:100%; box-sizing:border-box; text-align:left; background:transparent; border:0; border-top:1px solid var(--line); padding:1rem 0.2rem; min-height:44px; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="background:rgba(23,24,26,0.04);">
            <strong style="flex:0 0 10.5rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.3rem; color:var(--ink);">{{ t.facets.founder.title }}</strong>
            <em style="flex:1 1 16rem; font-family:'Spectral', Georgia, serif; font-style:italic; font-weight:400; font-size:0.97rem; color:var(--ink2);">{{ t.facets.founder.tagline }}</em>
            <span id="ico-founder" style="margin-left:auto; display:inline-flex; align-items:center; justify-content:center; width:1.5rem; height:1.5rem; border:1px solid var(--ink2); color:var(--ink2); font-size:1.05rem; line-height:1; flex:none; transition:transform 0.35s cubic-bezier(0.2,0.7,0.2,1), color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);">+</span>
          </button>
          <div id="brief-founder" style="display:grid; grid-template-rows:0fr; transition:grid-template-rows 0.5s cubic-bezier(0.2,0.7,0.2,1);">
            <div style="overflow:hidden; min-height:0;">
              <div style="padding:0.2rem 0.2rem 1.4rem; max-width:62ch;">
                <p style="margin:0 0 0.7rem; font-size:1.03rem; line-height:1.64; color:#34332E;" v-html="t.facets.founder.paragraphHtml"></p>
                <div v-for="row in t.facets.founder.rows" :key="row.label" style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">{{ row.label }}</span><span style="flex:1 1 14rem; font-size:0.98rem; color:#34332E;">{{ row.value }}</span></div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section id="record" data-screen-label="Track record" :data-chyron="t.record.chyron" style="background:var(--graphite); color:var(--ivory); padding:clamp(4.5rem, 10vw, 7rem) 0 clamp(2.8rem, 6vw, 4.2rem);">
      <div style="max-width:76rem; margin:0 auto; padding-left:clamp(1.25rem, 5vw, 4rem); padding-right:clamp(1.25rem, 5vw, 4rem);">
        <h2 style="margin:0 0 clamp(1.8rem, 4vw, 2.8rem); display:flex; align-items:center; gap:1.1rem;">
          <span style="display:inline-flex; align-items:center; background:var(--ivory); border-left:3px solid var(--accent); color:var(--graphite); padding:0.5rem 0.85rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;">{{ t.record.eyebrow }}</span>
          <span aria-hidden="true" data-rule="" style="flex:1; border-top:1px solid color-mix(in oklab, var(--graphite) 78%, #ECE7DC);"></span>
          <em style="font-family:'Spectral', Georgia, serif; font-weight:400; font-style:italic; font-size:0.9rem; color:#948E81;">{{ t.record.aside }}</em>
        </h2>

        <p style="margin:0 0 clamp(1.8rem, 4vw, 2.6rem); font-family:'Spectral', Georgia, serif; font-style:italic; font-weight:500; font-size:clamp(1.4rem, 2.7vw, 2.1rem); line-height:1.3; color:var(--ivory); max-width:28ch;">{{ t.record.pullQuote }}<span style="color:var(--accent);">.</span></p>
        <div id="map-wrap" style="position:relative; display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 23rem), 1fr)); gap:clamp(1.8rem, 4.5vw, 3.5rem); align-items:center;">
          <div id="network" style="min-width:0;">
            <p style="margin:0 0 0.8rem; display:flex; align-items:center; gap:0.55rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#948E81;"><span aria-hidden="true" style="width:6px; height:6px; border-radius:50%; background:var(--accent); animation:pm-blink 2.6s ease-in-out infinite;"></span>{{ t.record.live }}</p>
            <!-- Circular operating map: PM hub at centre → inner ring of 4
                 categories → outer ring of 7 leaves. Edge id = line-/flow-<childKey>;
                 selection lights the whole path back to the hub (_applySel). -->
            <svg viewBox="0 0 560 480" role="group" :aria-label="t.record.networkAria" style="width:100%; height:auto; display:block; max-height:76svh;">
              <line id="line-investment" x1="280" y1="240" x2="280" y2="140" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="line-startup" x1="280" y1="240" x2="380" y2="240" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="line-advisory" x1="280" y1="240" x2="280" y2="340" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="line-lecture" x1="280" y1="240" x2="180" y2="240" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="line-suricate" x1="280" y1="140" x2="185" y2="76" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="line-ibex" x1="280" y1="140" x2="375" y2="76" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="line-bloctopus" x1="380" y1="240" x2="445" y2="145" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="line-blocksquare" x1="380" y1="240" x2="445" y2="335" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="line-lemur" x1="280" y1="340" x2="280" y2="430" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="line-thinktank" x1="180" y1="240" x2="116" y2="335" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="line-faculty" x1="180" y1="240" x2="116" y2="145" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="flow-investment" x1="280" y1="240" x2="280" y2="140" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <line id="flow-startup" x1="280" y1="240" x2="380" y2="240" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <line id="flow-advisory" x1="280" y1="240" x2="280" y2="340" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <line id="flow-lecture" x1="280" y1="240" x2="180" y2="240" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <line id="flow-suricate" x1="280" y1="140" x2="185" y2="76" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <line id="flow-ibex" x1="280" y1="140" x2="375" y2="76" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <line id="flow-bloctopus" x1="380" y1="240" x2="445" y2="145" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <line id="flow-blocksquare" x1="380" y1="240" x2="445" y2="335" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <line id="flow-lemur" x1="280" y1="340" x2="280" y2="430" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <line id="flow-thinktank" x1="180" y1="240" x2="116" y2="335" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <line id="flow-faculty" x1="180" y1="240" x2="116" y2="145" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <g id="fx-layer" aria-hidden="true" style="pointer-events:none;"></g>

              <g id="node-pm" data-net="pm" role="button" tabindex="0" :aria-label="t.record.ents.pm.aria" data-on-click="selectNet" data-on-keydown="netKey" style="cursor:pointer;">
                <circle cx="280" cy="240" r="32" fill="var(--accent)"></circle>
                <circle cx="280" cy="240" r="40" fill="none" stroke="rgba(236,231,220,0.3)" stroke-width="1" style="animation:pm-pulse 3.4s ease-in-out infinite; transform-box:fill-box; transform-origin:center;"></circle>
                <text x="280" y="246" text-anchor="middle" class="pm-net-hub" style="letter-spacing:0.08em; fill:#F4F1EA;">PM</text>
              </g>

              <g id="node-investment" role="img" :aria-label="t.record.ents.investment.aria" style="pointer-events:none;">
                <g style="animation:pm-float 5.2s ease-in-out 0.3s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="280" cy="140" r="10" fill="#3A3D43"></circle>
                  <text x="280" y="118" text-anchor="middle" class="pm-net-lbl pm-net-cat" style="fill:#B4AEA1;">{{ t.record.ents.investment.nodeLabel }}</text>
                </g>
              </g>
              <g id="node-startup" role="img" :aria-label="t.record.ents.startup.aria" style="pointer-events:none;">
                <g style="animation:pm-float 5.8s ease-in-out 0.9s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="380" cy="240" r="10" fill="#3A3D43"></circle>
                  <text x="380" y="218" text-anchor="middle" class="pm-net-lbl pm-net-cat" style="fill:#B4AEA1;">{{ t.record.ents.startup.nodeLabel }}</text>
                </g>
              </g>
              <g id="node-advisory" role="img" :aria-label="t.record.ents.advisory.aria" style="pointer-events:none;">
                <g style="animation:pm-float 4.9s ease-in-out 0.5s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="280" cy="340" r="10" fill="#3A3D43"></circle>
                  <text x="280" y="318" text-anchor="middle" class="pm-net-lbl pm-net-cat" style="fill:#B4AEA1;">{{ t.record.ents.advisory.nodeLabel }}</text>
                </g>
              </g>
              <g id="node-lecture" role="img" :aria-label="t.record.ents.lecture.aria" style="pointer-events:none;">
                <g style="animation:pm-float 6.2s ease-in-out 0s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="180" cy="240" r="10" fill="#3A3D43"></circle>
                  <text x="180" y="218" text-anchor="middle" class="pm-net-lbl pm-net-cat" style="fill:#B4AEA1;">{{ t.record.ents.lecture.nodeLabel }}</text>
                </g>
              </g>

              <g id="node-suricate" data-net="suricate" role="button" tabindex="0" :aria-label="t.record.ents.suricate.aria" data-on-click="selectNet" data-on-keydown="netKey" style="cursor:pointer;">
                <g style="animation:pm-float 6.1s ease-in-out 0.7s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="185" cy="76" r="12" fill="#3A3D43" stroke="#948E81" stroke-width="1.5"></circle>
                  <text x="185" y="56" text-anchor="middle" class="pm-net-lbl" style="fill:#B4AEA1;">{{ t.record.ents.suricate.nodeLabel }}</text>
                </g>
              </g>
              <g id="node-ibex" data-net="ibex" role="button" tabindex="0" :aria-label="t.record.ents.ibex.aria" data-on-click="selectNet" data-on-keydown="netKey" style="cursor:pointer;">
                <g style="animation:pm-float 5.5s ease-in-out 1.2s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="375" cy="76" r="12" fill="#3A3D43" stroke="#948E81" stroke-width="1.5"></circle>
                  <text x="375" y="56" text-anchor="middle" class="pm-net-lbl" style="fill:#B4AEA1;">{{ t.record.ents.ibex.nodeLabel }}</text>
                </g>
              </g>
              <g id="node-bloctopus" data-net="bloctopus" role="button" tabindex="0" :aria-label="t.record.ents.bloctopus.aria" data-on-click="selectNet" data-on-keydown="netKey" style="cursor:pointer;">
                <g style="animation:pm-float 5.9s ease-in-out 0.4s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="445" cy="145" r="12" fill="#3A3D43" stroke="#948E81" stroke-width="1.5"></circle>
                  <text x="445" y="125" text-anchor="middle" class="pm-net-lbl" style="fill:#B4AEA1;">{{ t.record.ents.bloctopus.nodeLabel }}</text>
                </g>
              </g>
              <g id="node-blocksquare" data-net="blocksquare" role="button" tabindex="0" :aria-label="t.record.ents.blocksquare.aria" data-on-click="selectNet" data-on-keydown="netKey" style="cursor:pointer;">
                <g style="animation:pm-float 4.8s ease-in-out 1.1s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="445" cy="335" r="12" fill="#3A3D43" stroke="#948E81" stroke-width="1.5"></circle>
                  <text x="445" y="315" text-anchor="middle" class="pm-net-lbl" style="fill:#B4AEA1;">{{ t.record.ents.blocksquare.nodeLabel }}</text>
                </g>
              </g>
              <g id="node-lemur" data-net="lemur" role="button" tabindex="0" :aria-label="t.record.ents.lemur.aria" data-on-click="selectNet" data-on-keydown="netKey" style="cursor:pointer;">
                <g style="animation:pm-float 5.4s ease-in-out 0.2s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="280" cy="430" r="12" fill="#3A3D43" stroke="#948E81" stroke-width="1.5"></circle>
                  <text x="280" y="410" text-anchor="middle" class="pm-net-lbl" style="fill:#B4AEA1;">{{ t.record.ents.lemur.nodeLabel }}</text>
                </g>
              </g>
              <g id="node-thinktank" data-net="thinktank" role="button" tabindex="0" :aria-label="t.record.ents.thinktank.aria" data-on-click="selectNet" data-on-keydown="netKey" style="cursor:pointer;">
                <g style="animation:pm-float 6.4s ease-in-out 0s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="116" cy="335" r="12" fill="#3A3D43" stroke="#948E81" stroke-width="1.5"></circle>
                  <text x="116" y="315" text-anchor="middle" class="pm-net-lbl" style="fill:#B4AEA1;">{{ t.record.ents.thinktank.nodeLabel }}</text>
                </g>
              </g>
              <g id="node-faculty" data-net="faculty" role="button" tabindex="0" :aria-label="t.record.ents.faculty.aria" data-on-click="selectNet" data-on-keydown="netKey" style="cursor:pointer;">
                <g style="animation:pm-float 5.6s ease-in-out 1.4s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="116" cy="145" r="12" fill="#3A3D43" stroke="#948E81" stroke-width="1.5"></circle>
                  <text x="116" y="125" text-anchor="middle" class="pm-net-lbl" style="fill:#B4AEA1;">{{ t.record.ents.faculty.nodeLabel }}</text>
                </g>
              </g>
            </svg>
          </div>
          <div id="net-panel" aria-live="polite" style="position:relative; min-width:0; min-height:15rem; padding:1.35rem 0 0;">
            <span aria-hidden="true" style="position:absolute; top:0; left:0; right:0; border-top:1px solid rgba(236,231,220,0.18);"></span>
            <span id="net-rule-fill" aria-hidden="true" style="position:absolute; top:-1px; left:0; width:9rem; border-top:2px solid var(--accent); transform-origin:left;"></span>
            <div id="net-panel-inner">
              <span style="display:inline-block; border:1px solid rgba(236,231,220,0.3); color:#B4AEA1; padding:0.28rem 0.6rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.62rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;" data-bind="selTag">{{ t.record.ents.lemur.tag }}</span>
              <h3 style="margin:0.85rem 0 0.25rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.5rem; line-height:1.2; min-height:1.2em;"><a id="net-name" data-on-click="nameClick" data-bind="selName" href="https://lemur.legal" target="_blank" rel="noopener" style="color:var(--ivory); text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:0.16em; text-decoration-color:rgba(236,231,220,0.45); transition:text-decoration-color 0.16s cubic-bezier(0.4,0,0.2,1), text-shadow 0.2s cubic-bezier(0.4,0,0.2,1);" data-hover="text-decoration-color:var(--accent); text-shadow:0 0 18px color-mix(in oklab, var(--accent) 55%, transparent);">{{ t.record.ents.lemur.name }}</a></h3>
              <p style="margin:0; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.7rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--accent);" data-bind="selRole">{{ t.record.ents.lemur.role }}</p>
              <p style="margin:0.9rem 0 0; font-size:0.99rem; line-height:1.62; color:var(--ivory2);" data-bind="selDesc">{{ t.record.ents.lemur.desc }}</p>
              <div data-if="hasLink" style="display:contents">
                <p style="margin:1.05rem 0 0;"><a data-bind-href="selHref" href="https://lemur.legal" target="_blank" rel="noopener" style="display:inline-flex; align-items:center; gap:0.45em; min-height:44px; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.78rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--ivory); text-decoration-color:rgba(236,231,220,0.4); transition:text-decoration-color 0.16s cubic-bezier(0.4,0,0.2,1);" data-hover="text-decoration-color:var(--accent);">{{ t.record.visit }}<svg aria-hidden="true" viewBox="0 0 12 12" width="0.85em" height="0.85em" fill="none" style="flex:none;"><path d="M3.6 8.4L8.4 3.6M8.4 3.6H5M8.4 3.6V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></a></p>
              </div>
            </div>
            <div style="margin-top:1.6rem; display:flex; align-items:center; gap:0.8rem; flex-wrap:wrap;">
              <button type="button" data-on-click="netPrev" :aria-label="t.record.prevAria" style="width:44px; height:44px; display:inline-flex; align-items:center; justify-content:center; background:transparent; border:1px solid rgba(236,231,220,0.3); color:var(--ivory); font-size:1.15rem; line-height:1; cursor:pointer; transition:border-color 0.18s cubic-bezier(0.4,0,0.2,1), background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="border-color:var(--ivory); background:rgba(236,231,220,0.08);">‹</button>
              <button type="button" data-on-click="netNext" :aria-label="t.record.nextAria" style="width:44px; height:44px; display:inline-flex; align-items:center; justify-content:center; background:transparent; border:1px solid rgba(236,231,220,0.3); color:var(--ivory); font-size:1.15rem; line-height:1; cursor:pointer; transition:border-color 0.18s cubic-bezier(0.4,0,0.2,1), background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="border-color:var(--ivory); background:rgba(236,231,220,0.08);">›</button>
              <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.78rem; font-weight:600; color:var(--ivory); font-variant-numeric:tabular-nums;" data-bind="netIdx">06 / 08</span>
              <em style="font-family:'Spectral', Georgia, serif; font-style:italic; font-size:0.85rem; color:#948E81;">{{ t.record.orTap }}</em>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="media" data-screen-label="Media &amp; press" :data-chyron="t.media.chyron" style="background:var(--graphite); color:var(--ivory); padding:clamp(2.2rem, 5vw, 3.2rem) 0 clamp(4.5rem, 10vw, 7rem);">
      <div style="max-width:76rem; margin:0 auto; padding-left:clamp(1.25rem, 5vw, 4rem); padding-right:clamp(1.25rem, 5vw, 4rem);">
        <h2 style="margin:0 0 clamp(1.6rem, 3.5vw, 2.4rem); display:flex; align-items:center; gap:1.1rem;">
          <span style="display:inline-flex; align-items:center; background:var(--ivory); border-left:3px solid var(--accent); color:var(--graphite); padding:0.5rem 0.85rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;">{{ t.media.eyebrow }}</span>
          <span aria-hidden="true" data-rule="" style="flex:1; border-top:1px solid color-mix(in oklab, var(--graphite) 78%, #ECE7DC);"></span>
          <span style="display:inline-flex; gap:0.5rem;">
            <button type="button" data-on-click="mediaPrev" :aria-label="t.media.prevAria" style="width:44px; height:44px; display:inline-flex; align-items:center; justify-content:center; background:transparent; border:1px solid rgba(236,231,220,0.3); color:var(--ivory); font-size:1.15rem; line-height:1; cursor:pointer; transition:border-color 0.18s cubic-bezier(0.4,0,0.2,1), background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="border-color:var(--ivory); background:rgba(236,231,220,0.08);">‹</button>
            <button type="button" data-on-click="mediaNext" :aria-label="t.media.nextAria" style="width:44px; height:44px; display:inline-flex; align-items:center; justify-content:center; background:transparent; border:1px solid rgba(236,231,220,0.3); color:var(--ivory); font-size:1.15rem; line-height:1; cursor:pointer; transition:border-color 0.18s cubic-bezier(0.4,0,0.2,1), background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="border-color:var(--ivory); background:rgba(236,231,220,0.08);">›</button>
          </span>
        </h2>
        <div id="media-strip" style="display:flex; gap:1.4rem; overflow-x:auto; overflow-y:hidden; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch; padding-bottom:0.9rem;">
          <a v-for="(card, ci) in t.media.cards" :key="ci" :data-reveal="ci" :href="card.href" :target="card.external ? '_blank' : undefined" :rel="card.external ? 'noopener' : undefined" :title="card.titleAttr" style="display:flex; flex-direction:column; flex:0 0 min(84%, 22rem); scroll-snap-align:start; min-width:0; background:color-mix(in oklab, var(--graphite) 88%, #FFFFFF); border:1px solid rgba(236,231,220,0.12); border-left:3px solid transparent; text-decoration:none; color:inherit; transition:transform 0.25s cubic-bezier(0.2,0.7,0.2,1), border-color 0.25s cubic-bezier(0.2,0.7,0.2,1), background 0.25s cubic-bezier(0.2,0.7,0.2,1);" data-hover="transform:translateY(-5px); border-left-color:var(--accent); background:color-mix(in oklab, var(--graphite) 82%, #FFFFFF);">
            <div style="aspect-ratio:16/10; overflow:hidden; background:color-mix(in oklab, var(--graphite) 72%, #000000);">
              <div :id="'media-slot-' + (ci + 1)" style="width:100%; height:100%; display:block;"></div>
            </div>
            <div style="padding:1.1rem 1.2rem 1.25rem; display:flex; flex-direction:column; gap:0.55rem; flex:1;">
              <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.64rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:#948E81;">{{ card.kicker }}</span>
              <span style="font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.22rem; line-height:1.3; color:var(--ivory);">{{ card.title }}</span>
              <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.88rem; line-height:1.5; color:var(--ivory2);">{{ card.desc }}</span>
              <span style="margin-top:auto; padding-top:0.5rem; display:inline-flex; align-items:center; gap:0.4rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:#948E81;">{{ t.media.cta }} <svg aria-hidden="true" viewBox="0 0 12 12" width="0.85em" height="0.85em" fill="none" style="flex:none;"><path d="M3.6 8.4L8.4 3.6M8.4 3.6H5M8.4 3.6V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
            </div>
          </a>
        </div>
        <p style="margin:1.2rem 0 0; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; color:#948E81;">{{ t.media.note }}</p>
        <div style="margin-top:clamp(2.2rem, 5vw, 3.2rem); display:flex; flex-direction:column; gap:1.1rem;">
          <div v-for="(x, xi) in t.media.extras" :key="x.label" :data-reveal="3 + xi" style="display:flex; flex-wrap:wrap; align-items:baseline; gap:0.4rem 2rem;">
            <span style="flex:0 0 6.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:#948E81;">{{ x.label }}</span>
            <span style="font-family:'Spectral', Georgia, serif; font-size:1.18rem; color:var(--ivory);">{{ x.name }} <em style="font-style:italic; font-weight:400; font-size:0.85em; color:var(--ivory2);">{{ x.detail }}</em></span>
          </div>
        </div>
      </div>
    </section>

    <section id="timeline" data-screen-label="Timeline" :data-chyron="t.timeline.chyron" style="background:var(--paper); padding:clamp(4.5rem, 10vw, 7.5rem) 0 0;">
      <div style="max-width:76rem; margin:0 auto; padding-left:clamp(1.25rem, 5vw, 4rem); padding-right:clamp(1.25rem, 5vw, 4rem);">
        <h2 style="margin:0 0 clamp(2.2rem, 5vw, 3.4rem); display:flex; align-items:center; gap:1.1rem;">
          <span style="display:inline-flex; align-items:center; background:var(--graphite); border-left:3px solid var(--accent); color:#D6D1C5; padding:0.5rem 0.85rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;">{{ t.timeline.eyebrow }}</span>
          <span aria-hidden="true" data-rule="" style="flex:1; border-top:1px solid var(--line);"></span>
          <em style="font-family:'Spectral', Georgia, serif; font-weight:400; font-style:italic; font-size:0.9rem; color:var(--ink2);">{{ t.timeline.aside }}</em>
        </h2>
        <div class="pm-desktop-only">
          <div id="tl-h" style="position:relative;">
            <span aria-hidden="true" style="position:absolute; top:6px; left:0; right:0; height:2px; background:var(--line);"></span>
            <span data-tl-line="" aria-hidden="true" style="position:absolute; top:6px; left:0; right:0; height:2px; background:var(--accent); transform:scaleX(0); transform-origin:left;"></span>
            <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:1.2rem;">
              <div v-for="(e, ei) in t.timeline.entries" :key="e.year" :id="'tl-' + ei" data-tl-item="" style="position:relative; padding-top:2.1rem;">
                <span data-tl-dot="" aria-hidden="true" style="position:absolute; top:0; left:0; width:14px; height:14px; box-sizing:border-box; border-radius:50%; border:3px solid var(--accent); background:var(--paper);"></span>
                <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; color:var(--accent); font-variant-numeric:tabular-nums;">{{ e.year }}</span>
                <strong style="display:block; margin-top:0.35rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.02rem; line-height:1.3; color:var(--ink);">{{ e.title }}</strong>
                <span style="display:block; margin-top:0.3rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; line-height:1.5; color:var(--ink2);">{{ e.caption }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pm-mobile-only">
          <div id="tl-v" style="position:relative; padding-left:2.1rem;">
            <span aria-hidden="true" style="position:absolute; top:4px; bottom:4px; left:6px; width:2px; background:var(--line);"></span>
            <span data-tl-line="" aria-hidden="true" style="position:absolute; top:4px; bottom:4px; left:6px; width:2px; background:var(--accent); transform:scaleY(0); transform-origin:top;"></span>
            <div style="display:flex; flex-direction:column; gap:1.5rem;">
              <div v-for="e in t.timeline.entries" :key="e.year" data-tl-item="" style="position:relative;">
                <span data-tl-dot="" aria-hidden="true" style="position:absolute; top:0.1rem; left:-2.1rem; width:14px; height:14px; box-sizing:border-box; border-radius:50%; border:3px solid var(--accent); background:var(--paper);"></span>
                <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; color:var(--accent); font-variant-numeric:tabular-nums;">{{ e.year }}</span>
                <strong style="display:block; margin-top:0.25rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.05rem; line-height:1.3; color:var(--ink);">{{ e.title }}</strong>
                <span style="display:block; margin-top:0.2rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.82rem; line-height:1.5; color:var(--ink2);">{{ e.caption }}</span>
              </div>
            </div>
          </div>
        </div>
        <p style="margin:1.4rem 0 0; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; color:var(--ink2);">{{ t.timeline.note }}</p>
      </div>
    </section>

    <section id="writing" data-screen-label="Writing" :data-chyron="t.writing.chyron" style="background:var(--paper); padding:clamp(4.5rem, 10vw, 7.5rem) 0;">
      <div style="max-width:76rem; margin:0 auto; padding-left:clamp(1.25rem, 5vw, 4rem); padding-right:clamp(1.25rem, 5vw, 4rem);">
        <h2 style="margin:0 0 clamp(1.8rem, 4vw, 2.8rem); display:flex; align-items:center; gap:1.1rem;">
          <span style="display:inline-flex; align-items:center; background:var(--graphite); border-left:3px solid var(--accent); color:#D6D1C5; padding:0.5rem 0.85rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;">{{ t.writing.eyebrow }}</span>
          <span aria-hidden="true" data-rule="" style="flex:1; border-top:1px solid var(--line);"></span>
        </h2>
        <div style="border-bottom:1px solid var(--line);">
          <a v-for="(s, si) in t.writing.segments" :key="s.seg" :data-reveal="si" href="https://lemur.legal/blog" target="_blank" rel="noopener" style="display:flex; flex-wrap:wrap; align-items:baseline; gap:0.4rem 1.5rem; padding:1.35rem 0; border-top:1px solid var(--line); text-decoration:none; color:inherit; transition:transform 0.18s cubic-bezier(0.2,0.7,0.2,1), border-top-color 0.18s cubic-bezier(0.2,0.7,0.2,1);" data-hover="transform:translateX(6px); border-top-color:var(--accent);">
            <span style="flex:0 0 4.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--accent); font-variant-numeric:tabular-nums;">{{ s.seg }}</span>
            <span style="flex:1 1 20rem; font-family:'Spectral', Georgia, serif; font-weight:500; font-size:clamp(1.25rem, 2.2vw, 1.6rem); line-height:1.3;">{{ s.title }}</span>
            <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">{{ t.writing.linkLabel }}<svg aria-hidden="true" viewBox="0 0 12 12" width="0.85em" height="0.85em" fill="none" style="display:inline-block; vertical-align:-0.08em; margin-left:0.3em;"><path d="M3.6 8.4L8.4 3.6M8.4 3.6H5M8.4 3.6V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
          </a>
        </div>
        <p style="margin:1.1rem 0 0; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; color:var(--ink2);">{{ t.writing.note }}</p>
      </div>
    </section>

    <section id="contact" data-screen-label="Contact" :data-chyron="t.contact.chyron" style="background:var(--graphite); color:var(--ivory); position:relative; overflow:hidden; padding:clamp(4.5rem, 10vw, 7rem) 0 clamp(4rem, 8vw, 6rem);">
      <div style="max-width:76rem; margin:0 auto; padding-left:clamp(1.25rem, 5vw, 4rem); padding-right:clamp(1.25rem, 5vw, 4rem);">
        <h2 style="margin:0 0 clamp(1.8rem, 4vw, 2.8rem); display:flex; align-items:center; gap:1.1rem;">
          <span style="display:inline-flex; align-items:center; background:var(--ivory); border-left:3px solid var(--accent); color:var(--graphite); padding:0.5rem 0.85rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;">{{ t.contact.eyebrow }}</span>
          <span aria-hidden="true" data-rule="" style="flex:1; border-top:1px solid color-mix(in oklab, var(--graphite) 78%, #ECE7DC);"></span>
        </h2>
        <p data-reveal="0" style="margin:0; font-family:'Spectral', Georgia, serif; font-weight:500; font-size:clamp(1.5rem, 3vw, 2.2rem); line-height:1.25; max-width:26ch; color:var(--ivory);">{{ t.contact.headline }}<span style="color:var(--accent);">.</span></p>
        <p data-reveal="1" style="margin:1.1rem 0 0; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.92rem; line-height:1.6; color:var(--ivory2); max-width:54ch;">{{ t.contact.intro }}</p>
        <form id="contact-form" data-reveal="2" data-on-submit="onSubmit" data-on-focus="airOn" data-on-blur="airOff" style="margin-top:clamp(2rem, 4.5vw, 3rem); max-width:56rem;">
          <div style="display:flex; flex-wrap:wrap; gap:0.4rem 1.3rem; align-items:baseline; margin-bottom:1.4rem;">
            <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.64rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:#948E81;">{{ t.contact.regarding }}</span>
            <button v-for="(topic, ti) in t.contact.topics" :key="topic.key" :id="'chip-' + ti" type="button" :data-topic="topic.key" aria-pressed="false" data-on-click="pickTopic" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; font-weight:500; letter-spacing:0.04em; background:transparent; color:var(--ivory2); border:0; border-bottom:1px dashed rgba(236,231,220,0.35); border-radius:0; padding:0.5rem 0.15rem; min-height:40px; cursor:pointer; transition:color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="color:var(--ivory); border-bottom-color:var(--ivory);">{{ topic.label }}</button>
          </div>
          <div style="background:color-mix(in oklab, var(--graphite) 91%, #FFFFFF); border:1px solid rgba(236,231,220,0.14); border-top:3px solid var(--accent); box-shadow:0 16px 40px rgba(15,16,18,0.25);">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; padding:0.85rem 1.25rem; border-bottom:1px solid rgba(236,231,220,0.12);">
              <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.64rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#D6D1C5;">{{ t.contact.newMessage }}</span>
              <span style="display:inline-flex; align-items:center; gap:0.5rem;">
                <div data-if="onAir" style="display:none">
                  <span aria-hidden="true" style="width:8px; height:8px; border-radius:50%; background:var(--accent); animation:pm-blink 1.5s ease-in-out infinite;"></span>
                  <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.64rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:var(--ivory);">{{ t.contact.onAir }}</span>
                </div>
                <div data-if="offAir" style="display:contents">
                  <span aria-hidden="true" style="width:8px; height:8px; border-radius:50%; background:#948E81;"></span>
                  <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.64rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#948E81;">{{ t.contact.standby }}</span>
                </div>
              </span>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:0.3rem 1.2rem; align-items:baseline; padding:0.8rem 1.25rem; border-bottom:1px solid rgba(236,231,220,0.12);">
              <span style="flex:0 0 5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.62rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#948E81;">{{ t.contact.toLabel }}</span>
              <span style="flex:1 1 16rem; font-family:'Spectral', Georgia, serif; font-size:1.02rem; color:var(--ivory);">{{ t.contact.toName }} <span style="color:var(--ivory2);">&lt;<span style="border-bottom:1px dashed #6B665C;">peter@lemur.legal</span>&gt;</span> <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; color:#948E81;">{{ t.contact.toConfirm }}</span></span>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:0.3rem 1.2rem; align-items:baseline; padding:0.8rem 1.25rem; border-bottom:1px solid rgba(236,231,220,0.12);">
              <span style="flex:0 0 5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.62rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#948E81;">{{ t.contact.subjectLabel }}</span>
              <span id="mail-subject" style="flex:1 1 16rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.02rem; color:var(--ivory);" data-bind="mailSubject">Website inquiry — General</span>
            </div>
            <div style="padding:0.9rem 1.25rem 1.1rem;">
              <label for="cf-message" style="display:block; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.62rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#948E81;">{{ t.contact.messageLabel }}</label>
              <textarea id="cf-message" name="message" rows="5" :placeholder="t.contact.msgHint" data-bind-placeholder="msgHint" style="display:block; width:100%; box-sizing:border-box; margin-top:0.5rem; background:transparent; border:0; border-radius:0; padding:0.2rem 0; font-family:'Spectral', Georgia, serif; font-size:1.1rem; line-height:1.75; color:var(--ivory); resize:vertical;"></textarea>
            </div>
          </div>
          <input type="checkbox" name="botcheck" tabindex="-1" aria-hidden="true" style="display:none;">
          <div style="margin-top:1.6rem; display:flex; align-items:center; gap:1.3rem; flex-wrap:wrap;">
            <button id="contact-send" type="submit" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.88rem; font-weight:600; letter-spacing:0.06em; background:var(--accent); color:#F7F4EC; border:0; border-radius:0; padding:0.95rem 1.8rem; min-height:44px; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1), transform 0.18s cubic-bezier(0.2,0.7,0.2,1);" data-hover="background:color-mix(in oklab, var(--accent) 86%, #000000); transform:translateY(-1px);">{{ t.contact.send }}<svg aria-hidden="true" viewBox="0 0 12 12" width="0.85em" height="0.85em" fill="none" style="display:inline-block; vertical-align:-0.08em; margin-left:0.45em;"><path d="M3.6 8.4L8.4 3.6M8.4 3.6H5M8.4 3.6V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
            <div data-if="sentNote" style="display:none">
              <p role="status" style="margin:0; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.82rem; color:var(--ivory); animation:pm-slide 0.4s cubic-bezier(0.2,0.7,0.2,1) both;">{{ t.contact.sentNote }}</p>
            </div>
          </div>
        </form>
      </div>
    </section>
  </main>
<div data-if="barOn" style="display:none">
    <div role="navigation" :aria-label="t.bar.aria" style="position:fixed; left:0; right:0; bottom:0; z-index:70; height:46px; display:flex; align-items:stretch; background:var(--graphite); border-top:1px solid rgba(236,231,220,0.14); box-shadow:0 -8px 26px rgba(15,16,18,0.22); animation:chyron-rise 0.4s cubic-bezier(0.2,0.7,0.2,1) both; padding-left:env(safe-area-inset-left); padding-right:env(safe-area-inset-right);">
      <div style="flex:0 0 clamp(10rem, 26vw, 16rem); box-sizing:border-box; display:flex; align-items:center; gap:0.65rem; padding:0 1rem; border-right:1px solid rgba(236,231,220,0.12); min-width:0; overflow:hidden;">
        <span id="bar-dot" aria-hidden="true" style="width:0.45rem; height:0.45rem; border-radius:50%; background:var(--accent); flex:none;"></span>
        <span style="display:flex; align-items:center; overflow:hidden; min-width:0;"><span id="bar-label" style="display:block; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.78rem; line-height:1.1; color:var(--ivory); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" data-bind="barLabel">{{ t.bar.fallbackLabel }}</span></span>
      </div>
      <div style="flex:1; position:relative; min-width:3rem;">
        <span aria-hidden="true" style="position:absolute; left:0; right:0; top:50%; height:3px; margin-top:-1.5px; border-radius:2px; background:rgba(236,231,220,0.14);"></span>
        <span id="bar-fill" aria-hidden="true" style="position:absolute; left:0; right:0; top:50%; height:3px; margin-top:-1.5px; border-radius:2px; background:var(--accent); transform:scaleX(0); transform-origin:left;"></span>
        <span id="bar-knob" aria-hidden="true" style="position:absolute; top:50%; left:0; width:9px; height:9px; margin:-4.5px 0 0 -4.5px; border-radius:50%; background:var(--accent); box-shadow:0 0 0 3px color-mix(in oklab, var(--accent) 28%, transparent), 0 0 9px 1px color-mix(in oklab, var(--accent) 55%, transparent);"></span>
        <button v-for="(j, ji) in t.bar.jumps" :key="j.target" type="button" :data-target="j.target" data-on-click="jump" :title="j.title" :aria-label="j.aria" :style="'position:absolute; top:0; bottom:0; left:' + ji * 20 + '%; width:20%; box-sizing:border-box; background:transparent; border:0;' + (ji > 0 ? ' border-left:1px solid rgba(236,231,220,0.2);' : '') + ' padding:0; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);'" data-hover="background:rgba(236,231,220,0.07);"></button>
      </div>
      <div style="flex:0 0 6.6rem; box-sizing:border-box; display:flex; align-items:center; justify-content:flex-end; gap:0.45rem; padding:0 1rem; border-left:1px solid rgba(236,231,220,0.12);">
        <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.6rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#948E81;">{{ t.bar.partLabel }}</span>
        <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.78rem; font-weight:600; color:var(--ivory); font-variant-numeric:tabular-nums;" data-bind="barPart">01 / 05</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { initEffects } from './Home.effects'
import { useRootVars } from '@/composables/useTheme'
import { runLanguageRetype } from '@/composables/retype'
import { usePageContent } from '@/i18n/useContent'
import { useHead } from '@/i18n/useHead'
import { consumeLangSwitch } from '@/i18n/locale'
import home from '@/content/home'

// All copy comes from the locale-keyed content module. The router remounts
// this view on '/' ↔ '/sl' (router-view :key), so t.value is stable for the
// lifetime of a mount and initEffects re-runs with the new language's copy.
const t = usePageContent(home)
useHead(home)

// This page's design tokens (baked from the original #pm-root inline vars).
// Applied at runtime so pages with different palettes never clobber each other.
const ROOT_VARS: Record<string, string> = {
  "--paper": "#ECE9E2",
  "--ink": "#17181A",
  "--ink2": "#5C594F",
  "--accent": "#D2453E",
  "--graphite": "#26282C",
  "--ivory": "#ECE7DC",
  "--ivory2": "#B4AEA1",
  "--line": "#D5D0C3",
}

let dispose: (() => void) | undefined
onMounted(() => {
  useRootVars(ROOT_VARS)
  dispose = initEffects(t.value)
  if (consumeLangSwitch()) {
    // In-app language switch: kill the one-shot entrance animations for this
    // mount — #main's rise (its translateY exposes a paper-colored gap under
    // the masthead) and the hero's own staggered entrances — and let the
    // retype sweep carry the transition instead. Runs pre-paint (onMounted),
    // so neither the gap nor untyped text ever hits the screen.
    for (const id of ['main', 'mline-1', 'mline-2', 'mline-3', 'hero-img', 'hero-img-m']) {
      const el = document.getElementById(id)
      if (el) el.style.animation = 'none'
    }
    const badge = document.querySelector<HTMLElement>('#hero h1 + p')
    if (badge) badge.style.animation = 'none'
    if (!window.location.hash) runLanguageRetype()
  }
})
onUnmounted(() => dispose && dispose())
</script>

<style scoped>
#contact input::placeholder, #contact textarea::placeholder { color: rgba(180,174,161,0.5); }

#network g[data-net] { outline: none; }

#network g[data-net]:focus-visible circle { stroke: #D2453E; stroke-width: 2.5px; }

#media-strip { scrollbar-width: thin; scrollbar-color: rgba(148,142,129,0.55) transparent; }

/* Operating-map node labels. font-size is in SVG user units, so it scales down
   with the whole svg; on mobile (narrow column) that got too small, so bump it
   there. JS still sets each label's `fill` inline on selection. */
.pm-net-lbl { font-family: 'Instrument Sans', Arial, sans-serif; font-size: 13px; }
.pm-net-cat { font-weight: 600; }
.pm-net-hub { font-family: 'Instrument Sans', Arial, sans-serif; font-size: 16px; font-weight: 600; }
@media (max-width: 819px) {
  .pm-net-lbl { font-size: 20px; }
  .pm-net-hub { font-size: 23px; }
  /* Enlarge & emphasize the operating map on mobile: break the graph out of the
     text column to full viewport width and drop the height cap. The viewBox is
     also tightened at runtime (_fitMap) to crop the surrounding whitespace. */
  #network {
    margin-left: calc(-1 * clamp(1.25rem, 5vw, 4rem));
    margin-right: calc(-1 * clamp(1.25rem, 5vw, 4rem));
    padding-left: 0.7rem;
    padding-right: 0.7rem;
    box-sizing: border-box;
  }
  #network svg[viewBox] { max-height: none; }
}

/* Mobile (stacked hero): halve the flat-grey band between the intro badge and
   the portrait — the text cell's bottom padding. !important beats the inline
   padding clamp on the cell. Desktop (side-by-side) is unaffected. */
@media (max-width: 819px) {
  #hero > div:first-child { padding-bottom: 1.25rem !important; }
}
</style>
