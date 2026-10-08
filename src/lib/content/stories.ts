import 'server-only'

import { z } from 'zod'

import type { Story } from '@/types/content'

import { assertUniqueIds, listSlugs, readMdxEntry } from './fs'

// Stories collection (ADR-0011 §3, ADR-0005, spec §13). Launch fixture: the Electron
// tracking story, written only in reference §3.3/§9 wording (Q9 default; 05c owns the
// full telling).

const storySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'ISO 8601 calendar date (YYYY-MM-DD)'),
  relatedOfferings: z.array(z.string().min(1)).default([]),
  draft: z.boolean().default(false),
})

async function loadAll(): Promise<Story[]> {
  // Cache boundary (Cache Components) — see offerings.ts loadCategory.
  'use cache'
  const slugs = await listSlugs('stories')
  const stories = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readMdxEntry('stories', slug)
      const story: Story = { slug, ...storySchema.parse(raw.frontmatter) }
      return story
    }),
  )
  assertUniqueIds('stories', stories)
  return stories.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export async function getStories(options?: {
  includeDrafts?: boolean
}): Promise<Story[]> {
  const all = await loadAll()
  return options?.includeDrafts ? all : all.filter((s) => !s.draft)
}

export async function getStory(slug: string): Promise<Story | undefined> {
  const stories = await getStories()
  return stories.find((s) => s.slug === slug)
}

/** generateStaticParams source for /stories/[story] (ADR-0011 §7). */
export async function getStoryParams(): Promise<Array<{ story: string }>> {
  const stories = await getStories()
  return stories.map((s) => ({ story: s.slug }))
}
