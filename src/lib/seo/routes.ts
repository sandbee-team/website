import 'server-only'

import { getOfferings, getPosts, getStories } from '@/lib/content'

/*
 * Launch route registry (ADR-0005 + ADR-0011): the single list the sitemap derives
 * from. Encodes the LAUNCH contract — the temporary placeholder-period noindex meta on
 * pages is the per-page override that phases 05/06 lift; the registry stays stable.
 * Exclusions, deliberate: /styleguide (internal, 03a) and /privacy + /terms (published
 * only when Q8 supplies real legal text — a sitemap must not advertise placeholder
 * legal pages). lastModified appears ONLY where a real content date exists (stories,
 * blog posts) — never an invented date (facts discipline).
 */

export interface RegisteredRoute {
  /** Site-relative path with a leading slash. */
  path: string
  /** ISO date — only for entries whose content carries a real date. */
  lastModified?: string
}

const STATIC_ROUTES: string[] = [
  '/',
  '/products',
  '/packages',
  '/pricing',
  '/services',
  '/technology',
  '/custom-technology',
  '/company',
  '/stories',
  '/blog',
  '/contact',
]

export async function getLaunchRoutes(): Promise<RegisteredRoute[]> {
  const [offerings, stories, posts] = await Promise.all([
    getOfferings(),
    getStories(),
    getPosts(),
  ])
  const categoryPrefix = {
    product: '/products',
    service: '/services',
    package: '/technology',
  } as const
  // 06f F14: /blog is a thin page while zero posts exist (ADR-0005) — noindex pages
  // must not be advertised; the first real post restores it (06e first-post checklist).
  const staticRoutes =
    posts.length === 0
      ? STATIC_ROUTES.filter((path) => path !== '/blog')
      : STATIC_ROUTES
  return [
    ...staticRoutes.map((path) => ({ path })),
    ...offerings.map((o) => ({
      path: `${categoryPrefix[o.category]}/${o.slug}`,
    })),
    ...stories.map((s) => ({
      path: `/stories/${s.slug}`,
      lastModified: s.publishedAt,
    })),
    // Zero at launch (ADR-0006); the first real post appears here automatically.
    ...posts.map((p) => ({
      path: `/blog/${p.slug}`,
      lastModified: p.updatedAt ?? p.publishedAt,
    })),
  ]
}
