import { GuideCover } from '@/components/catalog/guide-cover'
import { PageBreadcrumb } from '@/components/catalog/page-breadcrumb'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAuthors, getPosts } from '@/lib/content'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { blogJsonLd, jsonLd } from '@/lib/seo/json-ld'
import { Arrow } from '@/components/catalog/product-icon'
import styles from '@/components/catalog/marketing.module.css'
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Blog — practical software and integration guides',
    description:
      'Practical Sandbee guides on customer-hosted OCR, choosing an API or SDK, and preparing a POS deployment handover.',
    path: '/blog',
  })
}
export default async function BlogPage() {
  const [posts, authors] = await Promise.all([getPosts(), getAuthors()])
  return (
    <div className="container-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(blogJsonLd()) }}
      />
      <header className={styles.pageIntro}>
        <PageBreadcrumb name="Blog" href="/blog" />
        <span>The Sandbee blog</span>
        <h1>Notes from the build.</h1>
        <p>
          Practical guides for choosing, integrating and running your software.
        </p>
      </header>
      <section className={styles.pageBody} aria-label="Articles">
        <div className={styles.articleGrid}>
          {posts.map((post) => (
            <article className={styles.articleCard} key={post.id}>
              <GuideCover slug={post.slug} />
              <div className={styles.articleMeta}>
                <span>{post.category}</span>
                <span>·</span>
                <span>{post.readingTimeMinutes} min read</span>
              </div>
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.summary}</p>
              <p>
                {post.authors
                  .map((id) => authors.find((a) => a.id === id)?.name)
                  .join(', ')}{' '}
                ·{' '}
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'UTC',
                  })}
                </time>
              </p>
              <Link href={`/blog/${post.slug}`} className={styles.textLink}>
                Read the guide <Arrow />
              </Link>
            </article>
          ))}
        </div>
        <div className={styles.supportLinks}>
          <Link href="/products">Explore products</Link>
          <Link href="/stories">Engineering stories</Link>
          <a href="/blog/feed.xml">Subscribe via RSS</a>
        </div>
      </section>
    </div>
  )
}
