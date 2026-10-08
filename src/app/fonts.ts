import localFont from 'next/font/local'

/*
 * Type stack (ADR-0017; record .memory/visual-direction/2026-09-11-ui-rebuild-system.md):
 * Manrope variable (wordmark, headings, navigation, body, buttons) + Instrument Serif
 * Regular (one editorial accent phrase per section, display sizes only). Both are
 * Google Fonts latin subsets, OFL — licences in public/fonts/LICENSES/. Exactly two
 * served files (~46 KB total). Code uses the system monospace stack (no download).
 *
 * Preload policy (plan §3: "measure the actual LCP text's font requirement"): the LCP
 * element is Manrope text on both tiers (h1 on desktop, the hero intro on mobile), so
 * only Manrope is preloaded. The serif carries a single display phrase and swaps over a
 * Times-adjusted fallback (metric-compatible fallback keeps the swap from moving layout).
 */
export const fontSans = localFont({
  src: '../../public/fonts/manrope-var.woff2',
  weight: '200 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-sans-brand',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
})

export const fontSerif = localFont({
  src: '../../public/fonts/instrument-serif-400.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  preload: false,
  variable: '--font-serif-brand',
  adjustFontFallback: 'Times New Roman',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})
