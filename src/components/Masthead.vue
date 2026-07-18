<template>
  <header
    id="site-head"
    ref="root"
    style="position:relative; z-index:20; background:var(--graphite); display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:0.5rem 1rem; padding:clamp(0.8rem, 2vw, 1.1rem) clamp(1.25rem, 4vw, 3rem); color:#FBFAF7;"
  >
    <a
      href="#hero"
      data-no-retype=""
      style="font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.12rem; letter-spacing:0.01em; color:#FBFAF7; text-decoration:none;"
    >Peter Merc<span style="color:var(--accent);">.</span></a>
    <div class="pm-actions" style="display:flex; align-items:center; gap:clamp(1.1rem, 2.5vw, 2.2rem);">
      <!-- nav shows on desktop, hides ≤819px -->
      <div class="pm-desktop-only">
        <nav :aria-label="c.navAria" style="display:flex; align-items:center; gap:clamp(1.1rem, 2vw, 1.9rem);">
          <a
            href="#facets"
            style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.86rem; font-weight:500; color:#FBFAF7; text-decoration:none;"
            data-hover="text-decoration:underline; text-decoration-color:rgba(251,250,247,0.6); text-underline-offset:0.35em;"
          >{{ c.nav.facets }}</a>
          <a
            href="#record"
            style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.86rem; font-weight:500; color:#FBFAF7; text-decoration:none;"
            data-hover="text-decoration:underline; text-decoration-color:rgba(251,250,247,0.6); text-underline-offset:0.35em;"
          >{{ c.nav.record }}</a>
          <a
            href="#media"
            style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.86rem; font-weight:500; color:#FBFAF7; text-decoration:none;"
            data-hover="text-decoration:underline; text-decoration-color:rgba(251,250,247,0.6); text-underline-offset:0.35em;"
          >{{ c.nav.media }}</a>
          <a
            href="#writing"
            style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.86rem; font-weight:500; color:#FBFAF7; text-decoration:none;"
            data-hover="text-decoration:underline; text-decoration-color:rgba(251,250,247,0.6); text-underline-offset:0.35em;"
          >{{ c.nav.writing }}</a>
        </nav>
      </div>
      <!-- EN | SL toggle: outside .pm-desktop-only so it stays visible on
           mobile. Plain absolute-path <a>s — App.vue's click interceptor
           turns them into router.push, and the route-keyed remount re-runs
           the page in the new language. Hash is preserved across the switch. -->
      <!-- data-no-retype: EN/SL don't change between locales — retyping the
           control you just clicked would read as noise -->
      <nav :aria-label="c.langAria" data-no-retype="" style="display:inline-flex; align-items:center; gap:0.15rem;">
        <a
          class="lang-link"
          :class="{ active: locale === 'en' }"
          :href="localePath('en', currentHash)"
          hreflang="en"
          lang="en"
          :aria-current="locale === 'en' ? 'true' : undefined"
        >EN</a>
        <span aria-hidden="true" style="width:1px; height:0.95rem; background:rgba(251,250,247,0.35);"></span>
        <a
          class="lang-link"
          :class="{ active: locale === 'sl' }"
          :href="localePath('sl', currentHash)"
          hreflang="sl"
          lang="sl"
          :aria-current="locale === 'sl' ? 'true' : undefined"
        >SL</a>
      </nav>
      <a
        href="#contact"
        class="pm-cta"
        style="font-family:'Instrument Sans', Arial, sans-serif; font-weight:500; color:#FBFAF7; text-decoration:none; border:1px solid rgba(251,250,247,0.65); box-sizing:border-box; display:inline-flex; align-items:center; white-space:nowrap; transition:background 0.18s cubic-bezier(0.4,0,0.2,1), color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);"
        data-hover="background:#FBFAF7; color:#17181A; border-color:#FBFAF7;"
      >{{ c.cta }}</a>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useInlineStates } from '@/composables/useInlineStates'
import { usePageContent } from '@/i18n/useContent'
import { locale, localePath } from '@/i18n/locale'
import chrome from '@/content/chrome'

const c = usePageContent(chrome)
const root = ref<HTMLElement | null>(null)
useInlineStates(root) // reproduce the nav-link / button hover states

// Current section hash, so the language toggle keeps the visitor's place
// (/#contact → /sl#contact). In-page anchor clicks fire hashchange (the SPA
// interceptor lets #hash links through to the browser).
const currentHash = ref(typeof window !== 'undefined' ? window.location.hash : '')
const syncHash = () => { currentHash.value = window.location.hash }
onMounted(() => window.addEventListener('hashchange', syncHash))
onUnmounted(() => window.removeEventListener('hashchange', syncHash))
</script>

<style scoped>
/* Language toggle: styled like the nav items, active locale marked with the
   accent. Plain CSS :hover (not data-hover) — these links re-render on locale
   change, which would fight the inline-state save/restore mechanism. */
.lang-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 0.45rem;
  font-family: 'Instrument Sans', Arial, sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: rgba(251, 250, 247, 0.55);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: color 0.18s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}
.lang-link:hover { color: #fbfaf7; }
.lang-link.active { color: #fbfaf7; border-bottom-color: var(--accent); }

/* "Get in touch" button. Its size lives here (not inline) so the media query
   can shrink it on small phones — the longer Slovenian label ("Stopite v stik")
   was tipping the header over its width and wrapping the button to a 2nd line.
   min-height stays 44px for the tap target. */
.pm-cta { font-size: 0.86rem; padding: 0.6rem 1.15rem; min-height: 44px; }
@media (max-width: 480px) {
  /* Tighten the row so brand + EN|SL toggle + CTA stay on one line even with
     the longer Slovenian label, down to 320px. !important beats the header's
     inline clamp() padding and the actions' inline gap. */
  #site-head { padding-left: 1rem !important; padding-right: 1rem !important; column-gap: 0.4rem !important; }
  .pm-actions { gap: 0.6rem !important; }
  .pm-cta { font-size: 0.8rem; padding: 0.5rem 0.7rem; }
}
</style>
