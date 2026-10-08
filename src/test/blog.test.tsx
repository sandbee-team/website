import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import BlogPage from '@/app/(marketing)/blog/page'
import ArticlePage, {
  generateMetadata,
  generateStaticParams,
} from '@/app/(marketing)/blog/[slug]/page'
import { GET as getMarkdown } from '@/app/(marketing)/blog/[slug]/article.md/route'
import { BlogArticle } from '@/components/blog/article'
import { categoriesWithPages, getPosts } from '@/lib/content/blog'
import { SITE_URL } from '@/lib/seo/site'
import type { Author, BlogPost } from '@/types/content'

/*
 * 06e checks: blog index fidelity against the 05c deck (.memory/content/blog.md),
 * the ADR-0006 §5 article template (as a component — the /blog/[slug] route ships
 * with the first real post, ADR-0011 §7), and the §3 category lazy rule.
 */
describe('blog index (published article tier)', () => {
  it('renders one h1 and links every published article', async () => {
    render(await BlogPage())
    const h1 = screen.getAllByRole('heading', { level: 1 })
    expect(h1).toHaveLength(1)
    for (const post of await getPosts()) {
      expect(
        screen.getByRole('link', { name: post.title }).getAttribute('href'),
      ).toBe(`/blog/${post.slug}`)
    }
    expect(screen.queryByText(/Blog loader fixture/)).toBeNull()
  })

  it('has no featured slot, pills, search or pagination at this tier (ADR-0006 §2)', async () => {
    const { container } = render(await BlogPage())
    expect(
      container.querySelector('input[type="search"], input[type="text"]'),
    ).toBeNull()
    expect(container.textContent).not.toMatch(/Featured|Load more|Page \d/i)
    expect(
      container.querySelectorAll('a[href^="/blog/"]').length,
    ).toBeGreaterThanOrEqual(3)
  })

  it('links the RSS feed and emits Blog + BreadcrumbList JSON-LD', async () => {
    const { container } = render(await BlogPage())
    expect(
      container.querySelector('a[href="/blog/feed.xml"]')?.getAttribute('href'),
    ).toBe('/blog/feed.xml')
    const scripts = Array.from(
      container.querySelectorAll('script[type="application/ld+json"]'),
    ).map((node) => node.innerHTML)
    const types = scripts.map((raw) => JSON.parse(raw)['@type'])
    expect(types).toContain('Blog')
    expect(types).toContain('BreadcrumbList')
    for (const raw of scripts) {
      expect(raw).not.toContain('offers')
      expect(raw).not.toContain('aggregateRating')
    }
  })
})

