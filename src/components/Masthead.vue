<template>
  <header
    id="site-head"
    ref="root"
    style="position:relative; z-index:20; background:var(--graphite); display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:clamp(0.8rem, 2vw, 1.1rem) clamp(1.25rem, 4vw, 3rem); color:#FBFAF7;"
  >
    <a
      href="#hero"
      style="font-family:'Spectral', Georgia, serif; font-weight:600; font-size:1.12rem; letter-spacing:0.01em; color:#FBFAF7; text-decoration:none;"
    >Peter Merc<span style="color:var(--accent);">.</span></a>
    <div style="display:flex; align-items:center; gap:clamp(1.1rem, 2.5vw, 2.2rem);">
      <!-- <sc-if showNav>: nav shows on desktop, hides ≤819px -->
      <div class="pm-desktop-only">
        <nav aria-label="Site" style="display:flex; align-items:center; gap:clamp(1.1rem, 2vw, 1.9rem);">
          <a
            href="#facets"
            style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.86rem; font-weight:500; color:#FBFAF7; text-decoration:none;"
            data-hover="text-decoration:underline; text-decoration-color:rgba(251,250,247,0.6); text-underline-offset:0.35em;"
          >What I do</a>
          <a
            href="#record"
            style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.86rem; font-weight:500; color:#FBFAF7; text-decoration:none;"
            data-hover="text-decoration:underline; text-decoration-color:rgba(251,250,247,0.6); text-underline-offset:0.35em;"
          >Track record</a>
          <a
            href="#media"
            style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.86rem; font-weight:500; color:#FBFAF7; text-decoration:none;"
            data-hover="text-decoration:underline; text-decoration-color:rgba(251,250,247,0.6); text-underline-offset:0.35em;"
          >Media</a>
          <a
            href="#writing"
            style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.86rem; font-weight:500; color:#FBFAF7; text-decoration:none;"
            data-hover="text-decoration:underline; text-decoration-color:rgba(251,250,247,0.6); text-underline-offset:0.35em;"
          >Writing</a>
        </nav>
      </div>
      <a
        href="#contact"
        style="font-family:'Instrument Sans', Arial, sans-serif; font-size:0.86rem; font-weight:500; color:#FBFAF7; text-decoration:none; border:1px solid rgba(251,250,247,0.65); padding:0.6rem 1.15rem; min-height:44px; box-sizing:border-box; display:inline-flex; align-items:center; transition:background 0.18s cubic-bezier(0.4,0,0.2,1), color 0.18s cubic-bezier(0.4,0,0.2,1), border-color 0.18s cubic-bezier(0.4,0,0.2,1);"
        data-hover="background:#FBFAF7; color:#17181A; border-color:#FBFAF7;"
      >Get in touch</a>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useInlineStates } from '@/composables/useInlineStates'

const root = ref<HTMLElement | null>(null)
useInlineStates(root) // reproduce the nav-link / button hover states
</script>
