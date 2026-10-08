import { describe, expect, it } from 'vitest'

import { buildFeedXml } from './feed'

describe('buildFeedXml', () => {
  it('emits a valid empty channel at launch (zero posts)', () => {
    const xml = buildFeedXml([])
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain('<title>Sandbee Blog</title>')
    expect(xml).toContain('<link>https://sandbee.in/blog</link>')
    expect(xml).not.toContain('<item>')
  })

  it('renders items with escaped content and RFC 822 dates', () => {
    const xml = buildFeedXml([
      {
        slug: 'a-post',
        title: 'Signals & <systems>',
        summary: 'A & B',
        publishedAt: '2026-09-01T00:00:00+05:30',
      },
    ])
    expect(xml).toContain('<title>Signals &amp; &lt;systems&gt;</title>')
    expect(xml).toContain(
      '<guid isPermaLink="true">https://sandbee.in/blog/a-post</guid>',
    )
    expect(xml).toMatch(/<pubDate>[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4}/)
  })
})
