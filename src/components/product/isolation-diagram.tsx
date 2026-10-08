import { Diagram } from '@/components/primitives'
import { RovingFocus } from '@/components/motion/roving-focus'

/*
 * Approved moment I1 "lit column" (G2 moments record), interactive since 07d. Job
 * (comp-verbatim): make "your deployment is yours alone" visible — focus one customer
 * and their entire private stack lights with them. Three schematic customer columns
 * (labels "customer a/b/c" are schematic, not real customers — comp annotation), each
 * with its own deployment → database → configuration stack and a support path
 * (reference §6 semantics; §8 chain).
 * Interaction is the CSS rung (globals.css .iso-column rules — the 07c cascade-layer
 * lesson: state-controlled paint lives in the components layer, never as utilities):
 * hover/focus a customer column → sand fill + honey-deep strokes light that stack
 * (the diagram's ONE honey element, grammar rule 3; fill + stroke-width carry the
 * state, never colour alone). At rest the middle column holds the emphasis
 * (comp-verbatim static frame, honey-allowlisted since 06b); while another column is
 * active the resting emphasis returns to the EQUAL-STRENGTH default — adds-only,
 * nothing ever dims below default (I1 rule). Columns are keyboard-focusable groups
 * whose aria-labels state the full path, so nothing is hover-only; a plain-DOM roving
 * island adds arrow-key movement. NO role="img" on this svg — interactive descendants
 * would be flattened out of the accessibility tree: documented exception record
 * .memory/visual-direction/2026-09-01-diagram-grammar-interactive-svg-exception.md
 * (proposed, user-batched).
 */
const COLUMNS = [
  { x: 40, label: 'customer a', emphasised: false },
  { x: 355, label: 'customer b', emphasised: true },
  { x: 675, label: 'customer c', emphasised: false },
]
const ROWS = ['deployment', 'database', 'configuration']

export function IsolationDiagram() {
  return (
    <Diagram
      caption="Each customer's deployment is separate — no shared environment."
      fallback="Three customer columns, each with its own deployment, database and configuration and its own support path — separate deployment, database, data, configuration and management per customer."
    >
      {/* Scroll container: SVG text scales with the viewBox transform, so labels go
          sub-legible when 900 units compress below ~750px (06b qa finding — measured
          5px at 320). A min-width + focusable overflow-x region keeps every label
          >=10px at all tiers; the page itself never scrolls horizontally. */}
      <div
        className="overflow-x-auto"
        tabIndex={0}
        role="group"
        aria-label="Every customer, a private stack (scrollable diagram)"
      >
        <svg
          viewBox="0 0 900 300"
          className="w-full min-w-[760px] max-w-[900px]"
          aria-labelledby="isolation-title isolation-desc"
          data-iso
        >
          {/* <title>/<desc> per diagram grammar v1's accessibility rule. */}
          <title id="isolation-title">Every customer, a private stack</title>
          <desc id="isolation-desc">
            Three customer columns; each customer has its own deployment,
            database and configuration; focusing or hovering a customer
            highlights their entire private stack.
          </desc>
          {COLUMNS.map((column) => (
            <g
              key={column.label}
              className="iso-column"
              data-iso-column
              data-emphasised={column.emphasised ? '' : undefined}
              tabIndex={0}
              role="group"
              aria-label={`${column.label}: own deployment, database and configuration, with its own support path — separate from every other customer`}
            >
              {/* Invisible hit area: cells are unfilled, so without this the hover
                  region would be strokes and text only. */}
              <rect
                x={column.x - 10}
                y="8"
                width="190"
                height="262"
                fill="transparent"
                stroke="none"
              />
              <text
                x={column.x + 20}
                y="24"
                className="iso-col-label type-label-diagram"
              >
                {column.label}
              </text>
              {ROWS.map((row, index) => (
                <g key={row}>
                  <rect
                    x={column.x}
                    y={40 + index * 60}
                    width="150"
                    height="34"
                    className="iso-cell"
                  />
                  <text
                    x={column.x + 12}
                    y={62 + index * 60}
                    className="iso-cell-label type-label-diagram"
                  >
                    {row}
                  </text>
                  {index < ROWS.length - 1 ? (
                    <line
                      x1={column.x + 75}
                      y1={74 + index * 60}
                      x2={column.x + 75}
                      y2={100 + index * 60}
                      className="iso-connector"
                    />
                  ) : null}
                </g>
              ))}
              <text
                x={column.x + 30}
                y="250"
                className="iso-support type-label-diagram"
              >
                support path
              </text>
            </g>
          ))}
          <line
            x1="20"
            y1="278"
            x2="880"
            y2="278"
            className="stroke-ink"
            strokeWidth="1"
          />
        </svg>
      </div>
      {/* 07d: plain-DOM arrow-key roving between the three customer columns (tab
          already reaches each one) — deletable without information loss. */}
      <RovingFocus container="svg[data-iso]" items="[data-iso-column]" />
    </Diagram>
  )
}
