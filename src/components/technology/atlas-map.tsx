import { Diagram } from '@/components/primitives'
import { buildAtlasLayout } from '@/lib/atlas/layout'
import type { AtlasNode } from '@/lib/atlas/layout'
import type { Offering, OfferingCategory } from '@/types/content'

import { offeringHref } from './atlas-index'

/*
 * Technology Atlas — map layer (07c; approved comp A2 "map-first band", adopted as
 * the overview band ABOVE the A1 table). Job (graft 2, comp-verbatim): "let a visitor
 * see the whole portfolio and how each piece reaches a customer, without reading a
 * paragraph." Server component: the d3-force layout is computed at build time and the
 * SVG — every node a real `<a>` to its detail route — renders without JS (spec §12).
 * Focus/hover highlighting is pure CSS (globals.css .atlas-node rules, the lowest
 * ladder rung); the focused node is the diagram's ONE honey element (grammar rule 3),
 * with the stroke-width bump carrying the state without colour (ADR-0009 §1). Edge
 * types per grammar v1: solid = managed deployment, dashed = hosted/API, dash-dot =
 * build + controlled access — distinguished by dash pattern + mono label, never
 * colour alone. The static frame has 0 honey (06c named decision; census-safe).
 */

/** Node labels, comp-verbatim from the approved A2 band (mono, grammar case rule). */
const NODE_LABEL: Record<string, string> = {
  pos: 'POS · product',
  'whatsapp-sms-automation': 'messaging',
  'gst-api': 'gstin api',
  'instagram-automation': 'instagram',
  'desktop-notification': 'desktop notif.',
  'electron-tracking': 'electron tracking',
  'aadhaar-pan-ocr': 'document ocr',
  'face-scan-mobile': 'face scan',
}

/** Edge-type labels, comp-verbatim (one per category cluster). */
const EDGE_LABEL: Record<Offering['deliveryModel'], string> = {
  'managed-deployment': 'managed deployment',
  'hosted-service': 'hosted / api',
  'package-access': 'build + api key',
}

/** Dash patterns from the A2 comp / grammar v1 (solid · dashed · dash-dot). */
const EDGE_DASH: Record<Offering['deliveryModel'], string | undefined> = {
  'managed-deployment': undefined,
  'hosted-service': '7 5',
  'package-access': '18 5 3 5',
}

const CATEGORY_ORDER: OfferingCategory[] = ['product', 'service', 'package']

/* Category wording in accessible names (07c perf-a11y finding 2: a screen-reader
   user must get the category adjacency the clusters give sighted users) — same
   labels the A1 table uses. */
const CATEGORY_LABEL: Record<OfferingCategory, string> = {
  product: 'Product',
  service: 'Service',
  package: 'Package / SDK / API',
}

/** Glyphs per grammar v1: square = product, chevrons = service, hexagon = package. */
function Glyph({ node }: { node: AtlasNode }) {
  const { x, y } = node
  switch (node.category) {
    case 'product':
      return (
        <rect
          className="atlas-glyph"
          x={x - 17}
          y={y - 17}
          width="34"
          height="34"
          fill="none"
          strokeWidth="2"
        />
      )
    case 'service':
      return (
        <g className="atlas-glyph" fill="none" strokeWidth="2">
          <path
            d={`M${x - 20} ${y - 17} L${x} ${y - 2} L${x + 20} ${y - 17}`}
          />
          <path d={`M${x - 20} ${y + 3} L${x} ${y + 18} L${x + 20} ${y + 3}`} />
        </g>
      )
    case 'package':
      return (
        <path
          className="atlas-glyph"
          fill="none"
          strokeWidth="2"
          d={`M${x} ${y - 26.5} L${x + 23} ${y - 13.5} L${x + 23} ${y + 13.5} L${x} ${y + 26.5} L${x - 23} ${y + 13.5} L${x - 23} ${y - 13.5} Z`}
        />
      )
  }
}

