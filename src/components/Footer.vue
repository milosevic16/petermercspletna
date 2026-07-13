<template>
  <footer style="background:var(--graphite); color:#C9C4B8; padding:clamp(1.8rem, 4vw, 2.6rem) 0 calc(clamp(1.8rem, 4vw, 2.6rem) + 48px);">
    <div style="max-width:76rem; margin:0 auto; padding-left:clamp(1.25rem, 5vw, 4rem); padding-right:clamp(1.25rem, 5vw, 4rem); display:flex; flex-wrap:wrap; align-items:baseline; gap:0.8rem 2.2rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.82rem;">
      <span style="color:var(--ivory); font-family:'Spectral', Georgia, serif; font-weight:600; font-size:0.95rem;">Peter Merc<span style="color:var(--accent);">.</span></span>
      <span>{{ c.footer.location }}</span>
      <span>{{ c.footer.emailPrefix }} — <span style="border-bottom:1px dashed #6B665C;">{{ c.footer.toConfirm }}</span></span>
      <span>{{ c.footer.linkedinPrefix }} — <span style="border-bottom:1px dashed #6B665C;">{{ c.footer.toConfirm }}</span></span>
      <a href="https://lemur.legal" target="_blank" rel="noopener" style="color:#C9C4B8; text-decoration-color:rgba(236,231,220,0.35);">{{ c.footer.lemur }}</a>
      <span style="margin-left:auto;">{{ c.footer.copyright }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { usePageContent } from '@/i18n/useContent'
import chrome from '@/content/chrome'

const c = usePageContent(chrome)
</script>
