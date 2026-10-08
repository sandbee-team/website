import type { MetadataRoute } from 'next'

import { getLaunchRoutes } from '@/lib/seo/routes'
import { SITE_URL } from '@/lib/seo/site'

// Sitemap from the launch route registry (ADR-0007 §3): real content dates only as
// lastModified; priority/changeFrequency deliberately omitted — Google ignores them.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = await getLaunchRoutes()
  return routes.map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    ...(route.lastModified ? { lastModified: route.lastModified } : {}),
  }))
}
