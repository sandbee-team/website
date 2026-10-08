import { describe, expect, it } from 'vitest'

import { getAuthor, getAuthors, getPost, getPostBody, getPosts } from './blog'

describe('author registry', () => {
  it('holds only the Sandbee org byline until Q18 names people', async () => {
    const authors = await getAuthors()
    expect(authors).toEqual([{ id: 'sandbee', name: 'Sandbee', kind: 'org' }])
    expect((await getAuthor('sandbee'))?.kind).toBe('org')
  })
})

describe('blog loader', () => {
  it('publishes the three authored articles and excludes the draft fixture', async () => {
    const posts = await getPosts()
    expect(posts.map(({ slug }) => slug).sort()).toEqual([
      'customer-hosted-ocr-integration',
      'hosted-api-or-installed-sdk',
      'pos-deployment-handover-checklist',
    ])
    expect(posts.every((post) => !post.draft)).toBe(true)
    expect(await getPost('loader-fixture')).toBeUndefined()
  })

  it('parses the draft fixture with computed reading time (includeDrafts)', async () => {
    const post = (await getPosts({ includeDrafts: true })).find(
      (entry) => entry.id === 'loader-fixture',
    )!
    expect(post.authors).toEqual(['sandbee'])
    expect(post.category).toBe('engineering')
    expect(post.wordCount).toBeGreaterThan(0)
    expect(post.readingTimeMinutes).toBeGreaterThanOrEqual(1)
    expect(post.summary.length).toBeLessThanOrEqual(160)
  })

  it('exposes a body only for a published slug, including for hostile input', async () => {
    expect(await getPostBody('customer-hosted-ocr-integration')).toContain(
      '## Confirm the runtime before integration',
    )
    for (const slug of [
      'loader-fixture',
      'missing',
      '../authors/sandbee',
      'constructor',
    ]) {
      expect(await getPostBody(slug)).toBeUndefined()
    }
  })
})
