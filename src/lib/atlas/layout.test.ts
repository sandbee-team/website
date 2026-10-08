import { describe, expect, it } from 'vitest'

import { getOfferings } from '@/lib/content'

import { buildAtlasLayout } from './layout'

/*
 * 07c layout evidence: the d3-force computation is deterministic (acceptance 4), the
 * node count stays under the SVG sanity bound (acceptance 2), and the A2 comp
 * geometry holds — one band row, category clusters ordered product → service →
 * package, siblings spread by collision.
 */
describe('atlas layout (d3-force, deterministic)', () => {
  it('is deterministic: two runs over the same content are identical', async () => {
    const offerings = await getOfferings()
    const first = buildAtlasLayout(offerings)
    const second = buildAtlasLayout(offerings)
    expect(second).toEqual(first)
  })

  it('lays out all 8 offerings inside the viewBox band (SVG sanity bound)', async () => {
    const offerings = await getOfferings()
    const { nodes, width, baselineY } = buildAtlasLayout(offerings)
    expect(nodes).toHaveLength(8)
    expect(nodes.length).toBeLessThan(200)
    for (const node of nodes) {
      expect(node.x).toBeGreaterThanOrEqual(70)
      expect(node.x).toBeLessThanOrEqual(width - 70)
      expect(node.y).toBeGreaterThanOrEqual(70)
      expect(node.y).toBeLessThanOrEqual(84)
      expect(node.y).toBeLessThan(baselineY)
    }
  })

  it('clusters by category in comp order and keeps siblings apart', async () => {
    const offerings = await getOfferings()
    const { nodes } = buildAtlasLayout(offerings)
    const xs = (category: string) =>
      nodes.filter((n) => n.category === category).map((n) => n.x)
    expect(Math.max(...xs('product'))).toBeLessThan(Math.min(...xs('service')))
    expect(Math.max(...xs('service'))).toBeLessThan(Math.min(...xs('package')))
    for (const category of ['service', 'package']) {
      const sorted = xs(category).sort((a, b) => a - b)
      for (let i = 1; i < sorted.length; i += 1) {
        expect(sorted[i] - sorted[i - 1]).toBeGreaterThanOrEqual(100)
      }
    }
  })
})
