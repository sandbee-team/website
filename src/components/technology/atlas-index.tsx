import { IndexRow, Table, Td, Th, TextLink } from '@/components/primitives'
import type { Offering } from '@/types/content'

/*
 * Technology Atlas — server-rendered semantic index (06c; approved comp A1
 * "index-first", G2 moments record): every offering is a numbered ruled row with the
 * same columns — offering (a real link), category, §15 delivery wording, and the
 * comp's mono access shorthand. This table IS the page's Atlas (spec §12/§16 no-JS
 * baseline); the category-glyph map dock / focus layer is phase-07c. No status labels
 * render (Q6: none assigned).
 */
const CATEGORY_LABEL: Record<Offering['category'], string> = {
  product: 'Product',
  service: 'Service',
  package: 'Package / SDK / API',
}

// Branches keep the template-literal types typedRoutes validates (a joined plain
// string would widen to `string` and fail the Route<T> check). Shared with the 07c
// map layer so both Atlas layers always target the same ADR-0005 detail routes.
export function offeringHref(offering: Pick<Offering, 'category' | 'slug'>) {
  switch (offering.category) {
    case 'product':
      return `/products/${offering.slug}` as const
    case 'service':
      return `/services/${offering.slug}` as const
    case 'package':
      return `/technology/${offering.slug}` as const
  }
}

// Access shorthand per the approved A1 comp (comp-verbatim, mono lowercase).
const ACCESS_SHORTHAND: Record<string, string> = {
  pos: 'managed',
  'whatsapp-sms-automation': 'dashboard · api',
  'instagram-automation': 'dashboard · api',
  'desktop-notification': 'api',
  'electron-tracking': 'build · api key',
  'aadhaar-pan-ocr': 'build · api key',
  'face-scan-mobile': 'build · setup',
}

// Sync component (data lifted to the page): nested async server components cannot be
// rendered by the RTL fidelity tests.
export function AtlasIndex({ offerings }: { offerings: Offering[] }) {
  const sorted = [...offerings].sort((a, b) => a.order - b.order)
  return (
    <>
      <p className="type-body mt-3">
        Every Sandbee offering, one governed system — products, services and
        developer technology in the same columns.
      </p>
      <div className="mt-6">
        <Table caption="Technology Atlas: every Sandbee offering with its category, delivery model and access route">
          <thead>
            <tr>
              <Th>
                <span className="sr-only">Row</span>
              </Th>
              <Th>offering</Th>
              <Th>category</Th>
              <Th>delivery</Th>
              {/* §15's "Example commercial direction" column — 06f F2: graft 8 says
                  the schema EXTENDS the reference table's actual columns; an earlier
                  reading substituted access for it. Both render now. */}
              <Th>commercial direction</Th>
              <Th>access</Th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((offering, index) => (
              <IndexRow
                key={offering.id}
                index={String(index + 1).padStart(2, '0')}
              >
                <Td>
                  <TextLink href={offeringHref(offering)}>
                    {offering.name}
                  </TextLink>
                </Td>
                <Td>{CATEGORY_LABEL[offering.category]}</Td>
                <Td>{offering.exampleDelivery}</Td>
                <Td>{offering.commercialDirection}</Td>
                <Td className="type-caption text-ink-muted">
                  {ACCESS_SHORTHAND[offering.id] ?? '—'}
                </Td>
              </IndexRow>
            ))}
          </tbody>
        </Table>
      </div>
      <p className="type-caption mt-4 text-ink-muted">
        examples of current direction — not a fixed roadmap
      </p>
    </>
  )
}
