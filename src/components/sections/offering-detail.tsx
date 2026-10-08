import { StatusBadge } from '@/components/primitives'
import { PageScaffold } from '@/components/site'
import type { Offering } from '@/types/content'

/*
 * Structural offering detail (04a): renders the graft-8 row fields from the loader —
 * reference §15 columns + the §8 access step. The real page anatomies (spec §9–§11)
 * are phase-05/06 scope. No CTA renders until Q6 assigns a status label (ADR-0011 §2),
 * and the status badge itself appears only when set.
 */

const CATEGORY_LABEL: Record<Offering['category'], string> = {
  product: 'Product',
  service: 'Service',
  package: 'Package / SDK / API',
}

export function OfferingDetail({ offering }: { offering: Offering }) {
  return (
    <PageScaffold
      kicker={CATEGORY_LABEL[offering.category]}
      title={offering.name}
      lede={offering.oneLiner}
    >
      {offering.status ? (
        <p className="mt-4">
          <StatusBadge>{offering.status.replace('-', ' ')}</StatusBadge>
        </p>
      ) : null}
      <dl className="mt-10 content-block">
        {[
          ['Example delivery', offering.exampleDelivery],
          ['Example commercial direction', offering.commercialDirection],
          ['Access', offering.access],
        ].map(([label, value]) => (
          <div
            key={label}
            className="border-b border-line py-4 sm:grid sm:grid-cols-3 sm:gap-6"
          >
            <dt className="type-label text-ink-muted">{label}</dt>
            <dd className="type-body mt-1 sm:col-span-2 sm:mt-0">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="type-body mt-10">{offering.summary}</p>
    </PageScaffold>
  )
}
