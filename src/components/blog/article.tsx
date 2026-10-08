import type { Route } from 'next'
import Image from 'next/image'
import type { ReactNode } from 'react'

import { ButtonLink, TextLink } from '@/components/primitives'
import { blogPostingJsonLd, jsonLd } from '@/lib/seo/json-ld'
import type { Author, BlogPost, Offering } from '@/types/content'

/*
 * Article template (ADR-0006 §5, spec §14 order): title → summary → byline + <time>
 * published (+ visible "Updated" only when different) → loader-computed reading time →
 * optional REAL hero (Q16: none exist yet — the slot renders only a provided real
 * image) → body → "Mentioned in this post" (related technologies) → related posts →
 * ONE per-post CTA → BlogPosting/TechArticle JSON-LD (never offers/aggregateRating).
 * TOC renders only at >=4 h2 sections (headings supplied by the route from the MDX).
 * Built 06e as a TESTED COMPONENT; the /blog/[slug] ROUTE arrives with the first real
 * post (ADR-0011 §7 — Cache Components forbids empty generateStaticParams; ADR-0012's
 * markdown alternate lands then too). Byline: org-only at launch (Q18, ADR-0014).
 */
export interface ArticleHeading {
  id: string
  text: string
}

export function BlogArticle({
  post,
  authors,
  url,
  body,
  headings = [],
  relatedOfferings = [],
  relatedPosts = [],
  cta,
}: {
  post: BlogPost
  authors: Author[]
  /** Absolute canonical URL (route-computed). */
  url: string
  body: ReactNode
  /** h2 outline from the MDX; TOC renders only at 4+ entries (ADR-0006 §5). */
  headings?: ArticleHeading[]
  relatedOfferings?: Offering[]
  relatedPosts?: BlogPost[]
  /** Exactly one CTA, chosen per post (ADR-0006 §5). */
  cta: { label: string; href: string }
}) {
  const published = post.publishedAt.slice(0, 10)
  const updated = post.updatedAt?.slice(0, 10)
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(blogPostingJsonLd(post, authors, url)),
        }}
      />
      <h1 className="type-hero mt-6 max-w-[24ch]">{post.title}</h1>
      <p className="type-body mt-5 content-block">{post.summary}</p>
      <p className="type-caption mt-4 text-ink-muted">
        {authors.map((author) => author.name).join(' · ')} ·{' '}
        <time dateTime={post.publishedAt}>{published}</time>
        {updated && updated !== published ? (
          <>
            {' '}
            · Updated <time dateTime={post.updatedAt}>{updated}</time>
          </>
        ) : null}{' '}
        · {post.readingTimeMinutes} min read
      </p>
      {post.heroImage ? (
        // Optional REAL hero (§5 order: after the byline block, before the body).
        // Q16: only a genuinely provided image renders — never stock/generated art.
        <figure className="mt-8 content-block">
          <Image
            src={post.heroImage.src}
            alt={post.heroImage.alt}
            width={post.heroImage.width}
            height={post.heroImage.height}
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </figure>
      ) : null}
      {headings.length >= 4 ? (
        <nav aria-label="In this post" className="mt-8 content-block">
          <p className="type-label text-ink-muted">In this post</p>
          <ul className="type-body mt-2">
            {headings.map((heading) => (
              <li key={heading.id} className="mt-1">
                <a
                  href={`#${heading.id}`}
                  className="underline decoration-1 underline-offset-4"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      <div className="mt-10 content-block">{body}</div>
      {relatedOfferings.length > 0 ? (
        <section className="mt-12 content-block border-t border-line pt-6">
          <h2 className="type-label text-ink-muted">Mentioned in this post</h2>
          <ul className="type-body mt-3">
            {relatedOfferings.map((offering) => (
              <li key={offering.id} className="mt-1">
                <TextLink href={`/technology/${offering.slug}`}>
                  {offering.name}
                </TextLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {relatedPosts.length > 0 ? (
        <section className="mt-10 content-block">
          <h2 className="type-label text-ink-muted">Related posts</h2>
          <ul className="type-body mt-3">
            {relatedPosts.map((related) => (
              <li key={related.id} className="mt-1">
                {/* Route cast: /blog/[slug] exists only once a real post ships
                    (ADR-0011 §7) — related posts render only in that same world. */}
                <TextLink href={`/blog/${related.slug}` as Route}>
                  {related.title}
                </TextLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <div className="mt-12 content-block">
        <ButtonLink href={cta.href as Route}>{cta.label}</ButtonLink>
      </div>
    </article>
  )
}
