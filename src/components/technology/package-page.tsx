import type { PackageCopy } from '@/components/technology/package-copy'
import { ButtonLink, TextLink } from '@/components/primitives'
import { Breadcrumbs, PageScaffold } from '@/components/site'
import { buildBreadcrumbs } from '@/lib/seo/breadcrumbs'
import { breadcrumbListJsonLd, jsonLd, offeringJsonLd } from '@/lib/seo/json-ld'
import { SITE_URL } from '@/lib/seo/site'
import type { Offering } from '@/types/content'

/*
 * Package/SDK/API page template — spec §11 via the 10-block anatomy, per the 05b
 * contracts (.memory/content/technology-*.md), copy deck-verbatim from PACKAGE_COPY.
 * Q20 minimum-credible variant (ADR-0005): the graft-5 first screen carries concrete
 * nouns + access mechanism + billing-model type, the snippet element is deliberately
 * absent (no runnable public package), docs/changelog/status slots hidden, maturity in
 * reference prose. FAQ answers state unknowns honestly. CTA matches the access model:
 * "Request access" → /contact. No status label renders (Q6: none assigned).
 */
export function PackagePage({
  offering,
  copy,
  siblings,
}: {
  offering: Offering
  copy: PackageCopy
  siblings: Offering[]
}) {
  const breadcrumbs = buildBreadcrumbs([
    { name: 'Technology', href: '/technology' },
    { name: offering.name, href: `/technology/${offering.slug}` },
  ])
  const canonical = new URL(`/technology/${offering.slug}`, SITE_URL).toString()
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
        experience="technology"
        kicker="Developer technology"
        title={offering.name}
        lede={copy.firstScreen.nouns}
        breadcrumbs={<Breadcrumbs trail={breadcrumbs} />}
      >
        {/* Graft-5 first screen (minus snippet — Q20): nouns · access · billing. */}
        <p className="type-body mt-4 content-block">
          {copy.firstScreen.access}
        </p>
        <p className="type-caption mt-4 content-block text-ink-muted">
          {copy.firstScreen.billing}
        </p>
        {copy.sections.map((section) => (
          <section key={section.heading} className="mt-12 content-block">
            <h2 className="type-section">{section.heading}</h2>
            {section.body}
          </section>
        ))}
        <section className="mt-12 content-block">
          <h2 className="type-section">Developer questions</h2>
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
          <ButtonLink href="/contact">Request access</ButtonLink>
        </section>
        {/* Related band: sibling packages + the index. */}
        <p className="type-body mt-10 text-ink-muted">
          {siblings.map((sibling) => (
            <span key={sibling.id}>
              <TextLink href={`/technology/${sibling.slug}`}>
                {sibling.name}
              </TextLink>
              {' · '}
            </span>
          ))}
          <TextLink href="/technology">All technology</TextLink>
        </p>
      </PageScaffold>
    </>
  )
}
