<template>
  <!-- #pm-root: the original design-token wrapper. Tokens live on :root (base.css
       default + each view's ROOT_VARS); this wrapper only consumes them. -->
  <div id="pm-root" style="background:var(--paper); color:var(--ink); font-family:'Spectral', Georgia, serif; min-height:100svh;">
    <a
      ref="skip"
      href="#main"
      style="position:absolute; left:-9999px; top:0.75rem; z-index:100; background:#17181A; color:#ECE7DC; padding:0.7rem 1.1rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.85rem; text-decoration:none;"
      data-focus="left:0.75rem;"
    >Skip to content</a>
    <Masthead />
    <slot />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Masthead from './Masthead.vue'
import Footer from './Footer.vue'
import { useInlineStates } from '@/composables/useInlineStates'

// The skip link reveals itself on focus (style-focus -> data-focus).
const skip = ref<HTMLElement | null>(null)
useInlineStates(skip)
</script>
