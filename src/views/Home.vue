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

        <article
          v-for="(entry, i) in t.facets.entries"
          :key="entry.key"
          :id="entry.key"
          :data-chyron="entry.chyron"
          :data-reveal="i"
          :style="i === t.facets.entries.length - 1 ? 'margin:0; border-bottom:1px solid var(--line);' : 'margin:0;'">
          <button :id="'btn-' + entry.key" type="button" data-on-click="toggleEntry" :data-key="entry.key" aria-expanded="false" :aria-controls="'brief-' + entry.key" style="display:flex; flex-wrap:wrap; align-items:center; gap:0.3rem 1.4rem; width:100%; box-sizing:border-box; text-align:left; background:transparent; border:0; border-top:1px solid var(--line); padding:1rem 0.2rem; min-height:44px; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);" data-hover="background:rgba(23,24,26,0.04);">
            <strong style="flex:0 0 10.5rem; font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.3rem; color:var(--ink);">{{ entry.label }}</strong>
            <em style="flex:1 1 16rem; font-family:'Spectral', Georgia, serif; font-style:italic; font-weight:400; font-size:0.97rem; color:var(--ink2);">{{ entry.credential }}</em>
            <span :id="'ico-' + entry.key" style="margin-left:auto; display:inline-flex; align-items:center; justify-content:center; width:1.5rem; height:1.5rem; border:1px solid var(--ink2); color:var(--ink2); font-size:1.05rem; line-height:1; flex:none; transition:transform 0.35s cubic-bezier(0.2,0.7,0.2,1), color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);">+</span>
          </button>
          <div :id="'brief-' + entry.key" :data-brief="entry.key" style="display:grid; grid-template-rows:0fr; transition:grid-template-rows 0.5s cubic-bezier(0.2,0.7,0.2,1);">
            <div style="overflow:hidden; min-height:0;">
              <div style="padding:0.2rem 0.2rem 1.4rem; max-width:62ch;">
                <div v-for="(sub, si) in entry.subsections" :key="si" :style="si > 0 ? 'margin-top:1.5rem; padding-top:1.2rem; border-top:1px solid var(--line);' : ''">
                  <h3 v-if="entry.subsections.length > 1" style="margin:0 0 0.55rem; display:flex; flex-wrap:wrap; align-items:baseline; gap:0.35rem 0.85rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--accent);">{{ sub.subLabel }}<span style="font-family:'Spectral', Georgia, serif; text-transform:none; letter-spacing:0; font-style:italic; font-weight:400; font-size:0.92rem; color:var(--ink2);">{{ sub.credential }}</span></h3>
                  <p style="margin:0 0 0.7rem; font-size:1.03rem; line-height:1.64; color:#34332E;" v-html="sub.paragraphHtml"></p>
                  <div v-for="item in sub.list" :key="item.key" style="display:flex; flex-wrap:wrap; gap:0.2rem 1.5rem; padding:0.55rem 0; border-top:1px solid var(--line);"><span style="flex:0 0 8.5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink2);">{{ item.key }}</span><span style="flex:1 1 14rem; font-size:0.98rem; color:#34332E;"><a v-if="item.href" :href="item.href" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline; text-underline-offset:2px;">{{ item.detail }}</a><template v-else>{{ item.detail }}</template></span></div>
                </div>
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

        <p style="margin:0 0 clamp(1.6rem, 3.5vw, 2.3rem); font-family:'Spectral', Georgia, serif; font-style:italic; font-weight:500; font-size:clamp(1.4rem, 2.7vw, 2.1rem); line-height:1.3; color:var(--ivory); max-width:28ch;">{{ t.record.pullQuote }}<span style="color:var(--accent);">.</span></p>
        <p style="margin:0 0 0.6rem; display:flex; align-items:center; gap:0.55rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.66rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#948E81;"><span aria-hidden="true" style="width:6px; height:6px; border-radius:50%; background:var(--accent); animation:pm-blink 2.6s ease-in-out infinite;"></span>{{ t.record.live }}</p>

        <!-- Interactive zoomable map is built into #op-map by opMap.ts on mount.
             The list below is the server-rendered content (SEO + no-JS fallback);
             it is hidden once the interactive map goes live. -->
        <div id="op-map" class="op-map" role="group" :aria-label="t.record.networkAria"></div>
        <ol class="op-fallback">
          <li><strong>{{ t.record.hub.name }}</strong> — {{ t.record.hub.desc }}</li>
          <li v-for="cat in t.record.tree" :key="cat.key">
            <strong>{{ cat.label }}</strong> — {{ cat.desc }}
            <ul>
              <li v-for="org in cat.children" :key="org.key">
                <strong>{{ org.name || org.label }}</strong> — {{ org.desc }}<template v-if="org.href"> · <a :href="org.href" target="_blank" rel="noopener">{{ t.record.visit }}</a></template>
                <ul v-if="org.children">
                  <li v-for="sub in org.children" :key="sub.key"><strong>{{ sub.name || sub.label }}</strong> — {{ sub.desc }}</li>
                </ul>
              </li>
            </ul>
          </li>
        </ol>
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
            <button v-for="(topic, ti) in t.contact.topics" :key="topic.key" :id="'chip-' + ti" type="button" class="pm-chip" :data-topic="topic.key" aria-pressed="false" data-on-click="pickTopic" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.8rem; font-weight:500; letter-spacing:0.04em; background:transparent; border-radius:0; padding:0.5rem 0.15rem; min-height:40px; cursor:pointer; transition:color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);">{{ topic.label }}</button>
          </div>
          <!-- The selected Regarding choice (stable English key) is mirrored here
               by pickTopic, so it submits to Web3Forms as the `topic` field. -->
          <input id="cf-topic" type="hidden" name="topic" value="">
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
              <label for="cf-name" style="flex:0 0 5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.62rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#948E81;">{{ t.contact.nameLabel }}</label>
              <input id="cf-name" name="name" type="text" autocomplete="name" :placeholder="t.contact.namePlaceholder" style="flex:1 1 16rem; min-width:0; background:transparent; border:0; border-radius:0; padding:0.1rem 0; font-family:'Spectral', Georgia, serif; font-size:1.02rem; color:var(--ivory);">
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:0.3rem 1.2rem; align-items:baseline; padding:0.8rem 1.25rem; border-bottom:1px solid rgba(236,231,220,0.12);">
              <label for="cf-email" style="flex:0 0 5rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.62rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#948E81;">{{ t.contact.emailLabel }}</label>
              <input id="cf-email" name="email" type="email" autocomplete="email" :placeholder="t.contact.emailPlaceholder" style="flex:1 1 16rem; min-width:0; background:transparent; border:0; border-radius:0; padding:0.1rem 0; font-family:'Spectral', Georgia, serif; font-size:1.02rem; color:var(--ivory);">
            </div>
            <div style="padding:0.9rem 1.25rem 1.1rem;">
              <label for="cf-message" style="display:block; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.62rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#948E81;">{{ t.contact.messageLabel }}</label>
              <textarea id="cf-message" name="message" rows="5" :placeholder="t.contact.msgHint" data-bind-placeholder="msgHint" style="display:block; width:100%; box-sizing:border-box; margin-top:0.5rem; background:transparent; border:0; border-radius:0; padding:0.2rem 0; font-family:'Spectral', Georgia, serif; font-size:1.1rem; line-height:1.75; color:var(--ivory); resize:vertical;"></textarea>
            </div>
          </div>
          <input type="checkbox" name="botcheck" tabindex="-1" aria-hidden="true" style="display:none;">
          <div style="margin-top:1.6rem; display:flex; align-items:center; gap:1.3rem; flex-wrap:wrap;">
            <button id="contact-send" type="submit" style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.88rem; font-weight:600; letter-spacing:0.06em; background:var(--accent); color:#F7F4EC; border:0; border-radius:0; padding:0.95rem 1.8rem; min-height:44px; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1), transform 0.18s cubic-bezier(0.2,0.7,0.2,1);" data-hover="background:color-mix(in oklab, var(--accent) 86%, #000000); transform:translateY(-1px);">{{ t.contact.send }}</button>
            <!-- The Web3Forms helper (wireWeb3Form) writes sending/success/error here. -->
            <p class="js-form-status" role="status" aria-live="polite" style="margin:0; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.82rem; color:#B4AEA1;"></p>
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
        <button v-for="(j, ji) in t.bar.jumps" :key="j.target" type="button" class="pm-bar-jump" :data-target="j.target" data-on-click="jump" :title="j.title" :aria-label="j.aria" :style="'position:absolute; top:0; bottom:0; left:' + ji * 20 + '%; width:20%; box-sizing:border-box; background:transparent; border:0; padding:0; cursor:pointer; transition:background 0.18s cubic-bezier(0.4,0,0.2,1);'" data-hover="background:rgba(236,231,220,0.07);"></button>
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
import { initOpMap } from './opMap'
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
let disposeMap: (() => void) | undefined
onMounted(() => {
  useRootVars(ROOT_VARS)
  dispose = initEffects(t.value)
  // Build the interactive operating map into #op-map (over the SSR fallback).
  const mapEl = document.getElementById('op-map')
  if (mapEl) disposeMap = initOpMap(mapEl, t.value.record)
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
onUnmounted(() => { if (disposeMap) disposeMap(); if (dispose) dispose() })
</script>

<style scoped>
#contact input::placeholder, #contact textarea::placeholder { color: rgba(180,174,161,0.5); }

#network g[data-net] { outline: none; }

#network g[data-net]:focus-visible circle { stroke: #D2453E; stroke-width: 2.5px; }

/* Panel title link: a soft red cloud (layered drop-shadow) blooms around the
   title on hover. Applied to the element itself (reliable), and gated with
   @media (hover: hover) so it never sticks on a touch tap. */
#net-name {
  display: inline-block;
  /* Base = the same shadows but transparent, so hovering interpolates colour only.
     Transitioning from `filter: none` sticks at the zeroed start in Chrome, which
     is why the glow never appeared. */
  filter: drop-shadow(0 0 4px transparent) drop-shadow(0 0 12px transparent) drop-shadow(0 0 26px transparent);
}
@media (hover: hover) {
  #net-name:hover {
    text-decoration-color: var(--accent);
    filter: drop-shadow(0 0 4px rgba(210, 69, 62, 0.8)) drop-shadow(0 0 12px rgba(210, 69, 62, 0.6)) drop-shadow(0 0 26px rgba(210, 69, 62, 0.4));
  }
}

