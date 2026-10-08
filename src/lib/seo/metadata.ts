import type { Metadata } from 'next'

import { SITE_URL } from './site'

// The machine-consumable slice of the per-page SEO contract (ADR-0007 §3; the full
// authored contract — intent, heading outline, internal links — lives in
// .memory/content/<route>.md per the seo-content skill and is phase-05 work).
export interface PageSeoContract {
  title: string
  description: string
  /** Route path with a leading slash, e.g. '/products/pos'. */
  path: string
  /** OpenGraph type; articles carry the article fields below. */
  ogType?: 'website' | 'article'
  article?: {
    /** ISO 8601 with offset. */
    publishedTime: string
    modifiedTime?: string
    /** Author display names (registry-resolved, never invented). */
    authors: string[]
    section?: string
    tags?: string[]
  }
  /** Route-relative OG image path; the root opengraph-image.tsx covers pages without one. */
  ogImagePath?: string
  /** Placeholder-period / legal-pending pages set this; indexable pages omit it. */
  noindex?: boolean
}

// Returns COMPLETE openGraph/twitter/robots shapes: Next.js metadata merges shallowly,
// so partial overrides in nested layouts would silently drop sibling fields (ADR-0007 §3).
export function buildPageMetadata(contract: PageSeoContract): Metadata {
  const canonical = new URL(contract.path, SITE_URL).toString()
  const robotsValue = contract.noindex
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large' as const,
        },
      }
  return {
    title: contract.title,
    description: contract.description,
    alternates: { canonical },
    openGraph: {
      type: contract.ogType ?? 'website',
      siteName: 'Sandbee',
      title: contract.title,
      description: contract.description,
      url: canonical,
      ...(contract.ogType === 'article' && contract.article
        ? {
            publishedTime: contract.article.publishedTime,
            modifiedTime: contract.article.modifiedTime,
            authors: contract.article.authors,
            section: contract.article.section,
            tags: contract.article.tags,
          }
        : {}),
      // 06f F16: og:image must ALWAYS be wired — the root /opengraph-image served
      // 200 but nothing referenced it, so every share card rendered blank while
      // twitter:card=summary_large_image reserved the large slot. metadataBase
      // absolutises the path.
      images: [
        {
          url: contract.ogImagePath ?? '/opengraph-image',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: contract.title,
      description: contract.description,
      images: [contract.ogImagePath ?? '/opengraph-image'],
    },
    robots: robotsValue,
  }
}
