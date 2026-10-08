import type { Metadata, Route } from 'next'
import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'

import { ButtonLink, TextLink } from '@/components/primitives'
import { Breadcrumbs, PageScaffold } from '@/components/site'
import CustomerHostedOcr from '@/content/blog/customer-hosted-ocr-integration.mdx'
import HostedApiOrSdk from '@/content/blog/hosted-api-or-installed-sdk.mdx'
import PosHandover from '@/content/blog/pos-deployment-handover-checklist.mdx'
import {
  getAuthors,
  getOfferings,
  getPost,
  getPostBody,
  getPosts,
} from '@/lib/content'
import { buildBreadcrumbs } from '@/lib/seo/breadcrumbs'
import {
  blogPostingJsonLd,
  breadcrumbListJsonLd,
  jsonLd,
} from '@/lib/seo/json-ld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { SITE_URL } from '@/lib/seo/site'

// Reviewed local MDX only. Adding a published post requires an explicit import;
// untrusted route parameters never become module paths or executable MDX.
const articleBodies: Record<string, ComponentType> = {
  'customer-hosted-ocr-integration': CustomerHostedOcr,
  'hosted-api-or-installed-sdk': HostedApiOrSdk,
  'pos-deployment-handover-checklist': PosHandover,
}

type ArticleProps = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getPosts()
  for (const post of posts) {
    if (!Object.hasOwn(articleBodies, post.slug)) {
      throw new Error(
        `Published blog post has no local MDX import: ${post.slug}`,
      )
    }
  }
  return posts.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: ArticleProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  const authors = (await getAuthors()).filter((author) =>
    post.authors.includes(author.id),
  )
  const path = `/blog/${post.slug}`
  const metadata = buildPageMetadata({
    title: post.title,
    description: post.summary,
    path,
    ogType: 'article',
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: authors.map(({ name }) => name),
      section: post.category,
    },
  })
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      types: {
        'text/markdown': new URL(`${path}/article.md`, SITE_URL).toString(),
      },
    },
  }
}

export default async function ArticlePage({ params }: ArticleProps) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post || !Object.hasOwn(articleBodies, slug)) notFound()

  const [allAuthors, posts, offerings, source] = await Promise.all([
    getAuthors(),
    getPosts(),
    getOfferings(),
    getPostBody(slug),
  ])
  if (!source) notFound()
  const Body = articleBodies[slug]
  const authors = allAuthors.filter((author) =>
    post.authors.includes(author.id),
  )
  const relatedPosts = posts.filter((related) =>
    post.relatedPosts.includes(related.id),
  )
  const relatedOfferings = offerings.filter((offering) =>
    post.relatedTechnologies.includes(offering.id),
  )
  // These articles use unique plain-text ASCII h2s. This matches rehype-slug's
  // generated anchors; a new article with rich headings must extend this extractor.
  const headings = Array.from(source.matchAll(/^## (.+)$/gm), ([, title]) => ({
    title: title.trim(),
    id: title
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s/g, '-'),
  }))
  const path = `/blog/${post.slug}`
  const url = new URL(path, SITE_URL).toString()
  const breadcrumbs = buildBreadcrumbs([
    { name: 'Blog', href: '/blog' },
    { name: post.title, href: path },
  ])
  const cta =
    post.slug === 'customer-hosted-ocr-integration'
      ? {
          href: '/technology/aadhaar-pan-ocr',
          label: 'See OCR integration details',
        }
      : post.slug === 'pos-deployment-handover-checklist'
        ? { href: '/products/pos', label: 'See POS deployment details' }
        : { href: '/technology', label: 'Explore Sandbee technology' }

  return (
    <article className="blog-article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(blogPostingJsonLd(post, authors, url)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(breadcrumbListJsonLd(breadcrumbs)),
        }}
      />
      <PageScaffold
        experience="journal"
        kicker={`Blog / ${post.category}`}
        title={post.title}
        lede={post.summary}
        breadcrumbs={<Breadcrumbs trail={breadcrumbs} />}
      >
        <p className="type-caption text-ink-muted">
          {authors.map(({ name }) => name).join(' · ')} ·{' '}
          <time dateTime={post.publishedAt}>
            {post.publishedAt.slice(0, 10)}
          </time>
          {post.updatedAt && post.updatedAt !== post.publishedAt ? (
            <>
              {' '}
              · Updated{' '}
              <time dateTime={post.updatedAt}>
                {post.updatedAt.slice(0, 10)}
              </time>
            </>
          ) : null}{' '}
          · {post.readingTimeMinutes} min read
        </p>
        {headings.length >= 4 ? (
          <nav aria-label="In this post" className="mt-8 content-block">
            <p className="type-label text-ink-muted">In this post</p>
            <ol className="type-body mt-3 list-decimal pl-5">
              {headings.map((heading) => (
                <li key={heading.id} className="mt-2">
                  <a className="link" href={`#${heading.id}`}>
                    {heading.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <div className="blog-prose content-block mt-10">
          <Body />
        </div>
        <footer className="blog-article-footer">
          {relatedOfferings.length > 0 ? (
            <section className="content-block mt-12 border-t border-line pt-6">
              <h2 className="type-title-sm">Mentioned in this post</h2>
              <ul className="type-body mt-4">
                {relatedOfferings.map((offering) => {
                  const category =
                    offering.category === 'product'
                      ? 'products'
                      : offering.category === 'service'
                        ? 'services'
                        : 'technology'
                  return (
                    <li key={offering.id} className="mt-2">
                      <TextLink href={`/${category}/${offering.slug}` as Route}>
                        {offering.name}
                      </TextLink>
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : null}
          {relatedPosts.length > 0 ? (
            <section className="content-block mt-10">
              <h2 className="type-title-sm">Read next</h2>
              <ul className="type-body mt-4">
                {relatedPosts.map((related) => (
                  <li key={related.id} className="mt-3">
                    <TextLink href={`/blog/${related.slug}`}>
                      {related.title}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <div className="content-block mt-10">
            <ButtonLink href={cta.href as Route}>{cta.label}</ButtonLink>
            <p className="type-caption mt-6">
              <TextLink href={`${path}/article.md` as Route}>
                Read this article as Markdown
              </TextLink>
            </p>
          </div>
        </footer>
      </PageScaffold>
    </article>
  )
}
