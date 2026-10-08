import type {
  Blog,
  BlogPosting,
  BreadcrumbList,
  Organization,
  Service,
  SoftwareApplication,
  TechArticle,
  Thing,
  WebSite,
  WithContext,
} from 'schema-dts'

import type {
  Author,
  BlogPost,
  Breadcrumb,
  Offering,
  Story,
} from '@/types/content'

import { SITE_URL } from './site'

/*
 * JSON-LD builders (ADR-0007 §3, ADR-0006 R5, research R5). Rendered via a native
 * <script type="application/ld+json"> element — never next/script:
 *   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
 * NEVER emit `offers` or `aggregateRating` — no public prices or reviews exist (facts
 * boundary, Q7); the unit suite deep-scans every builder's output for those keys.
 * The Organization deliberately has no `logo` until Q2 supplies the final file.
 */

export function jsonLd<T extends Thing>(data: WithContext<T>): string {
  // '<' is escaped so user-influenced strings can never close the script tag (XSS hygiene).
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function organizationJsonLd(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Sandbee',
    url: SITE_URL,
  }
}

export function webSiteJsonLd(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Sandbee',
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}

export function breadcrumbListJsonLd(
  breadcrumbs: Breadcrumb[],
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: new URL(crumb.href, SITE_URL).toString(),
    })),
  }
}

/**
 * Engineering stories: TechArticle with the org author (Q18) — the type decision the
 * 05c contract deferred to the story template, made at 06f (finding F12: the story was
 * the only detail page without primary-entity JSON-LD while emitting og:type=article).
 */
export function storyJsonLd(
  story: Story,
  url: string,
): WithContext<TechArticle> {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: story.title,
    description: story.summary,
    datePublished: story.publishedAt,
    author: [{ '@type': 'Organization', name: 'Sandbee' }],
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: url,
  }
}

/** Blog node for the index (ADR-0006 §6) — name/url/publisher only, mirroring chrome. */
export function blogJsonLd(): WithContext<Blog> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog#blog`,
    name: 'Sandbee Blog',
    url: `${SITE_URL}/blog`,
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}

/** BlogPosting; TechArticle for engineering deep-dives (research R5, ADR-0006 §5). */
export function blogPostingJsonLd(
  post: BlogPost,
  authors: Author[],
  url: string,
): WithContext<BlogPosting | TechArticle> {
  return {
    '@context': 'https://schema.org',
    '@type': post.category === 'engineering' ? 'TechArticle' : 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    author: authors.map((author) =>
      author.kind === 'org'
        ? { '@type': 'Organization' as const, name: author.name }
        : { '@type': 'Person' as const, name: author.name },
    ),
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: url,
    articleSection: post.category,
    wordCount: post.wordCount,
  }
}

/**
 * Offering pages: Service for services, SoftwareApplication for products and
 * packages/SDKs (research R5). No offers/aggregateRating, ever.
 */
export function offeringJsonLd(
  offering: Offering,
  url: string,
): WithContext<Service | SoftwareApplication> {
  const base = {
    name: offering.name,
    description: offering.oneLiner,
    url,
    provider: { '@id': `${SITE_URL}/#organization` },
  }
  if (offering.category === 'service') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      ...base,
    }
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    ...base,
  }
}
