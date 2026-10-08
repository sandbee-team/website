import type { ReactNode } from 'react'

import { Figure } from './figure'

/*
 * Diagram slot (MDX allowlist, ADR-0007 §2): a captioned figure whose children are a
 * diagram-grammar SVG (phase-07 builds the grammar components) with a mandatory text
 * fallback — critical content must exist outside the visual (spec §16, graft 3: the
 * static/reduced state is the baseline). Until phase-07, `children` is typically a
 * static SVG or the fallback alone.
 */
export function Diagram({
  caption,
  fallback,
  children,
}: {
  /** Visible figcaption — what the diagram shows. */
  caption: string
  /** Text equivalent for readers without the visual (rendered visually hidden). */
  fallback: string
  children?: ReactNode
}) {
  return (
    <Figure caption={caption} className="my-6">
      {children}
      <p className="sr-only">{fallback}</p>
    </Figure>
  )
}
