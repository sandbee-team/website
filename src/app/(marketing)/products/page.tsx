import { PageBreadcrumb } from '@/components/catalog/page-breadcrumb'
import { CatalogDirectory } from '@/components/catalog/catalog-directory'
import { buildPageMetadata } from '@/lib/seo/metadata'
import styles from '@/components/catalog/marketing.module.css'
export const metadata = buildPageMetadata({
  title: 'Products — software, APIs and packages',
  description:
    'Find the right Sandbee product: GSTIN API, local Document OCR, prepaid WhatsApp messaging or POS with one-time setup in your account.',
  path: '/products',
})
export default function ProductsPage() {
  return (
    <div className="container-site">
      <header className={styles.pageIntro}>
        <PageBreadcrumb name="Products" href="/products" />
        <span>The Sandbee collection</span>
        <h1>
          A useful next step.
          <br />
          For whatever you’re building.
        </h1>
        <p>
          Business software, hosted services and developer tools. Different ways
          to work, one place to find them.
        </p>
      </header>
      <section className={styles.pageBody} aria-label="Product catalog">
        <CatalogDirectory filters />
      </section>
    </div>
  )
}
