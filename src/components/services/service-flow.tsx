import { Diagram } from '@/components/primitives'

/*
 * Diagram job (graft 2): show the hosted-service delivery position — your side, the
 * Sandbee-hosted capability, the destination — with the grammar's typed service edge.
 * Grammar v1: chevron = a running hosted capability (service glyph); DASHED edges =
 * hosted/API consumption (reference §4), labelled in mono lowercase; left→right flow.
 * The capability chevron is the diagram's ONE honey element (grammar rule 3) — this
 * file is in the check:rules honey allowlist for exactly that (named in 06b
 * 05-review). Static frame is complete; no motion here (07d owns interactivity).
 */
export function ServiceFlow({
  source,
  capability,
  destination,
  title,
  desc,
  caption,
  fallback,
}: {
  /** Mono label for the consumer side, e.g. "your system". */
  source: string
  /** Mono label for the Sandbee-hosted capability (the honey chevron). */
  capability: string
  /** Mono label for the delivery destination, e.g. "whatsapp / sms". */
  destination: string
  title: string
  desc: string
  caption: string
  fallback: string
}) {
  const titleId = `service-flow-title-${capability.replace(/[^a-z0-9]+/gi, '-')}`
  const descId = `service-flow-desc-${capability.replace(/[^a-z0-9]+/gi, '-')}`
  return (
    <Diagram caption={caption} fallback={fallback}>
      {/* Scroll container: SVG text scales with the viewBox transform (06b qa
          finding — labels measured 5px at 320). min-width keeps every label >=10px;
          the focusable overflow region scrolls, the page never does. */}
      <div
        className="overflow-x-auto"
        tabIndex={0}
        role="group"
        aria-label={`${title} (scrollable diagram)`}
      >
        <svg
          viewBox="0 0 900 150"
          className="w-full min-w-[760px] max-w-[900px]"
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
        >
          {/* <title>/<desc> per diagram grammar v1's accessibility rule. */}
          <title id={titleId}>{title}</title>
          <desc id={descId}>{desc}</desc>
          <line
            x1="0"
            y1="104"
            x2="900"
            y2="104"
            className="stroke-ink"
            strokeWidth="1"
          />
          {/* Consumer: outline cell. */}
          <rect
            x="60"
            y="48"
            width="28"
            height="28"
            fill="none"
            className="stroke-ink"
            strokeWidth="2"
          />
          {/* Hosted capability: stacked chevrons — the one honey element. */}
          <g className="stroke-honey-ink" strokeWidth="2.5" fill="none">
            <path d="M418 48 L450 68 L482 48" />
            <path d="M418 66 L450 86 L482 66" />
          </g>
          {/* Destination: outline cell. */}
          <rect
            x="812"
            y="48"
            width="28"
            height="28"
            fill="none"
            className="stroke-ink"
            strokeWidth="2"
          />
          {/* Typed service edges: DASHED = hosted/API consumption (§4). */}
          <g
            className="stroke-ink-muted"
            strokeWidth="1.5"
            strokeDasharray="6 5"
            fill="none"
          >
            <line x1="108" y1="62" x2="400" y2="62" />
            <line x1="500" y1="62" x2="794" y2="62" />
          </g>
          <text x="215" y="46" className="fill-ink-muted type-label-diagram">
            hosted · api
          </text>
          <text x="60" y="128" className="fill-ink-muted type-label-diagram">
            {source}
          </text>
          <text x="400" y="128" className="fill-ink-muted type-label-diagram">
            {capability}
          </text>
          <text x="740" y="128" className="fill-ink-muted type-label-diagram">
            {destination}
          </text>
        </svg>
      </div>
    </Diagram>
  )
}
