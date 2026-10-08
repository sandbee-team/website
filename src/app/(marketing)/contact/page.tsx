import { Suspense } from 'react'
import { PageBreadcrumb } from '@/components/catalog/page-breadcrumb'
import Link from 'next/link'
import { SITE_IDENTITY } from '@/config/site-identity'
import { STORE_URL } from '@/content/catalog'
import { EnquiryComposer } from '@/components/contact/enquiry-composer'
import { TransportEnquiry } from '@/components/contact/transport-enquiry'
import { buildPageMetadata } from '@/lib/seo/metadata'
import styles from '@/components/catalog/marketing.module.css'
import contact from '@/components/contact/enquiry.module.css'
export const metadata = buildPageMetadata({
  title: 'Contact Sandbee — product setup and enquiries',
  description:
    'Discuss Sandbee Messaging access, POS setup in your account, a developer integration or a custom software workflow with the Sandbee team.',
  path: '/contact',
})
export default function ContactPage() {
  const formFallback = (
    <p>
      Use the email link to contact us, or enable JavaScript to prepare your
      enquiry here.
    </p>
  )
  return (
    <div className="container-site">
      <header className={styles.pageIntro}>
        <PageBreadcrumb name="Contact" href="/contact" />
        <span>Talk to Sandbee</span>
        <h1>Let’s find the right fit.</h1>
        <p>
          A product setup, a new integration or a workflow that could work
          better. Tell us where you want to start.
        </p>
      </header>
      <div className={contact.layout}>
        <aside className={contact.aside}>
          <h2>Start a conversation.</h2>
          <p>
            We’ll use your requirements to discuss the right product, access
            model and setup scope. Paid rates are confirmed before you proceed.
          </p>
          {SITE_IDENTITY.email && (
            <a href={`mailto:${SITE_IDENTITY.email}`}>{SITE_IDENTITY.email}</a>
          )}
          <div>
            <strong>Looking for GSTIN or OCR?</strong>
            <p>
              Create your workspace and access the free products through Sandbee
              Store.
            </p>
            <a href={STORE_URL}>Open Sandbee Store ↗</a>
          </div>
          <div>
            <strong>Still exploring?</strong>
            <p>
              <Link href="/pricing">Compare pricing models</Link> or{' '}
              <Link href="/products">browse the products</Link>.
            </p>
          </div>
        </aside>
        {process.env.CONTACT_TRANSPORT_URL ? (
          <Suspense fallback={formFallback}>
            <TransportEnquiry />
          </Suspense>
        ) : SITE_IDENTITY.email ? (
          <Suspense fallback={formFallback}>
            <EnquiryComposer email={SITE_IDENTITY.email} />
          </Suspense>
        ) : (
          <p>Contact details are not configured yet.</p>
        )}
      </div>
    </div>
  )
}
