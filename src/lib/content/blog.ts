import 'server-only'

import { z } from 'zod'

import type { Author, BlogPost } from '@/types/content'

import { assertUniqueIds, listSlugs, readJsonEntry, readMdxEntry } from './fs'

// Blog collection + author registry (ADR-0011 §4, ADR-0006). Reading time and word count
// are loader-computed, never frontmatter. Referential integrity (authors, related posts)
// throws at build time. The dynamic /blog/[slug] segment arrives with the first real
// post (ADR-0011 §7); until then these loaders feed the structural index and tests.

const ISO_WITH_OFFSET =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2}|Z)$/

const postSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1).max(160),
  publishedAt: z.string().regex(ISO_WITH_OFFSET, 'ISO 8601 with offset'),
  updatedAt: z.string().regex(ISO_WITH_OFFSET).optional(),
  authors: z.array(z.string().min(1)).min(1),
  category: z.enum([
    'engineering',
    'technology',
    'product',
    'automation',
    'developer',
    'company',
  ]),
  heroImage: z
    .object({
      src: z.string().min(1),
      alt: z.string().min(1),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .optional(),
  relatedTechnologies: z.array(z.string().min(1)).default([]),
  relatedPosts: z.array(z.string().min(1)).max(3).default([]),
  canonicalUrl: z.string().url().optional(),
  draft: z.boolean().default(false),
})

const authorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kind: z.enum(['person', 'org']),
  role: z.string().min(1).optional(),
})

const WORDS_PER_MINUTE = 230

export async function getAuthors(): Promise<Author[]> {
  // Cache boundary (Cache Components) — see offerings.ts loadCategory.
  'use cache'
  const ids = await listSlugs('authors', '.json')
  const authors = await Promise.all(
    ids.map(async (slug) => {
      const author = authorSchema.parse(await readJsonEntry('authors', slug))
      if (author.id !== slug) {
        throw new Error(
          `content/authors/${slug}.json: id "${author.id}" must equal its filename`,
        )
      }
      return author
    }),
  )
  return authors
}

export async function getAuthor(id: string): Promise<Author | undefined> {
  const authors = await getAuthors()
  return authors.find((a) => a.id === id)
}

/** Pure validation step, exported for negative-path tests (ADR-0011 §6 guarantees). */
export function parsePost(
  slug: string,
  frontmatter: unknown,
  body: string,
  authorIds: ReadonlySet<string>,
): BlogPost {
  const parsed = postSchema.parse(frontmatter)
  for (const authorId of parsed.authors) {
    if (!authorIds.has(authorId)) {
      throw new Error(
        `content/blog/${slug}.mdx: unknown author id "${authorId}"`,
      )
    }
  }
  const wordCount = body.split(/\s+/).filter(Boolean).length
  return {
    slug,
    ...parsed,
    wordCount,
    readingTimeMinutes: Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE)),
  }
}

async function loadAllPosts(): Promise<BlogPost[]> {
  // Cache boundary (Cache Components) — see offerings.ts loadCategory.
  'use cache'
  const [slugs, authors] = await Promise.all([listSlugs('blog'), getAuthors()])
  const authorIds = new Set(authors.map((a) => a.id))
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readMdxEntry('blog', slug)
      return parsePost(slug, raw.frontmatter, raw.body, authorIds)
    }),
  )
  assertUniqueIds('blog', posts)
  // relatedPosts referential integrity (ADR-0011 §6): every hand-curated id must exist.
  const postIds = new Set(posts.map((p) => p.id))
  for (const post of posts) {
    for (const related of post.relatedPosts) {
      if (!postIds.has(related)) {
        throw new Error(
          `content/blog/${post.slug}.mdx: relatedPosts id "${related}" does not exist`,
        )
      }
    }
  }
  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export async function getPosts(options?: {
  includeDrafts?: boolean
}): Promise<BlogPost[]> {
  const all = await loadAllPosts()
  return options?.includeDrafts ? all : all.filter((p) => !p.draft)
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await getPosts()
  return posts.find((p) => p.slug === slug)
}

/** Only published, registered slugs may reach the filesystem. */
export async function getPostBody(slug: string): Promise<string | undefined> {
  'use cache'
  const post = await getPost(slug)
  if (!post) return undefined
  return (await readMdxEntry('blog', post.slug)).body
}

/**
 * Category lazy rule (ADR-0006 §3, pure — 06e): a category PAGE may render only once
 * the category has >= 3 published posts; below that, category names appear only as
 * per-post labels. No tag pages, ever. The /blog/category/[category] route itself is
 * created in the phase where the first category qualifies (empty params cannot build
 * under Cache Components — same ADR-0011 §7 rule as /blog/[slug]).
 */
export function categoriesWithPages(
  posts: readonly Pick<BlogPost, 'category' | 'draft'>[],
): string[] {
  const counts = new Map<string, number>()
  for (const post of posts) {
    if (post.draft) continue
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1)
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= 3)
    .map(([category]) => category)
    .sort()
}
