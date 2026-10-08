import { describe, expect, it } from 'vitest'

import type { Author, BlogPost, Offering, Story } from '@/types/content'

import { buildBreadcrumbs } from './breadcrumbs'
import {
  blogJsonLd,
  blogPostingJsonLd,
  breadcrumbListJsonLd,
  jsonLd,
  offeringJsonLd,
  organizationJsonLd,
  storyJsonLd,
  webSiteJsonLd,
} from './json-ld'

// Deep-scan any JSON-LD object for keys the facts boundary forbids (ADR-0006 R5, Q7).
function forbiddenKeys(value: unknown): string[] {
  const found: string[] = []
  const walk = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(walk)
    if (node && typeof node === 'object') {
      for (const [key, child] of Object.entries(node)) {
        if (key === 'offers' || key === 'aggregateRating') found.push(key)
        walk(child)
      }
    }
  }
  walk(value)
  return found
}

const offering: Offering = {
  id: 'pos',
  slug: 'pos',
  name: 'POS',
  category: 'product',
  oneLiner: 'One line.',
  exampleDelivery: 'Private managed deployment',
  commercialDirection: 'One-time setup; support',
  access: 'Access',
  deliveryModel: 'managed-deployment',
  order: 1,
  summary: 'Summary.',
  draft: false,
}

const post: BlogPost = {
  id: 'p1',
  slug: 'p1',
  title: 'A post',
  summary: 'Summary.',
  publishedAt: '2026-09-01T00:00:00+05:30',
  authors: ['sandbee'],
  category: 'engineering',
  relatedTechnologies: [],
  relatedPosts: [],
  draft: false,
  readingTimeMinutes: 2,
  wordCount: 400,
}

const story: Story = {
  id: 's1',
  slug: 's1',
  title: 'A story',
  summary: 'Summary.',
  publishedAt: '2026-09-01',
  relatedOfferings: [],
  draft: false,
}

const orgAuthor: Author = { id: 'sandbee', name: 'Sandbee', kind: 'org' }

describe('json-ld builders', () => {
  it('every builder emits valid JSON with zero forbidden fields', () => {
    const outputs = [
      organizationJsonLd(),
      webSiteJsonLd(),
      breadcrumbListJsonLd(
        buildBreadcrumbs([{ name: 'Products', href: '/products' }]),
      ),
      blogJsonLd(),
      storyJsonLd(story, 'https://sandbee.in/stories/s1'),
      blogPostingJsonLd(post, [orgAuthor], 'https://sandbee.in/blog/p1'),
      offeringJsonLd(offering, 'https://sandbee.in/products/pos'),
      offeringJsonLd(
        { ...offering, category: 'service' },
        'https://sandbee.in/services/x',
      ),
    ]
    for (const output of outputs) {
      const parsed = JSON.parse(jsonLd(output))
      expect(parsed['@context']).toBe('https://schema.org')
      expect(forbiddenKeys(parsed)).toEqual([])
    }
  })

  it('maps categories to schema types per research R5', () => {
    expect(offeringJsonLd(offering, 'u')['@type']).toBe('SoftwareApplication')
    expect(
      offeringJsonLd({ ...offering, category: 'service' }, 'u')['@type'],
    ).toBe('Service')
    expect(
      offeringJsonLd({ ...offering, category: 'package' }, 'u')['@type'],
    ).toBe('SoftwareApplication')
    expect(blogPostingJsonLd(post, [orgAuthor], 'u')['@type']).toBe(
      'TechArticle',
    )
    expect(
      blogPostingJsonLd({ ...post, category: 'company' }, [orgAuthor], 'u')[
        '@type'
      ],
    ).toBe('BlogPosting')
  })

  it('renders org bylines as Organization, people as Person', () => {
    const output = blogPostingJsonLd(
      post,
      [orgAuthor, { id: 'x', name: 'X', kind: 'person' }],
      'u',
    )
    expect(output.author).toEqual([
      { '@type': 'Organization', name: 'Sandbee' },
      { '@type': 'Person', name: 'X' },
    ])
  })

  it('numbers breadcrumb positions from 1 with absolute items', () => {
    const output = breadcrumbListJsonLd(
      buildBreadcrumbs([{ name: 'Products', href: '/products' }]),
    )
    expect(output.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://sandbee.in/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: 'https://sandbee.in/products',
      },
    ])
  })

  it('escapes < so content can never close the script tag', () => {
    const output = jsonLd({
      '@context': 'https://schema.org',
      '@type': 'Thing',
      name: '</script><script>alert(1)</script>',
    })
    expect(output).not.toContain('</script>')
  })
})
