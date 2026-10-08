import { PageBreadcrumb } from '@/components/catalog/page-breadcrumb'
import Link from 'next/link'
import { CatalogDirectory } from '@/components/catalog/catalog-directory'
import { buildPageMetadata } from '@/lib/seo/metadata'
import styles from '@/components/catalog/marketing.module.css'
export const metadata = buildPageMetadata({
  title: 'Services — GST lookup and messaging',
  description:
    'Connect Sandbee hosted services to your workflow: authenticated GST lookups and WhatsApp messaging through a QR-connected session, panel and API.',
  path: '/services',
})
export default function ServicesPage() {
  return (
    <div className="container-site">
      <header className={styles.pageIntro}>
        <PageBreadcrumb name="Services" href="/services" />
        <span>Hosted services</span>
        <h1>
          Your workflow.
          <br />
          With a little more capability.
        </h1>
        <p>
          Connect an API to the software you already use, or work directly from
          a product panel. Access and pricing fit each service.
        </p>
      </header>
      <section className={styles.pageBody} aria-label="Hosted services">
        <CatalogDirectory ids={['gst', 'messaging']} />
        <div className={styles.supportLinks}>
          <span>Looking for a different automation workflow?</span>
          <Link href="/custom-technology">Discuss a custom integration →</Link>
        </div>
        <div className={styles.supportLinks}>
          <span>Explore other service directions</span>
          <Link href="/services/instagram-automation">
            Instagram automation
          </Link>
          <Link href="/services/desktop-notification">
            Desktop notifications
          </Link>
        </div>
      </section>
    </div>
  )
}
