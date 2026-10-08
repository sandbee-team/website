import type { ReactNode } from 'react'

/*
 * Callout primitive (MDX allowlist, ADR-0007 §2): a sky-mist well (16px panel radius)
 * with a supporting label — for asides, caveats and "worth knowing" blocks in long-form
 * content. Semantically an <aside> with an accessible name from its label. Never a
 * honey surface.
 */
export function Callout({
  label = 'Note',
  children,
}: {
  label?: string
  children: ReactNode
}) {
  return (
    <aside aria-label={label} className="well my-6 p-5 md:p-6">
      <p className="type-label text-ink-muted">{label}</p>
      <div className="type-body mt-2">{children}</div>
    </aside>
  )
}
