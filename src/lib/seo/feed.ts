import { SITE_URL } from './site'

// RSS 2.0 XML builder (ADR-0006 §6, research L8) — pure and unit-tested; the
// /blog/feed.xml Route Handler feeds it from the blog loader. Valid with zero items.

export interface FeedPost {
  slug: string
  title: string
  summary: string
  /** ISO 8601 with offset. */
  publishedAt: string
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildFeedXml(posts: FeedPost[]): string {
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.summary)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sandbee Blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Useful technical and company knowledge from Sandbee.</description>
${items}
  </channel>
</rss>
`
}
