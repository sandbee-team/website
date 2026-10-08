import 'server-only'

import { promises as fs } from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'

// Internal filesystem access for src/lib/content/ — the ONLY modules allowed to read the
// content tree (ADR-0007 §2, ADR-0011 §6). Not exported from the collection barrel.

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content')

export interface RawEntry {
  /** URL segment = filename without extension (ADR-0011 §5). */
  slug: string
  frontmatter: Record<string, unknown>
  /** Raw MDX body (rendering is 04b's concern; loaders use it for word counts only). */
  body: string
}

export async function listSlugs(
  dir: string,
  extension = '.mdx',
): Promise<string[]> {
  const entries = await fs.readdir(path.join(CONTENT_ROOT, dir))
  return entries
    .filter((f) => f.endsWith(extension))
    .map((f) => f.slice(0, -extension.length))
    .sort()
}

export async function readMdxEntry(
  dir: string,
  slug: string,
): Promise<RawEntry> {
  const raw = await fs.readFile(
    path.join(CONTENT_ROOT, dir, `${slug}.mdx`),
    'utf8',
  )
  const { data, content } = matter(raw)
  return { slug, frontmatter: data, body: content }
}

export async function readJsonEntry(
  dir: string,
  slug: string,
): Promise<unknown> {
  const raw = await fs.readFile(
    path.join(CONTENT_ROOT, dir, `${slug}.json`),
    'utf8',
  )
  return JSON.parse(raw)
}

/** Loader-level referential guard: every id in a collection must be unique (ADR-0011 §5). */
export function assertUniqueIds(
  collection: string,
  entries: Array<{ id: string; slug: string }>,
): void {
  const seen = new Map<string, string>()
  for (const entry of entries) {
    const existing = seen.get(entry.id)
    if (existing) {
      throw new Error(
        `content/${collection}: duplicate id "${entry.id}" in "${existing}" and "${entry.slug}"`,
      )
    }
    seen.set(entry.id, entry.slug)
  }
}
