import type { Metadata, Route } from 'next'

import { ButtonLink, TextLink } from '@/components/primitives'
import { Breadcrumbs, PageScaffold } from '@/components/site'
import { CATALOG, STORE_URL } from '@/content/catalog'
import { buildBreadcrumbs } from '@/lib/seo/breadcrumbs'
import { breadcrumbListJsonLd, jsonLd } from '@/lib/seo/json-ld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'About Sandbee',
  description:
    'One technology company for business software, hosted APIs and developer packages. Explore how Sandbee delivers each offering and supports custom work.',
  path: '/company',
})

const breadcrumbs = buildBreadcrumbs([{ name: 'Company', href: '/company' }])

export default function CompanyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(breadcrumbListJsonLd(breadcrumbs)),
        }}
      />
      <PageScaffold
        experience="company"
        kicker="Company"
        title="One company. Many useful technologies."
        lede="Sandbee builds software for businesses and developers. Some offerings are complete applications. Others are APIs or packages you connect to the software you already use."
        breadcrumbs={<Breadcrumbs trail={breadcrumbs} />}
      >
        <section className="mt-12 content-block">
          <h2 className="type-section">Find the right form for the work</h2>
          <p className="type-body mt-3">
            A restaurant needs a working POS. A developer may need a GST lookup
            or document extraction inside an existing application. Delivery and
            pricing follow the job each offering does.
          </p>
          <ul className="mt-6">
            {CATALOG.map((product) => (
              <li key={product.id} className="border-b border-line py-5">
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
          <h2 className="type-section">Know where your software runs</h2>
          <p className="type-body mt-3">
            Sandbee POS is set up in your own Vercel account. Document OCR runs
            as an installed package on your Node.js server. GSTIN is a hosted
            API, and Sandbee Messaging connects a WhatsApp session for use
            through a panel or API.
          </p>
          <p className="type-body mt-4">
            The POS implementation charge is separate from provider
            subscriptions, database costs, support arrangements and later custom
            work. Those responsibilities are agreed before setup. A one-time
            setup fee does not mean hosting is free.
          </p>
          <p className="type-body mt-4">
            <TextLink href={'/pricing' as Route}>
              Compare delivery and pricing models
            </TextLink>
          </p>
        </section>
        <section className="mt-12 content-block">
          <h2 className="type-section">One place for developer access</h2>
          <p className="type-body mt-3">
            Sandbee Store is the separate account hub for GSTIN and Document OCR
            access. Enable the app you need and manage its key there. Messaging
            onboarding and prepaid balance are currently arranged with Sandbee.
          </p>
          <p className="type-body mt-4">
            <TextLink href={STORE_URL as Route}>Open Sandbee Store</TextLink>
          </p>
        </section>
        <section className="mt-12 content-block">
          <h2 className="type-section">
            Useful engineering can become reusable technology
          </h2>
          <p className="type-body mt-3">
            The desktop tracking technology began with a client requirement for
            application and web tracking. That work shows how a specific
            engineering problem can lead to technology intended for reuse.
          </p>
          <p className="type-body mt-4">
            Not every client project should become a product. Reuse needs a
            clear customer benefit, repeatable value and a workable delivery
            model.
          </p>
          <p className="type-body mt-4">
            <TextLink href="/stories/electron-tracking-origin">
              Read the desktop tracking origin story
            </TextLink>
          </p>
        </section>
        <section className="mt-12 content-block">
          <h2 className="type-section">Bring us the requirement</h2>
          <p className="type-body mt-3">
            Sandbee works with businesses, developers, agencies and technology
            teams. Describe the workflow you need, whether it fits an existing
            offering or calls for custom technology.
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <ButtonLink href="/contact">Talk to Sandbee</ButtonLink>
            <TextLink href="/custom-technology">
              Explore custom technology work
            </TextLink>
          </div>
        </section>
      </PageScaffold>
    </>
  )
}
