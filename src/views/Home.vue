<template>
<main id="main">

    <section id="hero" data-screen-label="Hero" data-chyron="__hide" style="position:relative; background:#6E6E6E; color:#F4F1EA; min-height:min(92svh, 62rem); display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 30rem), 1fr)); overflow:hidden;">
      <div style="container-type:inline-size; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; gap:clamp(1.7rem, 4vh, 2.8rem); padding:clamp(3.5rem, 9vh, 7rem) clamp(1rem, 3vw, 3rem) clamp(3rem, 7vh, 5rem) clamp(1.25rem, 5vw, 5rem);">
        <h1 style="margin:0; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:min(3.3rem, 7.4cqw); line-height:1.1; letter-spacing:-0.015em; color:#FAF8F2;">
          <span id="mline-1" style="display:block; font-weight:300; font-style:italic; color:#E2DED2; margin-bottom:0.5em; will-change:transform; animation:pm-rise 0.7s cubic-bezier(0.2,0.7,0.2,1) 0.05s backwards;">The law moves slowly.</span>
          <span id="mline-2" style="display:block; font-weight:600; will-change:transform; animation:pm-rise 0.7s cubic-bezier(0.2,0.7,0.2,1) 0.24s backwards;">The people I back don’t.</span>
          <span id="mline-3" style="display:block; font-weight:600; color:#C8C3B6; margin-top:0.42em; transition:color 0.5s cubic-bezier(0.4,0,0.2,1); animation:pm-rise 0.7s cubic-bezier(0.2,0.7,0.2,1) 0.44s backwards;">I close the gap<span id="mline-period" style="display:inline-block; color:var(--accent);">.</span></span>
        </h1>
        <p style="margin:0; display:inline-flex; align-items:center; gap:0.9rem; flex-wrap:wrap; background:var(--graphite); border-left:3px solid var(--accent); padding:0.72rem 1.15rem; animation:pm-slide 0.6s cubic-bezier(0.2,0.7,0.2,1) 0.75s backwards;">
          <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.62rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#C9C4B8;">Peter Merc</span>
          <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; color:var(--ivory2);">Ph.D. in law · founder · investor — Ljubljana</span>
        </p>
      </div>
      <div style="position:relative; min-height:min(64svh, 42rem); overflow:hidden;">
        <div class="pm-desktop-only">
          <img id="hero-img" src="/assets/b56f58c1.jpg" alt="Peter Merc — black-and-white studio portrait" loading="eager" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:50% 0%; filter:grayscale(1) contrast(1.02); transform-origin:50% 0%; animation:pm-settle 2.4s cubic-bezier(0.22,0.61,0.36,1) backwards;">
          <div aria-hidden="true" style="position:absolute; inset:0; background:#6E6E6E; mask-image:linear-gradient(to right, black 0%, transparent 12%); -webkit-mask-image:linear-gradient(to right, black 0%, transparent 12%); pointer-events:none;"></div>
        </div>
        <div class="pm-mobile-only">
          <img id="hero-img-m" src="/assets/8e09394b.jpg" alt="Peter Merc — black-and-white studio portrait" loading="eager" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:50% 0%; filter:grayscale(1) contrast(1.02); transform-origin:50% 0%; animation:pm-settle 2.4s cubic-bezier(0.22,0.61,0.36,1) backwards;">
          <div aria-hidden="true" style="position:absolute; inset:0; background:#6E6E6E; mask-image:linear-gradient(to bottom, black 0%, rgba(0,0,0,0.58) 3.5%, rgba(0,0,0,0.3) 6.5%, rgba(0,0,0,0.1) 9%, transparent 11.5%); -webkit-mask-image:linear-gradient(to bottom, black 0%, rgba(0,0,0,0.58) 3.5%, rgba(0,0,0,0.3) 6.5%, rgba(0,0,0,0.1) 9%, transparent 11.5%); pointer-events:none;"></div>
        </div>
      </div>
    </section>

    <button id="docket" type="button" data-on-click="advanceDocket" aria-label="Show next practice area" style="display:flex; flex-wrap:wrap; align-items:center; gap:0.5rem 1.1rem; width:100%; box-sizing:border-box; background:var(--graphite); border:0; padding:0.7rem clamp(1.25rem, 4vw, 3rem); cursor:pointer; text-align:left; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="background:color-mix(in oklab, var(--graphite) 93%, #FFFFFF);">
      <span style="flex:none; display:inline-flex; align-items:center; background:var(--ivory); border-left:3px solid var(--accent); color:var(--graphite); padding:0.38rem 0.7rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.62rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;">On the docket</span>
      <span style="flex:1 1 14rem; min-width:0; overflow:hidden;"><span id="docket-item" style="display:block; font-family:'Spectral', Georgia, serif; font-style:italic; font-size:1.05rem; line-height:1.4; color:var(--ivory);" data-bind="docketText">MiCA white papers &amp; CASP licensing</span></span>
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
          <span style="display:inline-flex; align-items:center; background:var(--graphite); border-left:3px solid var(--accent); color:#D6D1C5; padding:0.5rem 0.85rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;">What I do</span>
          <span aria-hidden="true" data-rule="" style="flex:1; border-top:1px solid var(--line);"></span>
          <em style="font-family:'Spectral', Georgia, serif; font-weight:400; font-style:italic; font-size:0.9rem; color:var(--ink2);">open a line to read the brief</em>
        </h2>

        <article id="counsel" data-chyron="Counsel — crypto &amp; fintech law" data-reveal="0" style="margin:0;">
          <button id="btn-counsel" type="button" data-on-click="toggleCounsel" aria-expanded="false" aria-controls="brief-counsel" style="display:flex; flex-wrap:wrap; align-items:center; gap:0.3rem 1.4rem; width:100%; box-sizing:border-box; text-align:left; background:transparent; border:0; border-top:1px solid var(--line); padding:1rem 0.2rem; min-height:44px; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="background:rgba(23,24,26,0.04);">
            <strong style="flex:0 0 10.5rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.3rem; color:var(--ink);">Counsel</strong>
            <em style="flex:1 1 16rem; font-family:'Spectral', Georgia, serif; font-style:italic; font-weight:400; font-size:0.97rem; color:var(--ink2);">crypto &amp; fintech law — MiCA, licensing, listing opinions</em>
            <span id="ico-counsel" style="margin-left:auto; display:inline-flex; align-items:center; justify-content:center; width:1.5rem; height:1.5rem; border:1px solid var(--ink2); color:var(--ink2); font-size:1.05rem; line-height:1; flex:none; transition:transform 0.35s cubic-bezier(0.2,0.7,0.2,1), color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);">+</span>
          </button>
          <div id="brief-counsel" style="display:grid; grid-template-rows:0fr; transition:grid-template-rows 0.5s cubic-bezier(0.2,0.7,0.2,1);">
            <div style="overflow:hidden; min-height:0;">
              <div style="padding:0.2rem 0.2rem 1.4rem; max-width:62ch;">
                <p style="margin:0 0 0.7rem; font-size:1.03rem; line-height:1.64; color:#34332E;">MiCA white papers and licensing, token classification, the legal opinions that get assets listed. Years in bank supervision and capital markets before any of this had a rulebook — now I help write the filings my clients live by.</p>
                <div style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">White papers</span><span style="flex:1 1 16rem; font-size:0.98rem; color:#34332E;">MiCA-compliant drafting and notification</span></div>
                <div style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">Licensing</span><span style="flex:1 1 16rem; font-size:0.98rem; color:#34332E;">CASP authorisation across the EU</span></div>
                <div style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">Opinions</span><span style="flex:1 1 16rem; font-size:0.98rem; color:#34332E;">Token classification for exchange listings</span></div>
                <div style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">Background</span><span style="flex:1 1 16rem; font-size:0.98rem; color:#34332E;">Central-bank supervision and capital markets</span></div>
              </div>
            </div>
          </div>
        </article>

        <article id="investor" data-chyron="Investor — Suricate Ventures" data-reveal="1" style="margin:0;">
          <button id="btn-investor" type="button" data-on-click="toggleInvestor" aria-expanded="false" aria-controls="brief-investor" style="display:flex; flex-wrap:wrap; align-items:center; gap:0.3rem 1.4rem; width:100%; box-sizing:border-box; text-align:left; background:transparent; border:0; border-top:1px solid var(--line); padding:1rem 0.2rem; min-height:44px; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="background:rgba(23,24,26,0.04);">
            <strong style="flex:0 0 10.5rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.3rem; color:var(--ink);">Investor</strong>
            <em style="flex:1 1 16rem; font-family:'Spectral', Georgia, serif; font-style:italic; font-weight:400; font-size:0.97rem; color:var(--ink2);">early-stage venture — co-founder &amp; managing partner, Suricate</em>
            <span id="ico-investor" style="margin-left:auto; display:inline-flex; align-items:center; justify-content:center; width:1.5rem; height:1.5rem; border:1px solid var(--ink2); color:var(--ink2); font-size:1.05rem; line-height:1; flex:none; transition:transform 0.35s cubic-bezier(0.2,0.7,0.2,1), color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);">+</span>
          </button>
          <div id="brief-investor" style="display:grid; grid-template-rows:0fr; transition:grid-template-rows 0.5s cubic-bezier(0.2,0.7,0.2,1);">
            <div style="overflow:hidden; min-height:0;">
              <div style="padding:0.2rem 0.2rem 1.4rem; max-width:62ch;">
                <p style="margin:0 0 0.7rem; font-size:1.03rem; line-height:1.64; color:#34332E;">Co-founder and managing partner of an early-stage fund backing fintech, gaming, health and logistics teams. I invest in the kind of founders I advise, which keeps the advice honest.</p>
                <div style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">Fund</span><span style="flex:1 1 12rem; font-size:0.98rem; color:#34332E;">Suricate Ventures, early-stage</span></div>
                <div style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">Sectors</span><span style="flex:1 1 12rem; font-size:0.98rem; color:#34332E;">Fintech, gaming, health, logistics</span></div>
                <div style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">Stage</span><span style="flex:1 1 12rem; font-size:0.98rem; color:#34332E;">Pre-seed and seed</span></div>
                <div style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">Edge</span><span style="flex:1 1 12rem; font-size:0.98rem; color:#34332E;">Legal depth on regulated markets</span></div>
              </div>
            </div>
          </div>
        </article>

        <article id="voice" data-chyron="Voice — media &amp; stages" data-reveal="2" style="margin:0;">
          <button id="btn-voice" type="button" data-on-click="toggleVoice" aria-expanded="false" aria-controls="brief-voice" style="display:flex; flex-wrap:wrap; align-items:center; gap:0.3rem 1.4rem; width:100%; box-sizing:border-box; text-align:left; background:transparent; border:0; border-top:1px solid var(--line); padding:1rem 0.2rem; min-height:44px; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="background:rgba(23,24,26,0.04);">
            <strong style="flex:0 0 10.5rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.3rem; color:var(--ink);">Voice</strong>
            <em style="flex:1 1 16rem; font-family:'Spectral', Georgia, serif; font-style:italic; font-weight:400; font-size:0.97rem; color:var(--ink2);">media &amp; stages — the one who gets called when rules shift</em>
            <span id="ico-voice" style="margin-left:auto; display:inline-flex; align-items:center; justify-content:center; width:1.5rem; height:1.5rem; border:1px solid var(--ink2); color:var(--ink2); font-size:1.05rem; line-height:1; flex:none; transition:transform 0.35s cubic-bezier(0.2,0.7,0.2,1), color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);">+</span>
          </button>
          <div id="brief-voice" style="display:grid; grid-template-rows:0fr; transition:grid-template-rows 0.5s cubic-bezier(0.2,0.7,0.2,1);">
            <div style="overflow:hidden; min-height:0;">
              <div style="padding:0.4rem 0.2rem 1.4rem; max-width:62ch;">
                <p id="voice-quote" style="margin:0 0 0.9rem; font-family:'Spectral', Georgia, serif; font-style:italic; font-weight:500; font-size:clamp(1.3rem, 2.2vw, 1.7rem); line-height:1.35; color:var(--ink); max-width:26ch;"><span style="display:inline-block; overflow:hidden; padding-bottom:0.12em; margin-bottom:-0.12em;"><span data-qw="" style="display:inline-block;">When</span></span> <span style="display:inline-block; overflow:hidden; padding-bottom:0.12em; margin-bottom:-0.12em;"><span data-qw="" style="display:inline-block;">the</span></span> <span style="display:inline-block; overflow:hidden; padding-bottom:0.12em; margin-bottom:-0.12em;"><span data-qw="" style="display:inline-block;">regulation</span></span> <span style="display:inline-block; overflow:hidden; padding-bottom:0.12em; margin-bottom:-0.12em;"><span data-qw="" style="display:inline-block;">shifts,</span></span> <span style="display:inline-block; overflow:hidden; padding-bottom:0.12em; margin-bottom:-0.12em;"><span data-qw="" style="display:inline-block;">I’m</span></span> <span style="display:inline-block; overflow:hidden; padding-bottom:0.12em; margin-bottom:-0.12em;"><span data-qw="" style="display:inline-block;">who</span></span> <span style="display:inline-block; overflow:hidden; padding-bottom:0.12em; margin-bottom:-0.12em;"><span data-qw="" style="display:inline-block;">gets</span></span> <span style="display:inline-block; overflow:hidden; padding-bottom:0.12em; margin-bottom:-0.12em;"><span data-qw="" style="display:inline-block;">called</span></span> <span style="display:inline-block; overflow:hidden; padding-bottom:0.12em; margin-bottom:-0.12em;"><span data-qw="" style="display:inline-block;">to</span></span> <span style="display:inline-block; overflow:hidden; padding-bottom:0.12em; margin-bottom:-0.12em;"><span data-qw="" style="display:inline-block;">explain</span></span> <span style="display:inline-block; overflow:hidden; padding-bottom:0.12em; margin-bottom:-0.12em;"><span data-qw="" style="display:inline-block;">it<span id="voice-period" style="display:inline-block; color:var(--accent); font-style:normal;">.</span></span></span></p>
                <p style="margin:0 0 0.7rem; font-size:1.03rem; line-height:1.64; color:#34332E;">A regular translator of EU crypto rules for Slovenian and international press, and a panelist where the token questions actually get asked.</p>
                  <div style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">Formats</span><span style="flex:1 1 12rem; font-size:0.98rem; color:#34332E;">TV and print commentary, panels, keynotes</span></div>
                  <div style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">Topics</span><span style="flex:1 1 12rem; font-size:0.98rem; color:#34332E;">MiCA, crypto taxation, tokenization</span></div>
                  <div style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">Teaching</span><span style="flex:1 1 12rem; font-size:0.98rem; color:#34332E;">Assistant Professor, New University Ljubljana</span></div>
              </div>
            </div>
          </div>
        </article>

        <article id="founder" data-chyron="Founder — builder, not just adviser" data-reveal="3" style="margin:0; border-bottom:1px solid var(--line);">
          <button id="btn-founder" type="button" data-on-click="toggleFounder" aria-expanded="false" aria-controls="brief-founder" style="display:flex; flex-wrap:wrap; align-items:center; gap:0.3rem 1.4rem; width:100%; box-sizing:border-box; text-align:left; background:transparent; border:0; border-top:1px solid var(--line); padding:1rem 0.2rem; min-height:44px; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="background:rgba(23,24,26,0.04);">
            <strong style="flex:0 0 10.5rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.3rem; color:var(--ink);">Founder</strong>
            <em style="flex:1 1 16rem; font-family:'Spectral', Georgia, serif; font-style:italic; font-weight:400; font-size:0.97rem; color:var(--ink2);">built what I counsel — Lemur, Blocksquare, Bloctopus</em>
            <span id="ico-founder" style="margin-left:auto; display:inline-flex; align-items:center; justify-content:center; width:1.5rem; height:1.5rem; border:1px solid var(--ink2); color:var(--ink2); font-size:1.05rem; line-height:1; flex:none; transition:transform 0.35s cubic-bezier(0.2,0.7,0.2,1), color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);">+</span>
          </button>
          <div id="brief-founder" style="display:grid; grid-template-rows:0fr; transition:grid-template-rows 0.5s cubic-bezier(0.2,0.7,0.2,1);">
            <div style="overflow:hidden; min-height:0;">
              <div style="padding:0.2rem 0.2rem 1.4rem; max-width:62ch;">
                <p style="margin:0 0 0.7rem; font-size:1.03rem; line-height:1.64; color:#34332E;">I’ve built what I counsel: <a href="https://lemur.legal" target="_blank" rel="noopener">Lemur Legal</a>, <strong style="font-weight:600;">Suricate Ventures</strong>, and co-founded <strong style="font-weight:600;">Blocksquare</strong> (real-world-asset tokenization) and <strong style="font-weight:600;">Bloctopus Intelligence</strong>. Board member, Blockchain Think Tank Slovenia.</p>
                <div style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">Lemur Legal</span><span style="flex:1 1 14rem; font-size:0.98rem; color:#34332E;">Specialist tech-law office, Ljubljana</span></div>
                <div style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">Blocksquare</span><span style="flex:1 1 14rem; font-size:0.98rem; color:#34332E;">Real-world-asset tokenization infrastructure</span></div>
                <div style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">Bloctopus</span><span style="flex:1 1 14rem; font-size:0.98rem; color:#34332E;">Blockchain intelligence and crypto recovery</span></div>
                <div style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">Fintech Factory</span><span style="flex:1 1 14rem; font-size:0.98rem; color:#34332E;">Fintech consultancy</span></div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section id="record" data-screen-label="Track record" data-chyron="Track record" style="background:var(--graphite); color:var(--ivory); padding:clamp(4.5rem, 10vw, 7rem) 0 clamp(2.8rem, 6vw, 4.2rem);">
      <div style="max-width:76rem; margin:0 auto; padding-left:clamp(1.25rem, 5vw, 4rem); padding-right:clamp(1.25rem, 5vw, 4rem);">
        <h2 style="margin:0 0 clamp(1.8rem, 4vw, 2.8rem); display:flex; align-items:center; gap:1.1rem;">
          <span style="display:inline-flex; align-items:center; background:var(--ivory); border-left:3px solid var(--accent); color:var(--graphite); padding:0.5rem 0.85rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;">The operating map</span>
          <span aria-hidden="true" data-rule="" style="flex:1; border-top:1px solid color-mix(in oklab, var(--graphite) 78%, #ECE7DC);"></span>
          <em style="font-family:'Spectral', Georgia, serif; font-weight:400; font-style:italic; font-size:0.9rem; color:#948E81;">all verifiable</em>
        </h2>

        <p style="margin:0 0 clamp(1.8rem, 4vw, 2.6rem); font-family:'Spectral', Georgia, serif; font-style:italic; font-weight:500; font-size:clamp(1.4rem, 2.7vw, 2.1rem); line-height:1.3; color:var(--ivory); max-width:28ch;">Seven hats, one desk — everything routes through Ljubljana<span style="color:var(--accent);">.</span></p>
        <div id="map-wrap" style="position:relative; display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 23rem), 1fr)); gap:clamp(1.8rem, 4.5vw, 3.5rem); align-items:center;">
          <svg id="thread-svg" aria-hidden="true" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:2; overflow:visible;">
            <path id="thread-path" d="" fill="none" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round"></path>
            <circle id="thread-dot" r="4" fill="var(--accent)" opacity="0"></circle>
          </svg>
          <div id="network" style="min-width:0;">
            <p style="margin:0 0 0.8rem; display:flex; align-items:center; gap:0.55rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#948E81;"><span aria-hidden="true" style="width:6px; height:6px; border-radius:50%; background:var(--accent); animation:pm-blink 2.6s ease-in-out infinite;"></span>Live — tap a node to open its dossier</p>
            <svg viewBox="0 0 560 480" role="group" aria-label="Peter Merc's company network" style="width:100%; height:auto; display:block; max-height:76svh;">
              <line id="line-faculty" x1="280" y1="240" x2="280" y2="58" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="line-lemur" x1="280" y1="240" x2="122" y2="112" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="line-suricate" x1="280" y1="240" x2="446" y2="106" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="line-blocksquare" x1="280" y1="240" x2="502" y2="260" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="line-bloctopus" x1="280" y1="240" x2="412" y2="392" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="line-fintech" x1="280" y1="240" x2="152" y2="396" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="line-thinktank" x1="280" y1="240" x2="84" y2="262" stroke="rgba(236,231,220,0.25)" stroke-width="1"></line>
              <line id="flow-faculty" x1="280" y1="240" x2="280" y2="58" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <line id="flow-lemur" x1="280" y1="240" x2="122" y2="112" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <line id="flow-suricate" x1="280" y1="240" x2="446" y2="106" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <line id="flow-blocksquare" x1="280" y1="240" x2="502" y2="260" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <line id="flow-bloctopus" x1="280" y1="240" x2="412" y2="392" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <line id="flow-fintech" x1="280" y1="240" x2="152" y2="396" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <line id="flow-thinktank" x1="280" y1="240" x2="84" y2="262" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 10" style="opacity:0; transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1); animation:pm-dash 1.15s linear infinite; pointer-events:none;"></line>
              <g id="fx-layer" aria-hidden="true" style="pointer-events:none;"></g>

              <g id="node-pm" data-net="pm" role="button" tabindex="0" aria-label="Peter Merc — principal" data-on-click="selectNet" data-on-keydown="netKey" style="cursor:pointer;">
                <circle cx="280" cy="240" r="36" fill="var(--accent)"></circle>
                <circle cx="280" cy="240" r="44" fill="none" stroke="rgba(236,231,220,0.3)" stroke-width="1" style="animation:pm-pulse 3.4s ease-in-out infinite; transform-box:fill-box; transform-origin:center;"></circle>
                <text x="280" y="246" text-anchor="middle" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:18px; font-weight:600; letter-spacing:0.08em; fill:#F4F1EA;">PM</text>
              </g>

              <g id="node-lemur" data-net="lemur" role="button" tabindex="0" aria-label="Lemur Legal" data-on-click="selectNet" data-on-keydown="netKey" style="cursor:pointer;">
                <g style="animation:pm-float 5.4s ease-in-out 0.2s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="122" cy="112" r="9" fill="#3A3D43" stroke="#948E81" stroke-width="1.5"></circle>
                  <text x="122" y="90" text-anchor="middle" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:13px; fill:#B4AEA1;">Lemur Legal</text>
                </g>
              </g>
              <g id="node-suricate" data-net="suricate" role="button" tabindex="0" aria-label="Suricate Ventures" data-on-click="selectNet" data-on-keydown="netKey" style="cursor:pointer;">
                <g style="animation:pm-float 6.1s ease-in-out 0.7s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="446" cy="106" r="9" fill="#3A3D43" stroke="#948E81" stroke-width="1.5"></circle>
                  <text x="446" y="84" text-anchor="middle" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:13px; fill:#B4AEA1;">Suricate Ventures</text>
                </g>
              </g>
              <g id="node-blocksquare" data-net="blocksquare" role="button" tabindex="0" aria-label="Blocksquare" data-on-click="selectNet" data-on-keydown="netKey" style="cursor:pointer;">
                <g style="animation:pm-float 4.8s ease-in-out 1.1s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="502" cy="260" r="9" fill="#3A3D43" stroke="#948E81" stroke-width="1.5"></circle>
                  <text x="502" y="288" text-anchor="middle" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:13px; fill:#B4AEA1;">Blocksquare</text>
                </g>
              </g>
              <g id="node-bloctopus" data-net="bloctopus" role="button" tabindex="0" aria-label="Bloctopus Intelligence" data-on-click="selectNet" data-on-keydown="netKey" style="cursor:pointer;">
                <g style="animation:pm-float 5.9s ease-in-out 0.4s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="412" cy="392" r="9" fill="#3A3D43" stroke="#948E81" stroke-width="1.5"></circle>
                  <text x="412" y="420" text-anchor="middle" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:13px; fill:#B4AEA1;">Bloctopus</text>
                </g>
              </g>
              <g id="node-fintech" data-net="fintech" role="button" tabindex="0" aria-label="Fintech Factory" data-on-click="selectNet" data-on-keydown="netKey" style="cursor:pointer;">
                <g style="animation:pm-float 5.1s ease-in-out 0.9s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="152" cy="396" r="9" fill="#3A3D43" stroke="#948E81" stroke-width="1.5"></circle>
                  <text x="152" y="424" text-anchor="middle" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:13px; fill:#B4AEA1;">Fintech Factory</text>
                </g>
              </g>
              <g id="node-thinktank" data-net="thinktank" role="button" tabindex="0" aria-label="Blockchain Think Tank Slovenia" data-on-click="selectNet" data-on-keydown="netKey" style="cursor:pointer;">
                <g style="animation:pm-float 6.4s ease-in-out 0s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="84" cy="262" r="9" fill="#3A3D43" stroke="#948E81" stroke-width="1.5"></circle>
                  <text x="84" y="290" text-anchor="middle" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:13px; fill:#B4AEA1;">Think Tank</text>
                </g>
              </g>
              <g id="node-faculty" data-net="faculty" role="button" tabindex="0" aria-label="Law Faculty, New University Ljubljana" data-on-click="selectNet" data-on-keydown="netKey" style="cursor:pointer;">
                <g style="animation:pm-float 5.6s ease-in-out 1.4s infinite alternate; transform-box:fill-box; transform-origin:center;">
                  <circle cx="280" cy="58" r="9" fill="#3A3D43" stroke="#948E81" stroke-width="1.5"></circle>
                  <text x="280" y="36" text-anchor="middle" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:13px; fill:#B4AEA1;">Law Faculty</text>
                </g>
              </g>
            </svg>
          </div>
          <div id="net-panel" aria-live="polite" style="position:relative; min-width:0; min-height:15rem; padding:1.35rem 0 0;">
            <span aria-hidden="true" style="position:absolute; top:0; left:0; right:0; border-top:1px solid rgba(236,231,220,0.18);"></span>
            <span id="net-rule-fill" aria-hidden="true" style="position:absolute; top:-1px; left:0; width:9rem; border-top:2px solid var(--accent); transform-origin:left;"></span>
            <div id="net-panel-inner">
              <span style="display:inline-block; border:1px solid rgba(236,231,220,0.3); color:#B4AEA1; padding:0.28rem 0.6rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.62rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;" data-bind="selTag">Founded</span>
              <h3 id="net-name" style="margin:0.85rem 0 0.25rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.5rem; line-height:1.2; min-height:1.2em; color:var(--ivory);" data-bind="selName">Lemur Legal</h3>
              <p style="margin:0; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.7rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--accent);" data-bind="selRole">Founder &amp; Managing Partner</p>
              <p style="margin:0.9rem 0 0; font-size:0.99rem; line-height:1.62; color:var(--ivory2);" data-bind="selDesc">Specialist tech-law office: MiCA white papers, CASP licensing and the token opinions that get assets listed.</p>
              <div data-if="hasLink" style="display:contents">
                <p style="margin:1rem 0 0;"><a href="https://lemur.legal" data-bind-href="selHref" target="_blank" rel="noopener" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.78rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--ivory); text-decoration-color:rgba(236,231,220,0.4);">Visit ↗</a></p>
              </div>
            </div>
            <div style="margin-top:1.6rem; display:flex; align-items:center; gap:0.8rem; flex-wrap:wrap;">
              <button type="button" data-on-click="netPrev" aria-label="Previous — cycle the map" style="width:44px; height:44px; display:inline-flex; align-items:center; justify-content:center; background:transparent; border:1px solid rgba(236,231,220,0.3); color:var(--ivory); font-size:1.15rem; line-height:1; cursor:pointer; transition:border-color 0.18s cubic-bezier(0.4,0,0.2,1), background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="border-color:var(--ivory); background:rgba(236,231,220,0.08);">‹</button>
              <button type="button" data-on-click="netNext" aria-label="Next — cycle the map" style="width:44px; height:44px; display:inline-flex; align-items:center; justify-content:center; background:transparent; border:1px solid rgba(236,231,220,0.3); color:var(--ivory); font-size:1.15rem; line-height:1; cursor:pointer; transition:border-color 0.18s cubic-bezier(0.4,0,0.2,1), background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="border-color:var(--ivory); background:rgba(236,231,220,0.08);">›</button>
              <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.78rem; font-weight:600; color:var(--ivory); font-variant-numeric:tabular-nums;" data-bind="netIdx">02 / 08</span>
              <em style="font-family:'Spectral', Georgia, serif; font-style:italic; font-size:0.85rem; color:#948E81;">— or tap any node</em>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="media" data-screen-label="Media &amp; press" data-chyron="Media &amp; press" style="background:var(--graphite); color:var(--ivory); padding:clamp(2.2rem, 5vw, 3.2rem) 0 clamp(4.5rem, 10vw, 7rem);">
      <div style="max-width:76rem; margin:0 auto; padding-left:clamp(1.25rem, 5vw, 4rem); padding-right:clamp(1.25rem, 5vw, 4rem);">
        <h2 style="margin:0 0 clamp(1.6rem, 3.5vw, 2.4rem); display:flex; align-items:center; gap:1.1rem;">
          <span style="display:inline-flex; align-items:center; background:var(--ivory); border-left:3px solid var(--accent); color:var(--graphite); padding:0.5rem 0.85rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;">On record — media</span>
          <span aria-hidden="true" data-rule="" style="flex:1; border-top:1px solid color-mix(in oklab, var(--graphite) 78%, #ECE7DC);"></span>
          <span style="display:inline-flex; gap:0.5rem;">
            <button type="button" data-on-click="mediaPrev" aria-label="Scroll coverage back" style="width:44px; height:44px; display:inline-flex; align-items:center; justify-content:center; background:transparent; border:1px solid rgba(236,231,220,0.3); color:var(--ivory); font-size:1.15rem; line-height:1; cursor:pointer; transition:border-color 0.18s cubic-bezier(0.4,0,0.2,1), background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="border-color:var(--ivory); background:rgba(236,231,220,0.08);">‹</button>
            <button type="button" data-on-click="mediaNext" aria-label="Scroll coverage forward" style="width:44px; height:44px; display:inline-flex; align-items:center; justify-content:center; background:transparent; border:1px solid rgba(236,231,220,0.3); color:var(--ivory); font-size:1.15rem; line-height:1; cursor:pointer; transition:border-color 0.18s cubic-bezier(0.4,0,0.2,1), background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="border-color:var(--ivory); background:rgba(236,231,220,0.08);">›</button>
          </span>
        </h2>
        <div id="media-strip" style="display:flex; gap:1.4rem; overflow-x:auto; overflow-y:hidden; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch; padding-bottom:0.9rem;">
          <a data-reveal="0" href="https://www.youtube.com/watch?v=ci0cpjHI-F8" target="_blank" rel="noopener" style="display:flex; flex-direction:column; flex:0 0 min(84%, 22rem); scroll-snap-align:start; min-width:0; background:color-mix(in oklab, var(--graphite) 88%, #FFFFFF); border:1px solid rgba(236,231,220,0.12); border-left:3px solid transparent; text-decoration:none; color:inherit; transition:transform 0.25s cubic-bezier(0.2,0.7,0.2,1), border-color 0.25s cubic-bezier(0.2,0.7,0.2,1), background 0.25s cubic-bezier(0.2,0.7,0.2,1);" data-hover="transform:translateY(-5px); border-left-color:var(--accent); background:color-mix(in oklab, var(--graphite) 82%, #FFFFFF);">
            <div style="aspect-ratio:16/10; overflow:hidden; background:color-mix(in oklab, var(--graphite) 72%, #000000);">
              <div id="media-slot-1" style="width:100%; height:100%; display:block;"></div>
            </div>
            <div style="padding:1.1rem 1.2rem 1.25rem; display:flex; flex-direction:column; gap:0.55rem; flex:1;">
              <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.64rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:#948E81;">Interview — AmCham Slovenija</span>
              <span style="font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.22rem; line-height:1.3; color:var(--ivory);">Think Forward — the interview</span>
              <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.88rem; line-height:1.5; color:var(--ivory2);">On camera for AmCham’s Think Forward series — tech law and building Lemur Legal.</span>
              <span style="margin-top:auto; padding-top:0.5rem; display:inline-flex; align-items:center; gap:0.4rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:#948E81;">Open coverage <span aria-hidden="true">↗</span></span>
            </div>
          </a>
          <a data-reveal="1" href="https://podjetnik.media.si/blockchain-bitcoin-revolucija-kaj-je/" target="_blank" rel="noopener" style="display:flex; flex-direction:column; flex:0 0 min(84%, 22rem); scroll-snap-align:start; min-width:0; background:color-mix(in oklab, var(--graphite) 88%, #FFFFFF); border:1px solid rgba(236,231,220,0.12); border-left:3px solid transparent; text-decoration:none; color:inherit; transition:transform 0.25s cubic-bezier(0.2,0.7,0.2,1), border-color 0.25s cubic-bezier(0.2,0.7,0.2,1), background 0.25s cubic-bezier(0.2,0.7,0.2,1);" data-hover="transform:translateY(-5px); border-left-color:var(--accent); background:color-mix(in oklab, var(--graphite) 82%, #FFFFFF);">
            <div style="aspect-ratio:16/10; overflow:hidden; background:color-mix(in oklab, var(--graphite) 72%, #000000);">
              <div id="media-slot-2" style="width:100%; height:100%; display:block;"></div>
            </div>
            <div style="padding:1.1rem 1.2rem 1.25rem; display:flex; flex-direction:column; gap:0.55rem; flex:1;">
              <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.64rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:#948E81;">Column — Podjetnik.si</span>
              <span style="font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.22rem; line-height:1.3; color:var(--ivory);">Blockchain revolucija — kaj je in kaj prinaša?</span>
              <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.88rem; line-height:1.5; color:var(--ivory2);">Why blockchain is more than Bitcoin — and what it changes first.</span>
              <span style="margin-top:auto; padding-top:0.5rem; display:inline-flex; align-items:center; gap:0.4rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:#948E81;">Open coverage <span aria-hidden="true">↗</span></span>
            </div>
          </a>
          <a data-reveal="2" href="#media" title="Bloomberg Adria link to confirm ⚠" style="display:flex; flex-direction:column; flex:0 0 min(84%, 22rem); scroll-snap-align:start; min-width:0; background:color-mix(in oklab, var(--graphite) 88%, #FFFFFF); border:1px solid rgba(236,231,220,0.12); border-left:3px solid transparent; text-decoration:none; color:inherit; transition:transform 0.25s cubic-bezier(0.2,0.7,0.2,1), border-color 0.25s cubic-bezier(0.2,0.7,0.2,1), background 0.25s cubic-bezier(0.2,0.7,0.2,1);" data-hover="transform:translateY(-5px); border-left-color:var(--accent); background:color-mix(in oklab, var(--graphite) 82%, #FFFFFF);">
            <div style="aspect-ratio:16/10; overflow:hidden; background:color-mix(in oklab, var(--graphite) 72%, #000000);">
              <div id="media-slot-3" style="width:100%; height:100%; display:block;"></div>
            </div>
            <div style="padding:1.1rem 1.2rem 1.25rem; display:flex; flex-direction:column; gap:0.55rem; flex:1;">
              <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.64rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:#948E81;">Series — Bloomberg Adria · link ⚠</span>
              <span style="font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.22rem; line-height:1.3; color:var(--ivory);">Kriptovalute: praktični koraki za upravljanje</span>
              <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.88rem; line-height:1.5; color:var(--ivory2);">Bloomberg Adria’s crypto-education series, made with industry experts — Peter among them.</span>
              <span style="margin-top:auto; padding-top:0.5rem; display:inline-flex; align-items:center; gap:0.4rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:#948E81;">Open coverage <span aria-hidden="true">↗</span></span>
            </div>
          </a>
        </div>
        <p style="margin:1.2rem 0 0; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; color:#948E81;">Drop a photo straight onto each card — it sticks. ⚠ Bloomberg Adria link still to confirm; send more mentions from lemur.legal/media and they drop in.</p>
        <div style="margin-top:clamp(2.2rem, 5vw, 3.2rem); display:flex; flex-direction:column; gap:1.1rem;">
          <div data-reveal="3" style="display:flex; flex-wrap:wrap; align-items:baseline; gap:0.4rem 2rem;">
            <span style="flex:0 0 6.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:#948E81;">Stage</span>
            <span style="font-family:'Spectral', Georgia, serif; font-size:1.18rem; color:var(--ivory);">Money Motion <em style="font-style:italic; font-weight:400; font-size:0.85em; color:var(--ivory2);">— fintech conference</em></span>
          </div>
          <div data-reveal="4" style="display:flex; flex-wrap:wrap; align-items:baseline; gap:0.4rem 2rem;">
            <span style="flex:0 0 6.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:#948E81;">Mentor</span>
            <span style="font-family:'Spectral', Georgia, serif; font-size:1.18rem; color:var(--ivory);">startup.si <em style="font-style:italic; font-weight:400; font-size:0.85em; color:var(--ivory2);">· Startup+ / SPS programs</em></span>
          </div>
        </div>
      </div>
    </section>

    <section id="timeline" data-screen-label="Timeline" data-chyron="The record, in order" style="background:var(--paper); padding:clamp(4.5rem, 10vw, 7.5rem) 0 0;">
      <div style="max-width:76rem; margin:0 auto; padding-left:clamp(1.25rem, 5vw, 4rem); padding-right:clamp(1.25rem, 5vw, 4rem);">
        <h2 style="margin:0 0 clamp(2.2rem, 5vw, 3.4rem); display:flex; align-items:center; gap:1.1rem;">
          <span style="display:inline-flex; align-items:center; background:var(--graphite); border-left:3px solid var(--accent); color:#D6D1C5; padding:0.5rem 0.85rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;">The record, in order</span>
          <span aria-hidden="true" data-rule="" style="flex:1; border-top:1px solid var(--line);"></span>
          <em style="font-family:'Spectral', Georgia, serif; font-weight:400; font-style:italic; font-size:0.9rem; color:var(--ink2);">seven moves, one direction</em>
        </h2>
        <div class="pm-desktop-only">
          <div id="tl-h" style="position:relative;">
            <span aria-hidden="true" style="position:absolute; top:6px; left:0; right:0; height:2px; background:var(--line);"></span>
            <span data-tl-line="" aria-hidden="true" style="position:absolute; top:6px; left:0; right:0; height:2px; background:var(--accent); transform:scaleX(0); transform-origin:left;"></span>
            <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:1.2rem;">
              <div id="tl-0" data-tl-item="" style="position:relative; padding-top:2.1rem;">
                <span data-tl-dot="" aria-hidden="true" style="position:absolute; top:0; left:0; width:14px; height:14px; box-sizing:border-box; border-radius:50%; border:3px solid var(--accent); background:var(--paper);"></span>
                <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; color:var(--accent); font-variant-numeric:tabular-nums;">2008</span>
                <strong style="display:block; margin-top:0.35rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.02rem; line-height:1.3; color:var(--ink);">Bank of Slovenia</strong>
                <span style="display:block; margin-top:0.3rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; line-height:1.5; color:var(--ink2);">Legal counsel — banking supervision</span>
              </div>
              <div id="tl-1" data-tl-item="" style="position:relative; padding-top:2.1rem;">
                <span data-tl-dot="" aria-hidden="true" style="position:absolute; top:0; left:0; width:14px; height:14px; box-sizing:border-box; border-radius:50%; border:3px solid var(--accent); background:var(--paper);"></span>
                <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; color:var(--accent); font-variant-numeric:tabular-nums;">2013</span>
                <strong style="display:block; margin-top:0.35rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.02rem; line-height:1.3; color:var(--ink);">Ph.D. in law</strong>
                <span style="display:block; margin-top:0.3rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; line-height:1.5; color:var(--ink2);">Doctorate — financial law</span>
              </div>
              <div id="tl-2" data-tl-item="" style="position:relative; padding-top:2.1rem;">
                <span data-tl-dot="" aria-hidden="true" style="position:absolute; top:0; left:0; width:14px; height:14px; box-sizing:border-box; border-radius:50%; border:3px solid var(--accent); background:var(--paper);"></span>
                <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; color:var(--accent); font-variant-numeric:tabular-nums;">2016</span>
                <strong style="display:block; margin-top:0.35rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.02rem; line-height:1.3; color:var(--ink);">Fintech Factory</strong>
                <span style="display:block; margin-top:0.3rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; line-height:1.5; color:var(--ink2);">Consultancy founded</span>
              </div>
              <div id="tl-3" data-tl-item="" style="position:relative; padding-top:2.1rem;">
                <span data-tl-dot="" aria-hidden="true" style="position:absolute; top:0; left:0; width:14px; height:14px; box-sizing:border-box; border-radius:50%; border:3px solid var(--accent); background:var(--paper);"></span>
                <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; color:var(--accent); font-variant-numeric:tabular-nums;">2017</span>
                <strong style="display:block; margin-top:0.35rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.02rem; line-height:1.3; color:var(--ink);">Lemur Legal</strong>
                <span style="display:block; margin-top:0.3rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; line-height:1.5; color:var(--ink2);">Tech-law office opens, Ljubljana</span>
              </div>
              <div id="tl-4" data-tl-item="" style="position:relative; padding-top:2.1rem;">
                <span data-tl-dot="" aria-hidden="true" style="position:absolute; top:0; left:0; width:14px; height:14px; box-sizing:border-box; border-radius:50%; border:3px solid var(--accent); background:var(--paper);"></span>
                <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; color:var(--accent); font-variant-numeric:tabular-nums;">2018</span>
                <strong style="display:block; margin-top:0.35rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.02rem; line-height:1.3; color:var(--ink);">Blocksquare</strong>
                <span style="display:block; margin-top:0.3rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; line-height:1.5; color:var(--ink2);">RWA tokenization, co-founded</span>
              </div>
              <div id="tl-5" data-tl-item="" style="position:relative; padding-top:2.1rem;">
                <span data-tl-dot="" aria-hidden="true" style="position:absolute; top:0; left:0; width:14px; height:14px; box-sizing:border-box; border-radius:50%; border:3px solid var(--accent); background:var(--paper);"></span>
                <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; color:var(--accent); font-variant-numeric:tabular-nums;">2021</span>
                <strong style="display:block; margin-top:0.35rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.02rem; line-height:1.3; color:var(--ink);">Suricate Ventures</strong>
                <span style="display:block; margin-top:0.3rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; line-height:1.5; color:var(--ink2);">Early-stage fund, co-founded</span>
              </div>
              <div id="tl-6" data-tl-item="" style="position:relative; padding-top:2.1rem;">
                <span data-tl-dot="" aria-hidden="true" style="position:absolute; top:0; left:0; width:14px; height:14px; box-sizing:border-box; border-radius:50%; border:3px solid var(--accent); background:var(--paper);"></span>
                <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; color:var(--accent); font-variant-numeric:tabular-nums;">2024</span>
                <strong style="display:block; margin-top:0.35rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.02rem; line-height:1.3; color:var(--ink);">The MiCA era</strong>
                <span style="display:block; margin-top:0.3rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; line-height:1.5; color:var(--ink2);">Licensing practice &amp; Bloctopus Intelligence</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pm-mobile-only">
          <div id="tl-v" style="position:relative; padding-left:2.1rem;">
            <span aria-hidden="true" style="position:absolute; top:4px; bottom:4px; left:6px; width:2px; background:var(--line);"></span>
            <span data-tl-line="" aria-hidden="true" style="position:absolute; top:4px; bottom:4px; left:6px; width:2px; background:var(--accent); transform:scaleY(0); transform-origin:top;"></span>
            <div style="display:flex; flex-direction:column; gap:1.5rem;">
              <div data-tl-item="" style="position:relative;">
                <span data-tl-dot="" aria-hidden="true" style="position:absolute; top:0.1rem; left:-2.1rem; width:14px; height:14px; box-sizing:border-box; border-radius:50%; border:3px solid var(--accent); background:var(--paper);"></span>
                <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; color:var(--accent); font-variant-numeric:tabular-nums;">2008</span>
                <strong style="display:block; margin-top:0.25rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.05rem; line-height:1.3; color:var(--ink);">Bank of Slovenia</strong>
                <span style="display:block; margin-top:0.2rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.82rem; line-height:1.5; color:var(--ink2);">Legal counsel — banking supervision</span>
              </div>
              <div data-tl-item="" style="position:relative;">
                <span data-tl-dot="" aria-hidden="true" style="position:absolute; top:0.1rem; left:-2.1rem; width:14px; height:14px; box-sizing:border-box; border-radius:50%; border:3px solid var(--accent); background:var(--paper);"></span>
                <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; color:var(--accent); font-variant-numeric:tabular-nums;">2013</span>
                <strong style="display:block; margin-top:0.25rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.05rem; line-height:1.3; color:var(--ink);">Ph.D. in law</strong>
                <span style="display:block; margin-top:0.2rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.82rem; line-height:1.5; color:var(--ink2);">Doctorate — financial law</span>
              </div>
              <div data-tl-item="" style="position:relative;">
                <span data-tl-dot="" aria-hidden="true" style="position:absolute; top:0.1rem; left:-2.1rem; width:14px; height:14px; box-sizing:border-box; border-radius:50%; border:3px solid var(--accent); background:var(--paper);"></span>
                <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; color:var(--accent); font-variant-numeric:tabular-nums;">2016</span>
                <strong style="display:block; margin-top:0.25rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.05rem; line-height:1.3; color:var(--ink);">Fintech Factory</strong>
                <span style="display:block; margin-top:0.2rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.82rem; line-height:1.5; color:var(--ink2);">Consultancy founded</span>
              </div>
              <div data-tl-item="" style="position:relative;">
                <span data-tl-dot="" aria-hidden="true" style="position:absolute; top:0.1rem; left:-2.1rem; width:14px; height:14px; box-sizing:border-box; border-radius:50%; border:3px solid var(--accent); background:var(--paper);"></span>
                <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; color:var(--accent); font-variant-numeric:tabular-nums;">2017</span>
                <strong style="display:block; margin-top:0.25rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.05rem; line-height:1.3; color:var(--ink);">Lemur Legal</strong>
                <span style="display:block; margin-top:0.2rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.82rem; line-height:1.5; color:var(--ink2);">Tech-law office opens, Ljubljana</span>
              </div>
              <div data-tl-item="" style="position:relative;">
                <span data-tl-dot="" aria-hidden="true" style="position:absolute; top:0.1rem; left:-2.1rem; width:14px; height:14px; box-sizing:border-box; border-radius:50%; border:3px solid var(--accent); background:var(--paper);"></span>
                <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; color:var(--accent); font-variant-numeric:tabular-nums;">2018</span>
                <strong style="display:block; margin-top:0.25rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.05rem; line-height:1.3; color:var(--ink);">Blocksquare</strong>
                <span style="display:block; margin-top:0.2rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.82rem; line-height:1.5; color:var(--ink2);">RWA tokenization, co-founded</span>
              </div>
              <div data-tl-item="" style="position:relative;">
                <span data-tl-dot="" aria-hidden="true" style="position:absolute; top:0.1rem; left:-2.1rem; width:14px; height:14px; box-sizing:border-box; border-radius:50%; border:3px solid var(--accent); background:var(--paper);"></span>
                <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; color:var(--accent); font-variant-numeric:tabular-nums;">2021</span>
                <strong style="display:block; margin-top:0.25rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.05rem; line-height:1.3; color:var(--ink);">Suricate Ventures</strong>
                <span style="display:block; margin-top:0.2rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.82rem; line-height:1.5; color:var(--ink2);">Early-stage fund, co-founded</span>
              </div>
              <div data-tl-item="" style="position:relative;">
                <span data-tl-dot="" aria-hidden="true" style="position:absolute; top:0.1rem; left:-2.1rem; width:14px; height:14px; box-sizing:border-box; border-radius:50%; border:3px solid var(--accent); background:var(--paper);"></span>
                <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; color:var(--accent); font-variant-numeric:tabular-nums;">2024</span>
                <strong style="display:block; margin-top:0.25rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.05rem; line-height:1.3; color:var(--ink);">The MiCA era</strong>
                <span style="display:block; margin-top:0.2rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.82rem; line-height:1.5; color:var(--ink2);">Licensing practice &amp; Bloctopus Intelligence</span>
              </div>
            </div>
          </div>
        </div>
        <p style="margin:1.4rem 0 0; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; color:var(--ink2);">⚠ Years indicative — send corrections and they drop straight in.</p>
      </div>
    </section>

    <section id="writing" data-screen-label="Writing" data-chyron="Writing" style="background:var(--paper); padding:clamp(4.5rem, 10vw, 7.5rem) 0;">
      <div style="max-width:76rem; margin:0 auto; padding-left:clamp(1.25rem, 5vw, 4rem); padding-right:clamp(1.25rem, 5vw, 4rem);">
        <h2 style="margin:0 0 clamp(1.8rem, 4vw, 2.8rem); display:flex; align-items:center; gap:1.1rem;">
          <span style="display:inline-flex; align-items:center; background:var(--graphite); border-left:3px solid var(--accent); color:#D6D1C5; padding:0.5rem 0.85rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;">Writing</span>
          <span aria-hidden="true" data-rule="" style="flex:1; border-top:1px solid var(--line);"></span>
        </h2>
        <div style="border-bottom:1px solid var(--line);">
          <a data-reveal="0" href="https://lemur.legal/blog" target="_blank" rel="noopener" style="display:flex; flex-wrap:wrap; align-items:baseline; gap:0.4rem 1.5rem; padding:1.35rem 0; border-top:1px solid var(--line); text-decoration:none; color:inherit; transition:transform 0.18s cubic-bezier(0.2,0.7,0.2,1), border-top-color 0.18s cubic-bezier(0.2,0.7,0.2,1);" data-hover="transform:translateX(6px); border-top-color:var(--accent);">
            <span style="flex:0 0 4.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--accent); font-variant-numeric:tabular-nums;">Seg 01</span>
            <span style="flex:1 1 20rem; font-family:'Spectral', Georgia, serif; font-weight:500; font-size:clamp(1.25rem, 2.2vw, 1.6rem); line-height:1.3;">MiCA compliance, in practice</span>
            <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">lemur.legal/blog ↗</span>
          </a>
          <a data-reveal="1" href="https://lemur.legal/blog" target="_blank" rel="noopener" style="display:flex; flex-wrap:wrap; align-items:baseline; gap:0.4rem 1.5rem; padding:1.35rem 0; border-top:1px solid var(--line); text-decoration:none; color:inherit; transition:transform 0.18s cubic-bezier(0.2,0.7,0.2,1), border-top-color 0.18s cubic-bezier(0.2,0.7,0.2,1);" data-hover="transform:translateX(6px); border-top-color:var(--accent);">
            <span style="flex:0 0 4.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--accent); font-variant-numeric:tabular-nums;">Seg 02</span>
            <span style="flex:1 1 20rem; font-family:'Spectral', Georgia, serif; font-weight:500; font-size:clamp(1.25rem, 2.2vw, 1.6rem); line-height:1.3;">Token classification, and the opinions that get assets listed</span>
            <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">lemur.legal/blog ↗</span>
          </a>
          <a data-reveal="2" href="https://lemur.legal/blog" target="_blank" rel="noopener" style="display:flex; flex-wrap:wrap; align-items:baseline; gap:0.4rem 1.5rem; padding:1.35rem 0; border-top:1px solid var(--line); text-decoration:none; color:inherit; transition:transform 0.18s cubic-bezier(0.2,0.7,0.2,1), border-top-color 0.18s cubic-bezier(0.2,0.7,0.2,1);" data-hover="transform:translateX(6px); border-top-color:var(--accent);">
            <span style="flex:0 0 4.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--accent); font-variant-numeric:tabular-nums;">Seg 03</span>
            <span style="flex:1 1 20rem; font-family:'Spectral', Georgia, serif; font-weight:500; font-size:clamp(1.25rem, 2.2vw, 1.6rem); line-height:1.3;">Crypto taxation in Slovenia</span>
            <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">lemur.legal/blog ↗</span>
          </a>
        </div>
        <p style="margin:1.1rem 0 0; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; color:var(--ink2);">⚠ Topic lines shown — swap in final article titles, links and the LinkedIn destination before publishing.</p>
      </div>
    </section>

    <section id="contact" data-screen-label="Contact" data-chyron="Contact" style="background:var(--graphite); color:var(--ivory); position:relative; overflow:hidden; padding:clamp(4.5rem, 10vw, 7rem) 0 clamp(4rem, 8vw, 6rem);">
      <div style="max-width:76rem; margin:0 auto; padding-left:clamp(1.25rem, 5vw, 4rem); padding-right:clamp(1.25rem, 5vw, 4rem);">
        <h2 style="margin:0 0 clamp(1.8rem, 4vw, 2.8rem); display:flex; align-items:center; gap:1.1rem;">
          <span style="display:inline-flex; align-items:center; background:var(--ivory); border-left:3px solid var(--accent); color:var(--graphite); padding:0.5rem 0.85rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;">Contact</span>
          <span aria-hidden="true" data-rule="" style="flex:1; border-top:1px solid color-mix(in oklab, var(--graphite) 78%, #ECE7DC);"></span>
        </h2>
        <p data-reveal="0" style="margin:0; font-family:'Spectral', Georgia, serif; font-weight:500; font-size:clamp(1.5rem, 3vw, 2.2rem); line-height:1.25; max-width:26ch; color:var(--ivory);">If what you’re building runs ahead of the rulebook, we should talk<span style="color:var(--accent);">.</span></p>
        <p data-reveal="1" style="margin:1.1rem 0 0; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.92rem; line-height:1.6; color:var(--ivory2); max-width:54ch;">Pick a topic and fill in the draft below — the button opens the finished email in your own mail app. Nothing sends from this page.</p>
        <form id="contact-form" data-reveal="2" data-on-submit="onSubmit" data-on-focus="airOn" data-on-blur="airOff" style="margin-top:clamp(2rem, 4.5vw, 3rem); max-width:56rem;">
          <div style="display:flex; flex-wrap:wrap; gap:0.4rem 1.3rem; align-items:baseline; margin-bottom:1.4rem;">
            <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.64rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:#948E81;">Regarding</span>
            <button id="chip-0" type="button" data-topic="MiCA &amp; licensing" aria-pressed="false" data-on-click="pickTopic" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; font-weight:500; letter-spacing:0.04em; background:transparent; color:var(--ivory2); border:0; border-bottom:1px dashed rgba(236,231,220,0.35); border-radius:0; padding:0.5rem 0.15rem; min-height:40px; cursor:pointer; transition:color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="color:var(--ivory); border-bottom-color:var(--ivory);">MiCA &amp; licensing</button>
            <button id="chip-1" type="button" data-topic="Listing opinion" aria-pressed="false" data-on-click="pickTopic" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; font-weight:500; letter-spacing:0.04em; background:transparent; color:var(--ivory2); border:0; border-bottom:1px dashed rgba(236,231,220,0.35); border-radius:0; padding:0.5rem 0.15rem; min-height:40px; cursor:pointer; transition:color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="color:var(--ivory); border-bottom-color:var(--ivory);">Listing opinion</button>
            <button id="chip-2" type="button" data-topic="Venture &amp; funds" aria-pressed="false" data-on-click="pickTopic" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; font-weight:500; letter-spacing:0.04em; background:transparent; color:var(--ivory2); border:0; border-bottom:1px dashed rgba(236,231,220,0.35); border-radius:0; padding:0.5rem 0.15rem; min-height:40px; cursor:pointer; transition:color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="color:var(--ivory); border-bottom-color:var(--ivory);">Venture &amp; funds</button>
            <button id="chip-3" type="button" data-topic="Speaking &amp; media" aria-pressed="false" data-on-click="pickTopic" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; font-weight:500; letter-spacing:0.04em; background:transparent; color:var(--ivory2); border:0; border-bottom:1px dashed rgba(236,231,220,0.35); border-radius:0; padding:0.5rem 0.15rem; min-height:40px; cursor:pointer; transition:color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="color:var(--ivory); border-bottom-color:var(--ivory);">Speaking &amp; media</button>
            <button id="chip-4" type="button" data-topic="Something else" aria-pressed="false" data-on-click="pickTopic" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; font-weight:500; letter-spacing:0.04em; background:transparent; color:var(--ivory2); border:0; border-bottom:1px dashed rgba(236,231,220,0.35); border-radius:0; padding:0.5rem 0.15rem; min-height:40px; cursor:pointer; transition:color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="color:var(--ivory); border-bottom-color:var(--ivory);">Something else</button>
          </div>
          <div style="background:color-mix(in oklab, var(--graphite) 91%, #FFFFFF); border:1px solid rgba(236,231,220,0.14); border-top:3px solid var(--accent); box-shadow:0 16px 40px rgba(15,16,18,0.25);">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; padding:0.85rem 1.25rem; border-bottom:1px solid rgba(236,231,220,0.12);">
              <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.64rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#D6D1C5;">New message — draft</span>
              <span style="display:inline-flex; align-items:center; gap:0.5rem;">
                <div data-if="onAir" style="display:none">
                  <span aria-hidden="true" style="width:8px; height:8px; border-radius:50%; background:var(--accent); animation:pm-blink 1.5s ease-in-out infinite;"></span>
                  <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.64rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:var(--ivory);">On air</span>
                </div>
                <div data-if="offAir" style="display:contents">
                  <span aria-hidden="true" style="width:8px; height:8px; border-radius:50%; background:#948E81;"></span>
                  <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.64rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#948E81;">Standby</span>
                </div>
              </span>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:0.3rem 1.2rem; align-items:baseline; padding:0.8rem 1.25rem; border-bottom:1px solid rgba(236,231,220,0.12);">
              <span style="flex:0 0 5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.62rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#948E81;">To</span>
              <span style="flex:1 1 16rem; font-family:'Spectral', Georgia, serif; font-size:1.02rem; color:var(--ivory);">Peter Merc <span style="color:var(--ivory2);">&lt;<span style="border-bottom:1px dashed #6B665C;">peter@lemur.legal</span>&gt;</span> <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.72rem; color:#948E81;">⚠ to confirm</span></span>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:0.3rem 1.2rem; align-items:baseline; padding:0.8rem 1.25rem; border-bottom:1px solid rgba(236,231,220,0.12);">
              <span style="flex:0 0 5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.62rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#948E81;">Subject</span>
              <span id="mail-subject" style="flex:1 1 16rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.02rem; color:var(--ivory);" data-bind="mailSubject">Website inquiry — General</span>
            </div>
            <div style="padding:0.9rem 1.25rem 1.1rem;">
              <label for="cf-message" style="display:block; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.62rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#948E81;">Message</label>
              <textarea id="cf-message" name="message" rows="5" placeholder="A few lines about what you have in mind is plenty." data-bind-placeholder="msgHint" style="display:block; width:100%; box-sizing:border-box; margin-top:0.5rem; background:transparent; border:0; border-radius:0; padding:0.2rem 0; font-family:'Spectral', Georgia, serif; font-size:1.1rem; line-height:1.75; color:var(--ivory); resize:vertical;"></textarea>
            </div>
          </div>
          <input type="checkbox" name="botcheck" tabindex="-1" aria-hidden="true" style="display:none;">
          <div style="margin-top:1.6rem; display:flex; align-items:center; gap:1.3rem; flex-wrap:wrap;">
            <button id="contact-send" type="submit" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.88rem; font-weight:600; letter-spacing:0.06em; background:var(--accent); color:#F7F4EC; border:0; border-radius:0; padding:0.95rem 1.8rem; min-height:44px; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1), transform 0.18s cubic-bezier(0.2,0.7,0.2,1);" data-hover="background:color-mix(in oklab, var(--accent) 86%, #000000); transform:translateY(-1px);">Open the draft in my mail app ↗</button>
            <div data-if="sentNote" style="display:none">
              <p role="status" style="margin:0; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.82rem; color:var(--ivory); animation:pm-slide 0.4s cubic-bezier(0.2,0.7,0.2,1) both;">Draft opened — press send there to deliver it ✓</p>
            </div>
          </div>
        </form>
      </div>
    </section>
  </main>