describe('published article routes', () => {
  it('generates every public article with matching metadata and markdown', async () => {
    const posts = await getPosts()
    expect(await generateStaticParams()).toEqual(
      posts.map(({ slug }) => ({ slug })),
    )
    for (const post of posts) {
      const params = Promise.resolve({ slug: post.slug })
      const metadata = await generateMetadata({ params })
      const canonical = `${SITE_URL}/blog/${post.slug}`
      expect(metadata.title).toBe(post.title)
      expect(metadata.description).toBe(post.summary)
      expect(metadata.alternates?.canonical).toBe(canonical)
      expect(metadata.alternates?.types?.['text/markdown']).toBe(
        `${canonical}/article.md`,
      )
      const response = await getMarkdown(
        new Request(`${canonical}/article.md`),
        { params },
      )
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toBe(
        'text/markdown; charset=utf-8',
      )
      expect(response.headers.get('x-robots-tag')).toBe('noindex, follow')
      expect(response.headers.get('link')).toBe(
        `<${canonical}>; rel="canonical"`,
      )
      const markdown = await response.text()
      expect(markdown).toContain(`# ${post.title}`)
      expect(markdown).toContain(`Canonical: ${canonical}`)
      expect(markdown).not.toContain('draft:')
      expect(markdown.match(/^## /gm)).toHaveLength(4)
    }
  })

  it('renders an accessible article shell with schema and correct POS related link', async () => {
    const post = (await getPosts()).find(
      (entry) => entry.id === 'pos-deployment-handover-checklist',
    )!
    const { container } = render(
      await ArticlePage({ params: Promise.resolve({ slug: post.slug }) }),
    )
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      post.title,
    )
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeDefined()
    expect(
      screen
        .getByRole('navigation', { name: 'In this post' })
        .querySelectorAll('a'),
    ).toHaveLength(4)
    expect(
      container.querySelector('section a[href="/products/pos"]'),
    ).not.toBeNull()
    const schemas = [
      ...container.querySelectorAll('script[type="application/ld+json"]'),
    ].map((script) => JSON.parse(script.innerHTML))
    expect(schemas.map((schema) => schema['@type'])).toEqual([
      'BlogPosting',
      'BreadcrumbList',
    ])
    expect(schemas[0].headline).toBe(post.title)
    expect(schemas[0].datePublished).toBe(post.publishedAt)
  })

  it('returns not found for drafts and unknown article slugs', async () => {
    for (const slug of ['loader-fixture', 'does-not-exist', 'constructor']) {
      const params = Promise.resolve({ slug })
      await expect(ArticlePage({ params })).rejects.toThrow(
        'NEXT_HTTP_ERROR_FALLBACK;404',
      )
      await expect(generateMetadata({ params })).rejects.toThrow(
        'NEXT_HTTP_ERROR_FALLBACK;404',
      )
      const response = await getMarkdown(new Request('https://sandbee.in'), {
        params,
      })
      expect(response.status).toBe(404)
    }
  })
})

const org: Author = { id: 'sandbee', name: 'Sandbee', kind: 'org' }
const basePost: BlogPost = {
  id: 'p1',
  slug: 'p1',
  title: 'A future post',
  summary: 'One sentence.',
  publishedAt: '2026-09-01T00:00:00+05:30',
  authors: ['sandbee'],
  category: 'engineering',
  relatedTechnologies: [],
  relatedPosts: [],
  draft: false,
  readingTimeMinutes: 3,
  wordCount: 600,
}

describe('article template (ADR-0006 §5 anatomy)', () => {
  it('renders title, summary, org byline, time, computed reading time and one CTA', () => {
    render(
      <BlogArticle
        post={basePost}
        authors={[org]}
        url="https://sandbee.in/blog/p1"
        body={<p>Body.</p>}
        cta={{ label: 'Talk to Sandbee', href: '/contact' }}
      />,
    )
    expect(screen.getAllByRole('heading', { level: 1 })[0].textContent).toBe(
      'A future post',
    )
    expect(screen.getByText(/Sandbee ·/)).toBeDefined()
    expect(screen.getByText('3 min read', { exact: false })).toBeDefined()
    expect(
      screen
        .getByRole('link', { name: 'Talk to Sandbee' })
        .getAttribute('href'),
    ).toBe('/contact')
    // No "Updated" line when updatedAt is absent.
    expect(screen.queryByText(/Updated/)).toBeNull()
  })

  it('shows Updated only when it differs from published; TOC only at 4+ h2s', () => {
    const { rerender } = render(
      <BlogArticle
        post={{ ...basePost, updatedAt: '2026-09-02T00:00:00+05:30' }}
        authors={[org]}
        url="u"
        body={<p>Body.</p>}
        headings={[
          { id: 'a', text: 'A' },
          { id: 'b', text: 'B' },
          { id: 'c', text: 'C' },
        ]}
        cta={{ label: 'CTA', href: '/contact' }}
      />,
    )
    expect(screen.getByText(/Updated/)).toBeDefined()
    // 3 headings: no TOC.
    expect(
      screen.queryByRole('navigation', { name: 'In this post' }),
    ).toBeNull()
    rerender(
      <BlogArticle
        post={basePost}
        authors={[org]}
        url="u"
        body={<p>Body.</p>}
        headings={[
          { id: 'a', text: 'A' },
          { id: 'b', text: 'B' },
          { id: 'c', text: 'C' },
          { id: 'd', text: 'D' },
        ]}
        cta={{ label: 'CTA', href: '/contact' }}
      />,
    )
    expect(
      screen.getByRole('navigation', { name: 'In this post' }),
    ).toBeDefined()
  })

  it('renders the optional hero image only when the post provides one (§5/Q16)', () => {
    const { container, rerender } = render(
      <BlogArticle
        post={basePost}
        authors={[org]}
        url="u"
        body={<p>Body.</p>}
        cta={{ label: 'CTA', href: '/contact' }}
      />,
    )
    expect(container.querySelector('figure img')).toBeNull()
    rerender(
      <BlogArticle
        post={{
          ...basePost,
          heroImage: {
            src: '/images/real-diagram.png',
            alt: 'A real diagram',
            width: 1200,
            height: 630,
          },
        }}
        authors={[org]}
        url="u"
        body={<p>Body.</p>}
        cta={{ label: 'CTA', href: '/contact' }}
      />,
    )
    const img = container.querySelector('figure img')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('alt')).toBe('A real diagram')
  })

  it('emits TechArticle JSON-LD for engineering posts without forbidden keys', () => {
    const { container } = render(
      <BlogArticle
        post={basePost}
        authors={[org]}
        url="https://sandbee.in/blog/p1"
        body={<p>Body.</p>}
        cta={{ label: 'CTA', href: '/contact' }}
      />,
    )
    const raw = container.querySelector(
      'script[type="application/ld+json"]',
    )?.innerHTML
    const parsed = JSON.parse(raw ?? '{}')
    expect(parsed['@type']).toBe('TechArticle')
    expect(parsed.author).toEqual([
      { '@type': 'Organization', name: 'Sandbee' },
    ])
    expect(raw).not.toContain('offers')
    expect(raw).not.toContain('aggregateRating')
  })
})

describe('category lazy rule (ADR-0006 §3)', () => {
  it('a category earns a page only at 3+ published posts; drafts never count', () => {
    const posts = [
      { category: 'engineering', draft: false },
      { category: 'engineering', draft: false },
      { category: 'engineering', draft: true },
      { category: 'company', draft: false },
    ] as const
    expect(categoriesWithPages(posts)).toEqual([])
    expect(
      categoriesWithPages([
        ...posts,
        { category: 'engineering', draft: false } as const,
      ]),
    ).toEqual(['engineering'])
  })
})
