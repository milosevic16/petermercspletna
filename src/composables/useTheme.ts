// Per-view design tokens. A view declares its complete token set (ROOT_VARS) and
// calls this in onMounted; tokens become inline custom properties on <html>.
// NO cleanup by design: the next view's mount overwrites. Consequence to
// preserve — every view must set the COMPLETE set it depends on, or a var only
// one page sets leaks to the next.
export function useRootVars(vars: Record<string, string>): void {
  const root = document.documentElement
  for (const k in vars) root.style.setProperty(k, vars[k])
}
