import type { Metadata } from 'next'

import { ButtonLink, TextLink } from '@/components/primitives'
import { PageScaffold } from '@/components/site'
import { buildBreadcrumbs } from '@/lib/seo/breadcrumbs'
import { breadcrumbListJsonLd, jsonLd } from '@/lib/seo/json-ld'
import { buildPageMetadata } from '@/lib/seo/metadata'

/*
 * Custom technology page — per the 05a contract (.memory/content/custom-technology.md).
 * HARD CONSTRAINT (ADR-0005, reference §11): capability framing ONLY — no named
 * division, no programme name, no fixed commercial rules, no process guarantees,
 * no timelines/teams/SLAs (§11: "not yet finalized"). INDEXABLE (lifted from 04a).
 */
export const metadata: Metadata = buildPageMetadata({
  title: 'Custom technology',
  description:
    'Sandbee builds technology for external businesses when there is a valid requirement — and turns the reusable parts into packages, services and products.',
  path: '/custom-technology',
})

const breadcrumbs = buildBreadcrumbs([
  { name: 'Custom technology', href: '/custom-technology' },
])

export default function CustomTechnologyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(breadcrumbListJsonLd(breadcrumbs)),
        }}
      />
      <PageScaffold
        experience="custom"
        kicker="Capability"
        title="Custom technology"
        lede="Sandbee can build or adapt technology for businesses, developers, agencies and other organizations — when there is a valid requirement."
      >
        {/* Job: define "valid requirement" and prove the capability by mechanism. */}
        <section className="mt-12 content-block">
          <h2 className="type-section">When custom work makes sense</h2>
          <p className="type-body mt-3">
            A valid requirement, not a speculative one: software your operation
            needs that no existing product covers.
          </p>
          <p className="type-body mt-4">
            Sandbee already builds this way — the Electron tracking technology
            originated from a real client requirement.{' '}
            <TextLink href="/stories/electron-tracking-origin">
              Read how it happened
            </TextLink>
          </p>
        </section>
        {/* Job: the §11 principle, quoted, with its restraint clause. */}
        <section className="mt-12 content-block">
          <h2 className="type-section">The principle behind it</h2>
          <p className="type-body mt-3">
            &ldquo;Build for the client when necessary; productize the reusable
            technology when it creates broader value.&rdquo;
          </p>
          <p className="type-body mt-4">
            Custom work must not prevent reusable technology — and not every
            project becomes a product.
          </p>
        </section>
        {/* Job: honesty about shape — §11 says commercial rules are not finalized;
            nothing about timelines, teams, processes or SLAs renders (deliberate). */}
        <section className="mt-12 content-block">
          <h2 className="type-section">How an engagement is shaped</h2>
          <p className="type-body mt-3">
            The commercial model is agreed per engagement, in the model that
            fits — one-time, subscription, usage, or hybrid.
          </p>
          <p className="type-body mt-4">
            <TextLink href="/technology">
              What productized output looks like
            </TextLink>
            {' · '}
            <TextLink href="/company">The model behind it</TextLink>
          </p>
        </section>
        <section className="mt-14 content-block">
          <ButtonLink href="/contact">Describe the requirement</ButtonLink>
        </section>
      </PageScaffold>
    </>
  )
}
