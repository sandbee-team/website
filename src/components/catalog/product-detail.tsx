import type { Route } from 'next'
import Link from 'next/link'

import { ButtonLink } from '@/components/primitives'
import { CATALOG, type CatalogProduct } from '@/content/catalog'
import { buildBreadcrumbs } from '@/lib/seo/breadcrumbs'
import { breadcrumbListJsonLd, jsonLd, offeringJsonLd } from '@/lib/seo/json-ld'
import { SITE_URL } from '@/lib/seo/site'
import type { Offering } from '@/types/content'

import { ProductPreview } from './product-preview'
import styles from './product-detail.module.css'

function productBreadcrumbs(product: CatalogProduct) {
  const section = product.href.split('/')[1]
  const label =
    section === 'products'
      ? 'Products'
      : section === 'services'
        ? 'Services'
        : 'Technology'
  return buildBreadcrumbs([
    { name: label, href: `/${section}` },
    { name: product.name, href: product.href },
  ])
}

/** Shared structured data, invoked by the offering routes with their validated record. */
export function ProductDetailSeo({
  product,
  offering,
}: {
  product: CatalogProduct
  offering: Offering
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(breadcrumbListJsonLd(productBreadcrumbs(product))),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            offeringJsonLd(
              {
                ...offering,
                name: product.name,
                oneLiner: product.description,
              },
              new URL(product.href, SITE_URL).toString(),
            ),
          ),
        }}
      />
    </>
  )
}

export function ProductDetail({ product }: { product: CatalogProduct }) {
  const breadcrumbs = productBreadcrumbs(product)
  const related = CATALOG.filter((entry) => entry.id !== product.id)

  return (
    <div className={styles.page} data-product={product.id}>
      <div className="container-site">
        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
          <ol>
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href}>
                {index === breadcrumbs.length - 1 ? (
                  <span aria-current="page">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href as Route}>{crumb.name}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span className={styles.marker} aria-hidden="true" />
              {product.name}
              <span className={styles.category}>{product.category}</span>
            </p>
            <h1>{product.headline}</h1>
            <p className={styles.description}>{product.description}</p>
            <div className={styles.actions}>
              <ButtonLink href={product.actionHref as Route} size="lg">
                {product.action}
                <span aria-hidden="true"> ↗</span>
              </ButtonLink>
              <a className={styles.textLink} href="#how-it-works">
                See how it works <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className={styles.priceNote}>
              <strong>{product.price}</strong>
              <span>{product.pricingDetail}</span>
            </p>
          </div>
          <figure className={styles.preview}>
            <ProductPreview id={product.id} />
            <figcaption>Workflow illustration · {product.name}</figcaption>
          </figure>
        </header>

        <nav aria-label="On this page" className={styles.sectionNav}>
          <span>{product.name}</span>
          <a href="#capabilities">Capabilities</a>
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#questions">Questions</a>
        </nav>

        <section
          id="capabilities"
          className={styles.section}
          aria-labelledby="capabilities-heading"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>The useful details</p>
            <h2 id="capabilities-heading">{product.label}</h2>
          </div>
          <div className={styles.features}>
            {product.features.map(([title, body], index) => (
              <article key={title}>
                <span className={styles.featureNumber} aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className={styles.delivery}
          aria-labelledby="delivery-heading"
        >
          <div className={styles.deliveryIntro}>
            <p className={styles.eyebrow}>From here to your workflow</p>
            <h2 id="delivery-heading">
              A clear path
              <br />
              to getting started.
            </h2>
            <p>
              Know what runs where, how you get access, and what comes next.
            </p>
          </div>
          <ol className={styles.steps}>
            {product.steps.map(([title, body], index) => (
              <li key={title}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="pricing"
          className={styles.pricing}
          aria-labelledby="pricing-heading"
        >
          <div>
            <p className={styles.eyebrow}>The commercial model</p>
            <h2 id="pricing-heading">{product.price}</h2>
            <p>{product.pricingDetail}</p>
          </div>
          <div className={styles.pricingAction}>
            <ButtonLink href={product.actionHref as Route}>
              {product.action}
              <span aria-hidden="true"> ↗</span>
            </ButtonLink>
            <Link href={'/pricing' as Route} className={styles.textLink}>
              Compare all pricing models <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section
          id="questions"
          className={`${styles.section} ${styles.faq}`}
          aria-labelledby="faq-heading"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Before you begin</p>
            <h2 id="faq-heading">
              A few practical
              <br />
              questions.
            </h2>
            <Link href="/contact" className={styles.textLink}>
              Talk to Sandbee <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className={styles.questions}>
            {product.faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span aria-hidden="true" className={styles.expand}>
                    +
                  </span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.related} aria-labelledby="related-heading">
          <div className={styles.relatedHeading}>
            <p className={styles.eyebrow}>More from Sandbee</p>
            <h2 id="related-heading">Different tools. One company.</h2>
          </div>
          <div className={styles.relatedGrid}>
            {related.map((entry) => (
              <Link href={entry.href} key={entry.id}>
                <span className={styles.relatedCategory}>
                  {entry.category}
                  <span aria-hidden="true">↗</span>
                </span>
                <h3>{entry.name}</h3>
                <p>{entry.label}</p>
                <span className={styles.relatedPrice}>{entry.price}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
