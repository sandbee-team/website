import { forceCollide, forceSimulation, forceX, forceY } from 'd3-force'
import type { SimulationNodeDatum } from 'd3-force'

import type { Offering, OfferingCategory } from '@/types/content'

/*
 * Atlas map layout (07c): a deterministic d3-force computation (ADR-0007 §6) that
 * reproduces the approved A2 "map-first band" geometry (2026-08-31 signature-moments
 * record): category clusters on one node band above the customers line. Build-time by
 * construction — /technology is a static route, so this runs during prerender, and the
 * interactive layer and the no-JS SVG consume the same positions. Determinism: every
 * node gets an explicit seed position (no phyllotaxis), tick count is fixed, and
 * d3-force's jiggle uses its own seeded LCG — same input order, same output, every
 * build (recorded in the 07c session recap).
 */

export interface AtlasNode {
  id: string
  slug: string
  name: string
  category: OfferingCategory
  deliveryModel: Offering['deliveryModel']
  x: number
  y: number
}

export interface AtlasLayout {
  nodes: AtlasNode[]
  /** viewBox width — A2 comp geometry. */
  width: number
  /** viewBox height — A2 comp geometry. */
  height: number
  /** y of the customers hairline (A2 comp). */
  baselineY: number
}

interface SimNode extends SimulationNodeDatum {
  offering: Offering
}

const WIDTH = 1100
const HEIGHT = 300
const BASELINE_Y = 260
/** Node-band centre (A2 comp glyph centres sit near y=77). */
const BAND_Y = 77
/** Cluster centres per category (A2 comp: product left, services middle, packages right). */
const CATEGORY_CENTER_X: Record<OfferingCategory, number> = {
  product: 90,
  service: 450,
  package: 880,
}
const CATEGORY_ORDER: OfferingCategory[] = ['product', 'service', 'package']
/** Seed spacing between cluster siblings — the comp used ≈130 with start-anchored
    labels; middle-anchored lowercase labels need 140 so the two longest package
    labels clear each other with margin (07c qa finding 1, e2e-gated). */
const SEED_SPACING = 140
const TICKS = 300

function round(value: number) {
  return Math.round(value * 100) / 100
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function buildAtlasLayout(offerings: Offering[]): AtlasLayout {
  const simNodes: SimNode[] = CATEGORY_ORDER.flatMap((category) => {
    const members = offerings
      .filter((offering) => offering.category === category)
      .sort((a, b) => a.order - b.order)
    return members.map((offering, index) => ({
      offering,
      // Explicit deterministic seed: siblings spread around the cluster centre.
      x:
        CATEGORY_CENTER_X[category] +
        (index - (members.length - 1) / 2) * SEED_SPACING,
      y: BAND_Y,
    }))
  })

  const simulation = forceSimulation(simNodes)
    .force(
      'cluster-x',
      forceX<SimNode>(
        (node) => CATEGORY_CENTER_X[node.offering.category],
      ).strength(0.12),
    )
    .force('band-y', forceY<SimNode>(BAND_Y).strength(1))
    .force('collide', forceCollide<SimNode>(70))
    .stop()
  for (let i = 0; i < TICKS; i += 1) simulation.tick()

  return {
    nodes: simNodes.map((node) => ({
      id: node.offering.id,
      slug: node.offering.slug,
      name: node.offering.name,
      category: node.offering.category,
      deliveryModel: node.offering.deliveryModel,
      // Clamped so glyphs and labels stay inside the viewBox; the band clamp keeps
      // the single-row comp geometry even if a future sibling count grows.
      x: round(clamp(node.x ?? BAND_Y, 70, WIDTH - 70)),
      y: round(clamp(node.y ?? BAND_Y, 70, 84)),
    })),
    width: WIDTH,
    height: HEIGHT,
    baselineY: BASELINE_Y,
  }
}