/** Bottom of the glyph — where the delivery edge starts. */
function glyphBottom(node: AtlasNode) {
  switch (node.category) {
    case 'product':
      return node.y + 17
    case 'service':
      return node.y + 18
    case 'package':
      return node.y + 26.5
  }
}

/** Top of the glyph — the node label baseline sits above it. */
function glyphTop(node: AtlasNode) {
  switch (node.category) {
    case 'product':
      return node.y - 17
    case 'service':
      return node.y - 17
    case 'package':
      return node.y - 26.5
  }
}

export function AtlasMap({ offerings }: { offerings: Offering[] }) {
  const layout = buildAtlasLayout(offerings)
  return (
    <Diagram
      caption="The portfolio at a glance: each offering reaches customers by its delivery route — solid = managed deployment, dashed = hosted / API, dash-dot = build + key."
      fallback={`${offerings.length} offerings grouped by category. Solid lines identify managed deployment, dashed lines hosted services, and dash-dot lines installed packages with controlled access. Every offering links to its detail page.`}
    >
      {/* Scroll container: SVG text scales with the viewBox transform (06b qa
          lesson) — min-width keeps every label ≥10px rendered; the focusable
          overflow region scrolls, the page never does. */}
      <div
        className="overflow-x-auto"
        tabIndex={0}
        role="group"
        aria-label="Portfolio map (scrollable diagram)"
      >
        <svg
          viewBox="0 0 1100 300"
          className="w-full min-w-[920px] max-w-[1100px]"
          aria-labelledby="atlas-map-title atlas-map-desc"
          data-atlas-map
        >
          {/* <title>/<desc> per grammar v1. NO role="img" here — it would flatten
              the node links out of the accessibility tree. Documented exception:
              .memory/visual-direction/2026-09-01-diagram-grammar-interactive-svg-
              exception.md (proposed, user-batched — perf-a11y finding 1). */}
          <title id="atlas-map-title">
            Portfolio map: every offering and its route to customers
          </title>
          <desc id="atlas-map-desc">
            {offerings.length} offerings grouped by category, each linked to the customers line by its delivery
            type: a solid line for managed deployment, a dashed line for hosted
            or API access, a dash-dot line for build plus controlled access.
          </desc>
          <line
            x1="0"
            y1={layout.baselineY}
            x2={layout.width}
            y2={layout.baselineY}
            className="stroke-ink"
            strokeWidth="1.5"
          />
          <text
            x="8"
            y={layout.baselineY + 25}
            className="fill-ink type-label-diagram"
          >
            customers
          </text>
          {CATEGORY_ORDER.map((category) => {
            const members = layout.nodes.filter(
              (node) => node.category === category,
            )
            if (members.length === 0) return null
            const first = members[0]
            return (
              <g key={category} data-atlas-category={category}>
                {members.map((node) => (
                  <a
                    key={node.id}
                    href={offeringHref(node)}
                    data-atlas-node
                    className="atlas-node"
                    aria-label={`${node.name} — ${CATEGORY_LABEL[node.category]} — ${EDGE_LABEL[node.deliveryModel]}`}
                  >
                    <line
                      className="atlas-edge"
                      x1={node.x}
                      y1={glyphBottom(node)}
                      x2={node.x}
                      y2={layout.baselineY}
                      strokeWidth="2"
                      strokeDasharray={EDGE_DASH[node.deliveryModel]}
                    />
                    <Glyph node={node} />
                    <text
                      className="atlas-node-label fill-ink type-label-diagram"
                      x={node.x}
                      y={glyphTop(node) - 15}
                      textAnchor="middle"
                    >
                      {NODE_LABEL[node.id] ?? node.name.toLowerCase()}
                    </text>
                  </a>
                ))}
                {/* One edge-type label per cluster (comp-verbatim, mono soft). */}
                <text
                  className="atlas-edge-label type-label-diagram"
                  x={first.x + 10}
                  y="180"
                >
                  {EDGE_LABEL[first.deliveryModel]}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </Diagram>
  )
}