<div data-if="barOn" style="display:none">
    <div role="navigation" aria-label="Page progress" style="position:fixed; left:0; right:0; bottom:0; z-index:70; height:46px; display:flex; align-items:stretch; background:var(--graphite); border-top:1px solid rgba(236,231,220,0.14); box-shadow:0 -8px 26px rgba(15,16,18,0.22); animation:chyron-rise 0.4s cubic-bezier(0.2,0.7,0.2,1) both; padding-left:env(safe-area-inset-left); padding-right:env(safe-area-inset-right);">
      <div style="flex:0 0 clamp(10rem, 26vw, 16rem); box-sizing:border-box; display:flex; align-items:center; gap:0.65rem; padding:0 1rem; border-right:1px solid rgba(236,231,220,0.12); min-width:0; overflow:hidden;">
        <span id="bar-dot" aria-hidden="true" style="width:0.45rem; height:0.45rem; border-radius:50%; background:var(--accent); flex:none;"></span>
        <span style="overflow:hidden; min-width:0;"><span id="bar-label" style="display:inline-block; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.78rem; color:var(--ivory); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" data-bind="barLabel">On record</span></span>
      </div>
      <div style="flex:1; position:relative; min-width:3rem;">
        <span aria-hidden="true" style="position:absolute; left:0; right:0; top:50%; height:2px; margin-top:-1px; background:rgba(236,231,220,0.16);"></span>
        <span id="bar-fill" aria-hidden="true" style="position:absolute; left:0; right:0; top:50%; height:2px; margin-top:-1px; background:var(--accent); transform:scaleX(0); transform-origin:left;"></span>
        <button type="button" data-target="facets" data-on-click="jump" title="Part 1 — What I do" aria-label="Jump to What I do" style="position:absolute; top:0; bottom:0; left:0%; width:20%; box-sizing:border-box; background:transparent; border:0; padding:0; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="background:rgba(236,231,220,0.07);"></button>
        <button type="button" data-target="record" data-on-click="jump" title="Part 2 — Track record" aria-label="Jump to Track record" style="position:absolute; top:0; bottom:0; left:20%; width:20%; box-sizing:border-box; background:transparent; border:0; border-left:1px solid rgba(236,231,220,0.2); padding:0; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="background:rgba(236,231,220,0.07);"></button>
        <button type="button" data-target="media" data-on-click="jump" title="Part 3 — Media &amp; press" aria-label="Jump to Media and press" style="position:absolute; top:0; bottom:0; left:40%; width:20%; box-sizing:border-box; background:transparent; border:0; border-left:1px solid rgba(236,231,220,0.2); padding:0; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="background:rgba(236,231,220,0.07);"></button>
        <button type="button" data-target="writing" data-on-click="jump" title="Part 4 — Writing" aria-label="Jump to Writing" style="position:absolute; top:0; bottom:0; left:60%; width:20%; box-sizing:border-box; background:transparent; border:0; border-left:1px solid rgba(236,231,220,0.2); padding:0; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="background:rgba(236,231,220,0.07);"></button>
        <button type="button" data-target="contact" data-on-click="jump" title="Part 5 — Contact" aria-label="Jump to Contact" style="position:absolute; top:0; bottom:0; left:80%; width:20%; box-sizing:border-box; background:transparent; border:0; border-left:1px solid rgba(236,231,220,0.2); padding:0; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="background:rgba(236,231,220,0.07);"></button>
      </div>
      <div style="flex:0 0 6.6rem; box-sizing:border-box; display:flex; align-items:center; justify-content:flex-end; gap:0.45rem; padding:0 1rem; border-left:1px solid rgba(236,231,220,0.12);">
        <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.6rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#948E81;">Part</span>
        <span style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.78rem; font-weight:600; color:var(--ivory); font-variant-numeric:tabular-nums;" data-bind="barPart">01 / 05</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { initEffects } from './Home.effects'
import { useRootVars } from '@/composables/useTheme'

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
  document.title = "Peter Merc — crypto & fintech lawyer · venture investor"
  useRootVars(ROOT_VARS)
  dispose = initEffects()
})
onUnmounted(() => dispose && dispose())
</script>

<style scoped>
#contact input::placeholder, #contact textarea::placeholder { color: rgba(180,174,161,0.5); }

#network g[data-net] { outline: none; }

#network g[data-net]:focus-visible circle { stroke: #D2453E; stroke-width: 2.5px; }

#media-strip { scrollbar-width: thin; scrollbar-color: rgba(148,142,129,0.55) transparent; }
</style>
