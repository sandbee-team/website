/*
 * Code block primitive: the night inverse surface (raised night panel, 16px radius,
 * inverse text 13.46:1; system monospace — plan §3). data-surface="night" switches the
 * focus ring to honey via globals.css. The block is horizontally scrollable in its own
 * container, so it is a focusable, labelled region (axe: scrollable-region-focusable).
 * Known trade-off (03a review finding): tabIndex is unconditional, so a block that does
 * NOT overflow is still a (labelled) tab stop; the conditional fix needs a client-side
 * overflow measurement — not spent on a static primitive. Syntax highlighting is the MDX
 * pipeline's job (rehype-pretty-code); this primitive is for hand-placed snippets.
 */
export function CodeBlock({
  code,
  label,
  className,
}: {
  code: string
  label: string
  className?: string
}) {
  return (
    <div
      data-surface="night"
      role="region"
      aria-label={label}
      tabIndex={0}
      className={['panel-night overflow-x-auto', className]
        .filter(Boolean)
        .join(' ')}
    >
      <pre className="type-code p-5">
        <code>{code}</code>
      </pre>
    </div>
  )
}
