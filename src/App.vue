<template>
  <SiteChrome>
    <router-view :key="$route.path" />
  </SiteChrome>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import SiteChrome from '@/components/SiteChrome.vue'

const router = useRouter()

// SPA link interception: same-origin absolute-path <a> clicks become router
// pushes. Hash links, external URLs, mailto/tel, protocol-relative, targeted,
// and modified clicks fall through to the browser. New internal links are plain
// <a href="/path"> — this handles them, no <router-link> needed.
function onDocumentClick(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const anchor = (e.target as Element | null)?.closest('a')
  if (!anchor) return
  const target = anchor.getAttribute('target')
  if (target && target !== '_self') return
  const href = anchor.getAttribute('href')
  // skip: missing, protocol-relative (//), scheme (mailto:/tel:/http:), and
  // anything not an absolute internal path (leaves #hash + relative to browser)
  if (!href || href.startsWith('//') || /^[a-z][\w+.-]*:/i.test(href) || !href.startsWith('/')) return
  e.preventDefault()
  void router.push(href)
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))
</script>

<style>
/* Small page-entry animation, replayed on every navigation via router-view :key. */
@keyframes pm-main-enter {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
#main { animation: pm-main-enter 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
@media (prefers-reduced-motion: reduce) {
  #main { animation: none; }
}
</style>
