import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideCover } from '@/components/catalog/guide-cover'
import { STORE_URL } from '@/content/catalog'
import { LandingHero } from '@/components/landing/landing-hero'
import { WorkspaceDemo } from '@/components/catalog/workspace-demo'
import { CatalogDirectory } from '@/components/catalog/catalog-directory'
import { Arrow, ProductIcon } from '@/components/catalog/product-icon'
import styles from '@/components/catalog/marketing.module.css'
import { getPosts } from '@/lib/content'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: 'Sandbee — useful software, APIs and developer tools',
    description:
      'Explore Sandbee GSTIN, Document OCR, Messaging and POS. Software for your business, APIs for your backend and one Store to get started.',
    path: '/',
  }),
  title: { absolute: 'Sandbee — useful software, APIs and developer tools' },
}

export default async function HomePage() {
  const posts = await getPosts()
  return (
    <>
      <LandingHero />
      <div className="container-site">
        <section className={styles.section} id="products">
          <div className={styles.sectionHeading}>
            <div>
              <h2>
                Different jobs.
                <br />
                Thoughtfully built tools.
              </h2>
              <p>
                Choose the software you need today. There’s room for what you
                build tomorrow.
              </p>
            </div>
            <Link href="/products" className={styles.textLink}>
              View all products <Arrow />
            </Link>
          </div>
          <CatalogDirectory />
        </section>
      </div>
      <section className={styles.storeBand}>
        <div className={`container-site ${styles.storeGrid}`}>
          <div className={styles.storeCopy}>
            <span className={styles.sectionLabel}>The Sandbee workspace</span>
            <h2>
              Less switching.
              <br />
              More getting
              <br />
              things done.
            </h2>
            <p>
              Sandbee Store brings your workspace, enabled apps, API keys and
              developer guides into one place.
            </p>
            <a href={STORE_URL} className={styles.primaryLink}>
              Step inside the Store <Arrow diagonal />
            </a>
            <small>
              GSTIN and OCR are available through Store. Messaging and POS start
              with a guided setup request.
            </small>
          </div>
          <div>
            <WorkspaceDemo />
            <div className={styles.storeList}>
              <div>
                <span>01</span>
                <div>
                  <strong>One account to begin</strong>
                  <p>
                    Verify your email, set up your workspace and choose the apps
                    you want to use.
                  </p>
                </div>
              </div>
              <div>
                <span>02</span>
                <div>
                  <strong>The right access for each tool</strong>
                  <p>
                    Generate an app-specific key, or a global key for your
                    enabled apps. Keep your credentials on your server.
                  </p>
                </div>
              </div>
              <div>
                <span>03</span>
                <div>
                  <strong>A workspace for your team</strong>
                  <p>
                    Invite colleagues with the permissions they need. Keep usage
                    and access within your workspace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container-site">
        <section className={`${styles.section} ${styles.developerBand}`}>
          <div>
            <h2>
              Fits your stack.
              <br />
              Works your way.
            </h2>
            <p>
              Some tools belong behind an API. Others belong on your own server.
              Choose the delivery model that fits your application.
            </p>
            <Link href="/packages" className={styles.textLink}>
              Explore developer tools <Arrow />
            </Link>
          </div>
          <div className={styles.deliveryCards}>
            <Link href="/services/gst-api">
              <ProductIcon id="gst" />
              <div>
                <h3>Call a hosted API</h3>
                <p>
                  Add GST details to your backend without running the lookup
                  service yourself.
                </p>
              </div>
              <Arrow diagonal />
            </Link>
            <Link href="/technology/aadhaar-pan-ocr">
              <ProductIcon id="ocr" />
              <div>
                <h3>Install a local package</h3>
                <p>
                  Run document extraction on your infrastructure. Manage access
                  from Store.
                </p>
              </div>
              <Arrow diagonal />
            </Link>
            <Link href="/products/pos">
              <ProductIcon id="pos" />
              <div>
                <h3>Start with a configured product</h3>
                <p>Have Sandbee set up POS in your own Vercel account.</p>
              </div>
              <Arrow diagonal />
            </Link>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <h2>
                A little context.
                <br />A better starting point.
              </h2>
            </div>
            <Link href="/blog" className={styles.textLink}>
              From the Sandbee blog <Arrow />
            </Link>
          </div>
          <div className={styles.articleGrid}>
            {posts.slice(0, 3).map((post) => (
              <article key={post.id} className={styles.articleCard}>
                <GuideCover slug={post.slug} />
                <div className={styles.articleMeta}>
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{post.readingTimeMinutes} min read</span>
                </div>
                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p>{post.summary}</p>
                <Link href={`/blog/${post.slug}`} className={styles.textLink}>
                  Read the guide <Arrow />
                </Link>
              </article>
            ))}
          </div>
        </section>
        <section className={styles.cta}>
          <div>
            <h2>Have a workflow in mind?</h2>
            <p>
              Start with a product. Or talk to us about what needs building.
            </p>
          </div>
          <Link href="/contact" className={styles.primaryLink}>
            Let’s work on it <Arrow diagonal />
          </Link>
        </section>
      </div>
    </>
  )
}
