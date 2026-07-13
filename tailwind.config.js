/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  // Preflight OFF: the ported CSS carries its own reset (base.css), and Preflight
  // would fight it. (Tailwind v3 only — v4 ignores corePlugins and re-enables it,
  // which is why the install is pinned to ^3.)
  corePlugins: { preflight: false },
  theme: {
    extend: {
      // Map the ported design tokens (declared as CSS custom properties in
      // base.css :root / applied per-view via ROOT_VARS) so utilities and the
      // bespoke inline CSS share one token source.
      colors: {
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        ink2: 'var(--ink2)',
        accent: 'var(--accent)',
        graphite: 'var(--graphite)',
        ivory: 'var(--ivory)',
        ivory2: 'var(--ivory2)',
        line: 'var(--line)',
      },
      fontFamily: {
        serif: ["'Spectral'", 'Georgia', 'serif'],
        sans: ["'Instrument Sans'", 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