/* Node-panel ‹/› controls. Position is kept stable by the reserved panel
   min-height; on mobile, tighten the top gap so they sit closer to the dossier
   instead of floating far below it. */
#net-controls { margin-top: 1.6rem; }
@media (max-width: 819px) {
  #net-controls { margin-top: 0.55rem; }
}

/* Contact 'Regarding' chips: the selected chip (aria-pressed) stays accent and
   never reverts on mouse-leave; hover only affects the unselected chips, and only
   on hover-capable devices so it can't stick on a touch tap. */
.pm-chip { color: var(--ivory2); border: 0; border-bottom: 1px dashed rgba(236, 231, 220, 0.35); }
.pm-chip[aria-pressed="true"] { color: var(--accent); border-bottom-color: var(--accent); border-bottom-style: solid; }
@media (hover: hover) {
  .pm-chip:not([aria-pressed="true"]):hover { color: var(--ivory); border-bottom-color: var(--ivory); }
}

/* Progress-bar section dividers: half-height, vertically centred so they cross the
   central fill line rather than spanning the whole bar. */
.pm-bar-jump + .pm-bar-jump::before {
  content: "";
  position: absolute;
  left: 0;
  top: 25%;
  height: 50%;
  width: 1px;
  background: rgba(236, 231, 220, 0.2);
}

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

