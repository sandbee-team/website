// Sandbee-owned content types (ADR-0007 §2, ADR-0011): pages import these, never a tool
// API. Stable ids, ISO dates, relations by id, no layout information in frontmatter.

export type OfferingCategory = 'product' | 'service' | 'package'

/** Typed Atlas delivery edge (ADR-0004 graft 8; reference §4's three delivery modes). */
export type DeliveryModel =
  'managed-deployment' | 'hosted-service' | 'package-access'

/** Per-offering status label — assigned by the user (Q6); absent until then. */
export type OfferingStatus = 'available' | 'in-development' | 'direction'

export interface Offering {
  /** Stable identifier — never derived from the file path, never reused. */
  id: string
  /** URL segment (equals the filename). */
  slug: string
  name: string
  category: OfferingCategory
  /** One-line job, reference-traceable. */
  oneLiner: string
  /** Reference §15 "Example delivery" column. */
  exampleDelivery: string
  /** Reference §15 "Example commercial direction" column. */
  commercialDirection: string
  /** Reference §8 access step, in §3 wording (e.g. build + API key). */
  access: string
  deliveryModel: DeliveryModel
  status?: OfferingStatus
  /** Curated index order (reference §15 table order). */
  order: number
  summary: string
  draft: boolean
}

export interface Story {
  id: string
  slug: string
  title: string
  summary: string
  /** ISO 8601 calendar date (YYYY-MM-DD). */
  publishedAt: string
  /** Offering ids this story relates to. */
  relatedOfferings: string[]
  draft: boolean
}

export type BlogCategory =
  | 'engineering'
  | 'technology'
  | 'product'
  | 'automation'
  | 'developer'
  | 'company'

export interface Author {
  id: string
  name: string
  kind: 'person' | 'org'
  role?: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  /** ≤160 chars; doubles as the meta description (ADR-0006). */
  summary: string
  /** ISO 8601 with timezone offset. */
  publishedAt: string
  updatedAt?: string
  /** Author ids from the registry (≥1). */
  authors: string[]
  category: BlogCategory
  heroImage?: { src: string; alt: string; width: number; height: number }
  /** Offering ids (ADR-0006 "related technologies"). */
  relatedTechnologies: string[]
  /** Hand-curated post ids, max 3 (ADR-0006). */
  relatedPosts: string[]
  canonicalUrl?: string
  draft: boolean
  /** Loader-computed, never hand-typed (ADR-0006). */
  readingTimeMinutes: number
  wordCount: number
}

export interface Breadcrumb {
  name: string
  /** Site-relative path ("/" for home). */
  href: string
}
