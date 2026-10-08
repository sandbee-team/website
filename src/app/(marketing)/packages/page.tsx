import { PageBreadcrumb } from '@/components/catalog/page-breadcrumb'
import Link from 'next/link'
import { CatalogDirectory } from '@/components/catalog/catalog-directory'
import { STORE_URL } from '@/content/catalog'
import { buildPageMetadata } from '@/lib/seo/metadata'
import styles from '@/components/catalog/marketing.module.css'
export const metadata = buildPageMetadata({
  title: 'Developer packages and APIs',
  description:
    'Install Document OCR on your Node.js server or connect a hosted GST API. Find package access, integration guides and API keys through Sandbee Store.',
  path: '/packages',
})
export default function PackagesPage() {
  return (
    <div className="container-site">
      <header className={styles.pageIntro}>
        <PageBreadcrumb name="Packages & APIs" href="/packages" />
        <span>Built for developers</span>
        <h1>
          Add the capability.
          <br />
          Keep your own stack.
        </h1>
        <p>
          Install a package where your documents live, or call an API from your
          backend. Your Store workspace manages access.
        </p>
        <div className={styles.actionRow}>
          <a href={`${STORE_URL}/developers`} className={styles.primaryLink}>
            Open developer guides ↗
          </a>
          <Link href="/technology" className={styles.textLink}>
            Explore the technology library →
          </Link>
        </div>
      </header>
      <section className={styles.pageBody} aria-label="Developer tools">
        <CatalogDirectory ids={['ocr', 'gst']} />
      </section>
    </div>
  )
}
