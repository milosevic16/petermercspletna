<template>
  <footer style="background:var(--graphite); color:#C9C4B8; padding:clamp(1.8rem, 4vw, 2.6rem) 0 calc(clamp(1.8rem, 4vw, 2.6rem) + 48px);">
    <div style="max-width:76rem; margin:0 auto; padding-left:clamp(1.25rem, 5vw, 4rem); padding-right:clamp(1.25rem, 5vw, 4rem); display:flex; flex-wrap:wrap; align-items:baseline; gap:0.8rem 2.2rem; font-family:'Instrument Sans', Arial, sans-serif; font-size:0.82rem;">
      <span style="color:var(--ivory); font-family:'Spectral', Georgia, serif; font-weight:600; font-size:0.95rem;">Peter Merc<span style="color:var(--accent);">.</span></span>
      <span>{{ c.footer.location }}</span>
      <span>{{ c.footer.emailPrefix }} — <a href="mailto:peter@lemur.legal" style="color:inherit; text-decoration:none; border-bottom:1px dashed #6B665C;">peter@lemur.legal</a></span>
      <span>{{ c.footer.linkedinPrefix }} — <a href="https://www.linkedin.com/in/petermerc/" target="_blank" rel="noopener" style="color:inherit; text-decoration:none; border-bottom:1px dashed #6B665C;">linkedin.com/in/petermerc</a></span>
      <a href="https://lemur.legal" target="_blank" rel="noopener" style="color:#C9C4B8; text-decoration-color:rgba(236,231,220,0.35);">{{ c.footer.lemur }}<svg aria-hidden="true" viewBox="0 0 12 12" width="0.85em" height="0.85em" fill="none" style="display:inline-block; vertical-align:-0.08em; margin-left:0.3em;"><path d="M3.6 8.4L8.4 3.6M8.4 3.6H5M8.4 3.6V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>
      <span style="margin-left:auto;">{{ c.footer.copyright }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { usePageContent } from '@/i18n/useContent'
import chrome from '@/content/chrome'

const c = usePageContent(chrome)
</script>
