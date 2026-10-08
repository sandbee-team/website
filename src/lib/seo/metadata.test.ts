import { describe, expect, it } from 'vitest'

import { buildPageMetadata } from './metadata'

describe('buildPageMetadata', () => {
  it('returns complete openGraph/twitter/robots objects with an absolute canonical', () => {
    const metadata = buildPageMetadata({
      title: 'POS',
      description: 'Description.',
      path: '/products/pos',
    })
    expect(metadata.alternates?.canonical).toBe(
      'https://sandbee.in/products/pos',
    )
    expect(metadata.openGraph).toMatchObject({
      type: 'website',
      siteName: 'Sandbee',
      title: 'POS',
      description: 'Description.',
      url: 'https://sandbee.in/products/pos',
    })
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'POS',
    })
    expect(metadata.robots).toMatchObject({
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    })
  })

  it('carries article fields for ogType article', () => {
    const metadata = buildPageMetadata({
      title: 'A post',
      description: 'Summary.',
      path: '/blog/a-post',
      ogType: 'article',
      article: {
        publishedTime: '2026-09-01T00:00:00+05:30',
        authors: ['Sandbee'],
        section: 'engineering',
      },
    })
    expect(metadata.openGraph).toMatchObject({
      type: 'article',
      publishedTime: '2026-09-01T00:00:00+05:30',
      authors: ['Sandbee'],
      section: 'engineering',
    })
  })

  it('noindex contract flips the complete robots object', () => {
    const metadata = buildPageMetadata({
      title: 'Privacy',
      description: 'Pending.',
      path: '/privacy',
      noindex: true,
    })
    expect(metadata.robots).toEqual({ index: false, follow: false })
  })
})
