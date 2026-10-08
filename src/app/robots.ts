import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo/site'

// Robots (ADR-0007 §3): everything crawlable except the internal styleguide surface
// (which is additionally noindex; the disallow keeps crawlers from spending on it).
// Placeholder-period pages control indexing via their own robots meta, not here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/styleguide' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
