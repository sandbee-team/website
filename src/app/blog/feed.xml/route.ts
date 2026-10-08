import { getPosts } from '@/lib/content'
import { buildFeedXml } from '@/lib/seo/feed'

// RSS feed from the same blog loader (ADR-0006 §6): Route Handler because Next has no
// feed convention. Zero items at launch; the first real post appears automatically.
export async function GET() {
  const posts = await getPosts()
  return new Response(buildFeedXml(posts), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
