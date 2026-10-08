import { describe, expect, it } from 'vitest'

import { parsePost } from './blog'
import { assertUniqueIds } from './fs'
import { parseOffering } from './offerings'

// Negative-path tests for the referential-integrity guarantees ADR-0011 §6 claims —
// the happy-path fixture tests alone would let a refactor silently drop these throws
// (04a qa-review finding).

const validOffering = {
  id: 'example',
  name: 'Example',
  category: 'product',
  oneLiner: 'One line.',
  exampleDelivery: 'Delivery',
  commercialDirection: 'Direction',
  access: 'Access',
  deliveryModel: 'managed-deployment',
  order: 1,
  summary: 'Summary.',
  draft: false,
}

describe('parseOffering', () => {
  it('throws when the category does not match its directory', () => {
    expect(() =>
      parseOffering('services', 'example', validOffering, 'service'),
    ).toThrow(/does not match its directory/)
  })

  it('rejects an unknown status label', () => {
    expect(() =>
      parseOffering(
        'products',
        'example',
        { ...validOffering, status: 'live' },
        'product',
      ),
    ).toThrow()
  })
})

const validPost = {
  id: 'post-a',
  title: 'Title',
  summary: 'Summary.',
  publishedAt: '2026-09-01T00:00:00+05:30',
  authors: ['sandbee'],
  category: 'engineering',
  draft: true,
}

describe('parsePost', () => {
  it('throws on an unknown author id', () => {
    expect(() =>
      parsePost('post-a', validPost, 'body', new Set(['someone-else'])),
    ).toThrow(/unknown author id "sandbee"/)
  })

  it('rejects more than three related posts (ADR-0006)', () => {
    expect(() =>
      parsePost(
        'post-a',
        { ...validPost, relatedPosts: ['a', 'b', 'c', 'd'] },
        'body',
        new Set(['sandbee']),
      ),
    ).toThrow()
  })

  it('rejects a summary over 160 characters', () => {
    expect(() =>
      parsePost(
        'post-a',
        { ...validPost, summary: 'x'.repeat(161) },
        'body',
        new Set(['sandbee']),
      ),
    ).toThrow()
  })

  it('computes reading time from the body, never frontmatter', () => {
    const post = parsePost(
      'post-a',
      validPost,
      'word '.repeat(500),
      new Set(['sandbee']),
    )
    expect(post.wordCount).toBe(500)
    expect(post.readingTimeMinutes).toBe(3)
  })
})

describe('assertUniqueIds', () => {
  it('throws on a duplicate id across two slugs', () => {
    expect(() =>
      assertUniqueIds('offerings', [
        { id: 'same', slug: 'first' },
        { id: 'same', slug: 'second' },
      ]),
    ).toThrow(/duplicate id "same"/)
  })

  it('accepts unique ids', () => {
    expect(() =>
      assertUniqueIds('offerings', [
        { id: 'a', slug: 'a' },
        { id: 'b', slug: 'b' },
      ]),
    ).not.toThrow()
  })
})
