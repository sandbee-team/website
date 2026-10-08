import { getAuthors, getPost, getPostBody, getPosts } from '@/lib/content'
import { SITE_URL } from '@/lib/seo/site'

export async function generateStaticParams() {
  return (await getPosts()).map(({ slug }) => ({ slug }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const post = await getPost(slug)
  const body = post ? await getPostBody(slug) : undefined
  if (!post || !body) {
    return new Response('Article not found.', { status: 404 })
  }
  const authors = (await getAuthors())
    .filter((author) => post.authors.includes(author.id))
    .map(({ name }) => name)
    .join(', ')
  const canonical = new URL(`/blog/${post.slug}`, SITE_URL).toString()
  const markdown = [
    `# ${post.title}`,
    post.summary,
    `By ${authors} | Published ${post.publishedAt.slice(0, 10)} | ${post.readingTimeMinutes} min read`,
    ...(post.updatedAt ? [`Updated ${post.updatedAt.slice(0, 10)}`] : []),
    `Canonical: ${canonical}`,
    body.trim(),
    '',
  ].join('\n\n')

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, follow',
      Link: `<${canonical}>; rel="canonical"`,
    },
  })
}
