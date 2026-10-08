import type { ServiceCopy } from '@/components/services/service-copy'
import { ServiceFlow } from '@/components/services/service-flow'
import { ButtonLink, TextLink } from '@/components/primitives'
import { Breadcrumbs, PageScaffold } from '@/components/site'
import { buildBreadcrumbs } from '@/lib/seo/breadcrumbs'
import { breadcrumbListJsonLd, jsonLd, offeringJsonLd } from '@/lib/seo/json-ld'
import { SITE_URL } from '@/lib/seo/site'
import type { Offering } from '@/types/content'

/*
 * Service page template — spec §10 anatomy per the 05b contracts
 * (.memory/content/services-*.md), copy deck-verbatim from SERVICE_COPY. Sections:
 * what it is → consumption (with the typed hosted-service diagram) → billing (models,
 * never amounts — Q7) → optional fit → FAQ → inquiry CTA → related band. §10's
 * "support/reliability only when verified" slot is deliberately absent (nothing is
 * verified). No status label renders (Q6: none assigned).
 */
export function ServicePage({
  offering,
  copy,
  siblings,
}: {
  offering: Offering
  copy: ServiceCopy
  siblings: Offering[]
}) {
  const breadcrumbs = buildBreadcrumbs([
    { name: 'Services', href: '/services' },
    { name: offering.name, href: `/services/${offering.slug}` },
  ])
  const canonical = new URL(`/services/${offering.slug}`, SITE_URL).toString()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(breadcrumbListJsonLd(breadcrumbs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(offeringJsonLd(offering, canonical)),
        }}
      />
      <PageScaffold
        experience="services"
        kicker="Service"
        title={offering.name}
        lede={copy.heroSupport}
        breadcrumbs={<Breadcrumbs trail={breadcrumbs} />}
      >
        <section className="mt-12 content-block">
          <h2 className="type-section">What this service is</h2>
          {copy.what.map((line) => (
            <p key={line} className="type-body mt-3">
              {line}
            </p>
          ))}
          {copy.deferral ? (
            <p className="type-body mt-4">
              {copy.deferral}{' '}
              <TextLink href="/services">See the services page</TextLink>
            </p>
          ) : null}
        </section>
        <section className="mt-12 content-block">
          <h2 className="type-section">How you consume it</h2>
          {copy.consume.map((line) => (
            <p key={line} className="type-body mt-3">
              {line}
            </p>
          ))}
          <ServiceFlow {...copy.flow} />
        </section>
        <section className="mt-12 content-block">
          <h2 className="type-section">{copy.billingHeading}</h2>
          {copy.billing.map((line) => (
            <p key={line} className="type-body mt-3">
              {line}
            </p>
          ))}
        </section>
        {copy.fit ? (
          <section className="mt-12 content-block">
            <h2 className="type-section">Who it fits</h2>
            <p className="type-body mt-3">{copy.fit}</p>
          </section>
        ) : null}
        <section className="mt-12 content-block">
          <h2 className="type-section">Common questions</h2>
          <dl className="mt-4">
            {copy.faq.map((item) => (
              <div key={item.question} className="border-b border-line py-4">
                <dt className="type-body font-semibold">{item.question}</dt>
                <dd className="type-body mt-2">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="mt-14 content-block">
          <ButtonLink href="/contact">{copy.cta}</ButtonLink>
        </section>
        {/* Related band: sibling services + the index. */}
        <p className="type-body mt-10 text-ink-muted">
          {siblings.map((sibling) => (
            <span key={sibling.id}>
              <TextLink href={`/services/${sibling.slug}`}>
                {sibling.name}
              </TextLink>
              {' · '}
            </span>
          ))}
          <TextLink href="/services">All services</TextLink>
        </p>
      </PageScaffold>
    </>
  )
}
