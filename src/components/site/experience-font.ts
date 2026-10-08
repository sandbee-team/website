import localFont from 'next/font/local'

// Barlow Condensed 600, Google Fonts Latin subset, SIL OFL (licence in public/fonts).
// A compact architectural display voice; body copy retains Manrope.
export const experienceFont = localFont({
  src: '../../../public/fonts/barlow-condensed-600.woff2',
  weight: '600',
  style: 'normal',
  display: 'swap',
  preload: false,
  variable: '--font-display-brand',
  fallback: ['Arial Narrow', 'Arial', 'sans-serif'],
})
