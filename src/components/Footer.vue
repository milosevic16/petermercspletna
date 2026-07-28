<template>
  <footer class="pm-foot">
    <div class="pm-foot-in">
      <div class="pm-foot-grid">
        <div>
          <p class="pm-foot-brand">Peter Merc<span aria-hidden="true" class="pm-foot-dot">.</span></p>
          <p class="pm-foot-loc">{{ c.footer.location }}</p>
        </div>
        <!-- Label/value rows rather than one wrapping line: the old footer was a
             single flex row that broke onto four ragged lines on a phone, with
             the copyright pushed to the right of whichever line it landed on. -->
        <ul class="pm-foot-links">
          <li>
            <span class="pm-foot-k">{{ c.footer.emailPrefix }}</span>
            <a class="pm-foot-v" href="mailto:peter@lemur.legal">peter@lemur.legal</a>
          </li>
          <li>
            <span class="pm-foot-k">{{ c.footer.linkedinPrefix }}</span>
            <a class="pm-foot-v" href="https://www.linkedin.com/in/petermerc/" target="_blank" rel="noopener">linkedin.com/in/petermerc</a>
          </li>
          <li>
            <span class="pm-foot-k">Lemur Legal</span>
            <a class="pm-foot-v pm-foot-ext" href="https://lemur.legal" target="_blank" rel="noopener">
              {{ c.footer.lemur }}
              <svg aria-hidden="true" viewBox="0 0 12 12" width="0.8em" height="0.8em" fill="none">
                <path d="M3.6 8.4L8.4 3.6M8.4 3.6H5M8.4 3.6V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </a>
          </li>
        </ul>
      </div>
      <p class="pm-foot-legal">{{ c.footer.copyright }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { usePageContent } from '@/i18n/useContent'
import chrome from '@/content/chrome'

const c = usePageContent(chrome)
</script>

<style scoped>
/* Bottom padding clears the fixed progress bar (48px) that sits over the page. */
.pm-foot {
  background: var(--graphite);
  color: #C9C4B8;
  font-family: 'Instrument Sans', Arial, sans-serif;
  padding: clamp(2.4rem, 5vw, 3.4rem) 0 calc(clamp(1.8rem, 4vw, 2.6rem) + 48px);
}
.pm-foot-in {
  max-width: 76rem;
  margin: 0 auto;
  padding-left: clamp(1.25rem, 5vw, 4rem);
  padding-right: clamp(1.25rem, 5vw, 4rem);
}
.pm-foot-grid { display: grid; gap: clamp(1.5rem, 4vw, 2rem); }
/* Two columns once there is room: identity left, contact block right. */
@media (min-width: 741px) {
  .pm-foot-grid { grid-template-columns: minmax(0, 1fr) auto; align-items: start; column-gap: 3rem; }
}

.pm-foot-brand {
  margin: 0;
  font-family: 'Spectral', Georgia, serif;
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.2;
  color: var(--ivory);
}
.pm-foot-dot { color: var(--accent); }
.pm-foot-loc { margin: 0.4rem 0 0; font-size: 0.78rem; line-height: 1.5; color: #8D887D; }

.pm-foot-links { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.7rem; }
/* A fixed label column keeps the three values on one optical line; it collapses
   to stacked rows only where that column would crowd the value. */
.pm-foot-links li { display: grid; grid-template-columns: 6.2rem minmax(0, 1fr); align-items: baseline; column-gap: 1rem; }
@media (max-width: 359px) {
  .pm-foot-links li { grid-template-columns: 1fr; row-gap: 0.15rem; }
}
.pm-foot-k {
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #7E7A70;
}
.pm-foot-v {
  justify-self: start;
  font-size: 0.85rem;
  line-height: 1.4;
  color: #C9C4B8;
  text-decoration: none;
  border-bottom: 1px solid rgba(236, 231, 220, 0.2);
  padding-bottom: 2px;
  overflow-wrap: anywhere;
  transition: color 0.18s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}
.pm-foot-v:hover, .pm-foot-v:focus-visible { color: var(--ivory); border-bottom-color: var(--accent); outline: none; }
.pm-foot-ext svg { display: inline-block; vertical-align: -0.06em; margin-left: 0.3em; }

.pm-foot-legal {
  margin: clamp(1.7rem, 4vw, 2.4rem) 0 0;
  padding-top: 1.1rem;
  border-top: 1px solid rgba(236, 231, 220, 0.12);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  color: #7E7A70;
}
</style>
