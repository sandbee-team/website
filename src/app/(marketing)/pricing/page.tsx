import { PageBreadcrumb } from '@/components/catalog/page-breadcrumb'
import Link from 'next/link'
import { CATALOG, STORE_URL } from '@/content/catalog'
import { buildPageMetadata } from '@/lib/seo/metadata'
import styles from '@/components/catalog/marketing.module.css'
export const metadata = buildPageMetadata({
  title: 'Pricing — free tools, prepaid messaging, POS setup',
  description:
    'GSTIN and Document OCR are free. Messaging uses prepaid balance; POS has a one-time setup charge. See what is included and what to confirm before starting.',
  path: '/pricing',
})
export default function PricingPage() {
  return (
    <div className="container-site">
      <header className={styles.pageIntro}>
        <PageBreadcrumb name="Pricing" href="/pricing" />
        <span>Pricing that fits the product</span>
        <h1>
          Start with what you need.
          <br />
          Know how it’s priced.
        </h1>
        <p>
          A free developer tool, a balance-based service or a one-time product
          setup. Choose the model that makes sense for your work.
        </p>
      </header>
      <section className={styles.pageBody} aria-label="Pricing models">
        <div className={styles.pricingGrid}>
          <article className={styles.priceCard}>
            <span>GSTIN + Document OCR</span>
            <h2>₹0 access</h2>
            <p>Two useful starting points for your application.</p>
            <ul>
              <li>GST lookup through an authenticated API</li>
              <li>OCR package for your Node.js server</li>
              <li>Workspace access and developer guides</li>
              <li>Service limits apply</li>
            </ul>
            <a href={STORE_URL} className={styles.primaryLink}>
              Start in Sandbee Store ↗
            </a>
          </article>
          <article className={styles.priceCard}>
            <span>Sandbee Messaging</span>
            <h2>Prepaid balance</h2>
            <p>Fund your account and use messaging against your agreed rate.</p>
            <ul>
              <li>QR-connected WhatsApp session</li>
              <li>Panel and API messaging</li>
              <li>Access based on available balance</li>
              <li>Rate confirmed before activation</li>
            </ul>
            <Link
              href="/contact?product=messaging"
              className={styles.primaryLink}
            >
              Request messaging pricing →
            </Link>
          </article>
          <article className={styles.priceCard}>
            <span>Sandbee POS</span>
            <h2>One-time setup</h2>
            <p>
              Implementation for your operation, in your own Vercel account.
            </p>
            <ul>
              <li>Discuss your required workflows</li>
              <li>Deployment and configuration</li>
              <li>Review before handover</li>
              <li>Separate provider and optional work costs</li>
            </ul>
            <Link href="/contact?product=pos" className={styles.primaryLink}>
              Get a setup quote →
            </Link>
          </article>
        </div>
        <div
          className={styles.compare}
          role="region"
          aria-label="Product pricing comparison"
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Access model</th>
                <th>Where it runs</th>
              </tr>
            </thead>
            <tbody>
              {CATALOG.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={p.href}>{p.name}</Link>
                  </td>
                  <td>{p.price}</td>
                  <td>
                    {p.id === 'ocr'
                      ? 'Your Node.js server'
                      : p.id === 'pos'
                        ? 'Your Vercel account'
                        : 'Hosted service'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.pricingNote}>
          Free access does not include your own infrastructure costs. Messaging
          rates and POS setup scope are agreed before purchase. Hosting plans,
          databases, taxes, support and custom changes are confirmed in the
          applicable quote; no online paid checkout is offered here.
        </p>
        <div className={styles.supportLinks}>
          <span>Not sure which option fits?</span>
          <Link href="/contact">Talk through your requirements →</Link>
        </div>
      </section>
    </div>
  )
}
