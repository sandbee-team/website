import type { Metadata, Route } from 'next'

import { ButtonLink, TextLink } from '@/components/primitives'
import { Breadcrumbs, PageScaffold } from '@/components/site'
import { CATALOG, STORE_URL } from '@/content/catalog'
import { getOfferings } from '@/lib/content'
import { buildBreadcrumbs } from '@/lib/seo/breadcrumbs'
import { breadcrumbListJsonLd, jsonLd } from '@/lib/seo/json-ld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'APIs and developer packages',
  description:
    'Use the free GSTIN API or run Document OCR on your own Node.js server. Explore access, delivery and other Sandbee technology directions.',
  path: '/technology',
})

const breadcrumbs = buildBreadcrumbs([
  { name: 'Technology', href: '/technology' },
])
const developerProducts = CATALOG.filter(
  (product) => product.id === 'gst' || product.id === 'ocr',
)

export default async function TechnologyPage() {
  const directions = (await getOfferings('package')).filter(
    (offering) => offering.id !== 'aadhaar-pan-ocr',
  )
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(breadcrumbListJsonLd(breadcrumbs)),
        }}
      />
      <PageScaffold
        experience="technology"
        kicker="For developers"
        title="Useful technology for your next integration."
        lede="Call a hosted API or install a package on your own server. Choose the delivery model that fits the software you are building."
        breadcrumbs={<Breadcrumbs trail={breadcrumbs} />}
      >
        <section className="mt-12 content-block">
          <h2 className="type-section">Start with GSTIN or Document OCR</h2>
          <ul className="mt-6">
            {developerProducts.map((product) => (
              <li key={product.id} className="border-b border-line py-6">
                <TextLink href={product.href} className="type-title-sm">
                  {product.name}
                </TextLink>
                <p className="type-body mt-2">{product.description}</p>
                <p className="type-caption mt-2 text-ink-muted">
                  {product.price} · {product.pricingDetail}
                </p>
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-12 content-block">
          <h2 className="type-section">
            Access and processing are different things
          </h2>
          <p className="type-body mt-3">
            Enable GSTIN or Document OCR in Sandbee Store and create an API key.
            For GSTIN, your backend makes requests to the hosted service. For
            OCR, you install the package and process documents on your own
            Node.js server.
          </p>
          <p className="type-body mt-4">
            The installed OCR package still needs internet access for startup
            verification and periodic license renewal. The hosted Store demo is
            separate: it processes files you choose to upload to that demo.
          </p>
          <p className="type-body mt-4">
            Free access does not remove service limits or your own
            infrastructure costs. Each offering page explains its runtime,
            delivery and access requirements.
          </p>
          <div className="mt-5">
            <ButtonLink href={`${STORE_URL}/developers` as Route}>
              Open developer resources
            </ButtonLink>
          </div>
        </section>
        <section className="mt-12 content-block">
          <h2 className="type-section">Other technology directions</h2>
          <p className="type-body mt-3">
            Sandbee also explores reusable technology from client work and other
            engineering problems. These entries describe that direction; contact
            us to discuss current scope and availability.
          </p>
          <ul className="mt-5">
            {directions.map((offering) => (
              <li key={offering.id} className="border-b border-line py-5">
                <TextLink
                  href={`/technology/${offering.slug}`}
                  className="type-title-sm"
                >
                  {offering.name}
                </TextLink>
                <p className="type-body mt-2 text-ink-muted">
                  {offering.oneLiner}
                </p>
              </li>
            ))}
          </ul>
          <p className="type-body mt-5">
            <TextLink href="/stories/electron-tracking-origin">
              Where the desktop tracking technology began
            </TextLink>
          </p>
        </section>
        <section className="mt-12 content-block">
          <h2 className="type-section">
            Connect messaging or discuss custom work
          </h2>
          <p className="type-body mt-3">
            Sandbee Messaging offers a QR-connected WhatsApp session with a
            panel and API, using prepaid balance. If your requirement is
            different, tell us what your application needs.
          </p>
          <p className="type-body mt-4">
            <TextLink href="/services/whatsapp-sms-automation">
              Explore Sandbee Messaging
            </TextLink>
            {' · '}
            <TextLink href="/custom-technology">
              Custom technology work
            </TextLink>
          </p>
          <div className="mt-5">
            <ButtonLink href="/contact">Discuss your integration</ButtonLink>
          </div>
        </section>
      </PageScaffold>
    </>
  )
}