<!-- Operating map — NOT scoped: opMap.ts builds these elements in JS, so they
     carry no scoped data-v attribute and must be styled globally. -->
<style>
.op-map { position: relative; width: 100%; margin-top: 0.4rem; }
/* Give the map its height only once it's live, so the no-JS / pre-hydration
   state doesn't reserve a tall empty well above the SEO fallback list. */
.op-map.op-live { height: clamp(430px, 72svh, 640px); }
/* phones: near full-screen so the map reads as an immersive canvas, not a chip.
   Node + label sizes are pinned in opMap.ts (counter-scaled per camera), so the
   old scale-dependent SVG font-size overrides are gone — inline styles drive them. */
@media (max-width: 740px) {
  .op-map { margin-top: 0.2rem; }
  .op-map.op-live { height: clamp(460px, 82svh, 620px); min-height: 460px; }
  .op-node.op-cat .op-lbl { letter-spacing: 0.05em; }
}
#op-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; touch-action: manipulation; }
#op-camera { transition: transform 0.82s cubic-bezier(0.38, 0.02, 0.18, 1); }
@media (prefers-reduced-motion: reduce) { #op-camera { transition: none; } }
.op-edge { transition: opacity 0.6s ease; }
/* only active nodes take pointer events — faded ones must not swallow taps */
.op-node { transition: opacity 0.55s ease; outline: none; pointer-events: none; }
.op-node.op-click { cursor: pointer; pointer-events: auto; }
/* Invisible tap target. pointer-events:all so the transparent fill still
   hit-tests on iOS Safari (the default visiblePainted ignores an unpainted
   fill → dead taps); scoped to active nodes so faded ones never steal taps. */
.op-hit { pointer-events: none; }
.op-node.op-click .op-hit { pointer-events: all; }
.op-dot { transition: fill 0.35s, stroke 0.35s, r 0.45s cubic-bezier(0.34, 1.4, 0.6, 1); }
.op-node.op-click:hover .op-dot { stroke: var(--ivory); }
.op-node:focus-visible .op-dot { stroke: var(--accent); stroke-width: 2.5; }
.op-node.op-focus .op-dot, .op-node.op-sel .op-dot { fill: var(--accent); stroke: var(--accent); }
.op-lbl { font-family: 'Instrument Sans', Arial, sans-serif; font-weight: 600; letter-spacing: 0.04em; pointer-events: none; transition: opacity 0.5s ease; }
.op-node.op-cat .op-lbl { text-transform: uppercase; letter-spacing: 0.11em; fill: #D6C9A9; font-size: 13.5px; }
.op-node:not(.op-cat) .op-lbl { fill: #C7C1B4; font-size: 14.5px; }
#op-focusname { font-family: 'Spectral', Georgia, serif; font-weight: 600; font-size: 17px; fill: var(--ivory); text-anchor: middle; opacity: 0; transition: opacity 0.5s ease; }
#op-focusname.on { opacity: 1; }
#op-hub .op-core { fill: var(--accent); }
#op-hub .op-ring { fill: none; stroke: rgba(236, 231, 220, 0.3); stroke-width: 1; opacity: 0; transition: opacity 0.5s; }
#op-hub.op-top .op-ring { opacity: 1; }
#op-hub text { fill: #F4F1EA; font-family: 'Instrument Sans', Arial, sans-serif; font-weight: 700; letter-spacing: 0.06em; }
.op-leafdesc { transition: opacity 0.5s ease; }
.op-leafdesc-box { font-family: 'Instrument Sans', Arial, sans-serif; font-size: 11.5px; line-height: 1.42; color: #B4AEA1; text-align: center; }
.op-leafdesc-box.up { display: flex; align-items: flex-end; justify-content: center; height: 100%; }

.op-crumbs { position: absolute; top: 0.4rem; left: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 0.05rem; z-index: 2; }
.op-crumb { background: none; border: 0; color: var(--ivory2); font-family: 'Instrument Sans', Arial, sans-serif; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.13em; text-transform: uppercase; padding: 0.35rem 0.4rem; cursor: pointer; min-height: 34px; transition: color 0.18s; }
.op-crumb:last-child { color: var(--ivory); }
.op-crumb:not(:last-child):hover { color: var(--ivory); }
.op-crumb-sep { color: rgba(236, 231, 220, 0.32); font-size: 0.66rem; }

.op-back { position: absolute; top: 0.3rem; right: 0; display: inline-flex; align-items: center; gap: 0.5rem; background: none; border: 0; cursor: pointer; opacity: 0; transform: translateY(-4px); transition: opacity 0.4s ease, transform 0.4s ease; padding: 0.3rem; z-index: 2; }
.op-back.show { opacity: 1; transform: none; }
.op-back[hidden] { display: none; }
.op-back-disc { width: 34px; height: 34px; border-radius: 50%; background: var(--accent); display: inline-flex; align-items: center; justify-content: center; color: #F4F1EA; font-weight: 700; font-size: 0.72rem; font-family: 'Instrument Sans', Arial, sans-serif; }
.op-back-txt { font-size: 0.64rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ivory2); font-family: 'Instrument Sans', Arial, sans-serif; }
.op-back:hover .op-back-txt { color: var(--ivory); }

.op-dossier { position: absolute; z-index: 2; pointer-events: none; opacity: 0; transition: opacity 0.4s ease, transform 0.4s ease; }
.op-dossier.show { opacity: 1; pointer-events: auto; }
.op-dossier-in { background: rgba(20, 21, 23, 0.82); backdrop-filter: blur(7px); -webkit-backdrop-filter: blur(7px); border: 1px solid rgba(236, 231, 220, 0.14); border-left: 2px solid var(--accent); padding: 0.95rem 1.15rem 1.05rem; border-radius: 4px; }
.op-d-name { font-family: 'Spectral', Georgia, serif; font-weight: 600; font-size: 1.25rem; line-height: 1.15; margin: 0 0 0.4rem; color: var(--ivory); }
.op-d-desc { font-size: 0.9rem; line-height: 1.55; color: #CFC9BC; margin: 0; }
.op-d-visit { display: inline-flex; align-items: center; gap: 0.3rem; margin-top: 0.7rem; font-size: 0.76rem; font-weight: 600; letter-spacing: 0.05em; color: var(--ivory); text-decoration: none; border-bottom: 1px dashed rgba(236, 231, 220, 0.4); padding-bottom: 1px; font-family: 'Instrument Sans', Arial, sans-serif; }
.op-d-visit:hover { border-bottom-color: var(--accent); }
@media (min-width: 741px) { .op-dossier { left: 0; bottom: 0.4rem; max-width: 20rem; } }
@media (max-width: 740px) {
  .op-dossier { left: 0; right: 0; bottom: 0; transform: translateY(8px); }
  .op-dossier.show { transform: none; }
  .op-dossier-in { border-radius: 12px 12px 0 0; border-left: 0; border-top: 2px solid var(--accent); padding: 0.8rem 1.05rem 0.9rem; box-shadow: 0 -14px 34px rgba(15, 16, 18, 0.4); }
  .op-d-name { font-size: 1.12rem; }
  /* bound the sheet so the band the camera reserves for it stays small even for
     the longest description; the camera measures whatever height it lands at. */
  .op-d-desc { max-height: 5.4em; overflow-y: auto; -webkit-overflow-scrolling: touch; overscroll-behavior: contain; }
}

/* server-rendered fallback list (SEO + no-JS); hidden once the map goes live */
.op-fallback { list-style: none; margin: 0.4rem 0 0; padding: 0; font-family: 'Instrument Sans', Arial, sans-serif; }
.op-fallback ul { list-style: none; margin: 0.25rem 0 0.7rem 1.15rem; padding: 0; }
.op-fallback li { margin: 0.35rem 0; color: var(--ivory2); font-size: 0.92rem; line-height: 1.5; }
.op-fallback > li > strong:first-child { color: #D6C9A9; text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.82rem; }
.op-fallback strong { color: var(--ivory); font-weight: 600; }
.op-fallback a { color: var(--ivory); }
.op-map.op-live + .op-fallback { display: none; }
</style>
