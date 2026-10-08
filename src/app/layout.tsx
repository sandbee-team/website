import type { Metadata, Viewport } from 'next'

import { SiteFooter, SiteHeader, SkipLink } from '@/components/site'
import { jsonLd, organizationJsonLd, webSiteJsonLd } from '@/lib/seo/json-ld'
import { SITE_URL } from '@/lib/seo/site'

import { fontSans, fontSerif } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sandbee',
    template: '%s — Sandbee',
  },
  // Real default (06f F15 — the phase-01 placeholder shipped on /404, /privacy,
  // /terms, /styleguide via this fallback). Source: reference §1/§16.
  description:
    'Sandbee is a technology company that builds, packages, manages and sells software — products, services, and developer packages/SDKs/APIs.',
}

// viewport/themeColor must be a separate export — deprecated inside `metadata` since Next 14.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontSerif.variable}`}>
      {/* Reduced-motion plumbing lives at the token/CSS level in globals.css. The
          Motion stack (LazyMotion strict + MotionConfig reducedMotion="user",
          ADR-0007 §6) wraps only the engine-ledger stepper island, not the root layout,
          so routes without a Motion surface keep zero motion JS. */}
      {/* Sticky-footer column: short pages keep the footer at the viewport bottom. */}
      <body className="flex min-h-dvh flex-col bg-canvas text-ink">
        {/* Site-wide identity graph on EVERY page so per-page JSON-LD can reference
            #organization by @id without dangling (04b review finding — @id references
            resolve within a single page's graph only, never across fetches). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(webSiteJsonLd()) }}
        />
        <SkipLink />
        <SiteHeader />
        {/* The layout owns the main landmark; pages render content only. */}
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
