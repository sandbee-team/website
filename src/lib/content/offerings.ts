import 'server-only'

import { z } from 'zod'

import type { Offering, OfferingCategory } from '@/types/content'

import { assertUniqueIds, listSlugs, readMdxEntry } from './fs'

// Offerings collection (ADR-0011 §2): one schema across three directories; the category
// field must match its directory (loader-enforced). The Atlas derives from this
// collection — nodes = offerings, edges typed by deliveryModel (ADR-0004 graft 8).

const offeringSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(['product', 'service', 'package']),
  oneLiner: z.string().min(1),
  exampleDelivery: z.string().min(1),
  commercialDirection: z.string().min(1),
  access: z.string().min(1),
  deliveryModel: z.enum([
    'managed-deployment',
    'hosted-service',
    'package-access',
  ]),
  // Absent until the user assigns labels (Q6); no CTA renders while unset.
  status: z.enum(['available', 'in-development', 'direction']).optional(),
  order: z.number().int().nonnegative(),
  summary: z.string().min(1),
  draft: z.boolean().default(false),
})

const CATEGORY_DIRS: Record<OfferingCategory, string> = {
  product: 'products',
  service: 'services',
  package: 'technology',
}

/** Pure validation step, exported for negative-path tests (ADR-0011 §6 guarantees). */
export function parseOffering(
  dir: string,
  slug: string,
  frontmatter: unknown,
  expectedCategory: OfferingCategory,
): Offering {
  const parsed = offeringSchema.parse(frontmatter)
  if (parsed.category !== expectedCategory) {
    throw new Error(
      `content/${dir}/${slug}.mdx: category "${parsed.category}" does not match its directory (expected "${expectedCategory}")`,
    )
  }
  return { slug, ...parsed }
}

async function loadCategory(category: OfferingCategory): Promise<Offering[]> {
  // Cache boundary (Cache Components): filesystem reads are runtime IO otherwise and
  // block prerendering — verified against the Next 16 build error, 2026-09-01.
  'use cache'
  const dir = CATEGORY_DIRS[category]
  const slugs = await listSlugs(dir)
  const offerings = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readMdxEntry(dir, slug)
      return parseOffering(dir, slug, raw.frontmatter, category)
    }),
  )
  return offerings.sort((a, b) => a.order - b.order)
}

export async function getOfferings(
  category?: OfferingCategory,
  options?: { includeDrafts?: boolean },
): Promise<Offering[]> {
  const categories: OfferingCategory[] = category
    ? [category]
    : ['product', 'service', 'package']
  const all = (await Promise.all(categories.map(loadCategory))).flat()
  assertUniqueIds('offerings', all)
  return options?.includeDrafts ? all : all.filter((o) => !o.draft)
}

export async function getOffering(
  category: OfferingCategory,
  slug: string,
): Promise<Offering | undefined> {
  const offerings = await getOfferings(category)
  return offerings.find((o) => o.slug === slug)
}

/** generateStaticParams source for the category's dynamic segment (ADR-0011 §7). */
export async function getOfferingParams(
  category: OfferingCategory,
): Promise<Array<{ slug: string }>> {
  const offerings = await getOfferings(category)
  return offerings.map((o) => ({ slug: o.slug }))
}
