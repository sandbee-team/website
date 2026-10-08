import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/*
 * Sky asset integrity (11b defect: the generated cloud file once lost its radial
 * gradients, every puff painted `none`, and EVERY gate still passed — invisible art is
 * not a console error, not an overflow, not an axe violation). This pins the served
 * asset's internal references so a broken paint server fails a unit test instead of
 * shipping an empty sky. Provenance: public/images/sky/README.md (CC0 Openclipart).
 */
const svg = readFileSync(
  join(process.cwd(), 'public/images/sky/clouds.svg'),
  'utf8',
)

describe('public/images/sky/clouds.svg', () => {
  it('exposes the three cloud silhouettes the hero references', () => {
    for (const id of ['cloud-distant', 'cloud-cumulus', 'cloud-soft']) {
      expect(svg).toContain(`<symbol id="${id}"`)
    }
  })

  it('resolves every internal url(#…) and href="#…" reference', () => {
    const ids = new Set([...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
    const refs = [
      ...[...svg.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]),
      ...[...svg.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]),
    ]
    expect(refs.length).toBeGreaterThan(10)
    for (const ref of refs) expect(ids.has(ref), `#${ref} is referenced but undefined`).toBe(true)
    // The puffs paint through the radial gradients — the exact thing that went missing.
    expect(ids.has('radialGradient5529')).toBe(true)
  })

  it('stays pure vector: no raster, scripts, remote references or animated filters', () => {
    // The provenance comment may cite the source URL; the markup itself may only carry
    // the SVG/xlink namespace declarations — no fetching attribute may point off-site.
    const markup = svg.replace(/<!--[\s\S]*?-->/, '')
    expect(markup).not.toMatch(/<image|<script|<filter|<animate/)
    expect(markup).not.toMatch(/(?:href|src)="https?:|url\(\s*["']?https?:/)
  })
})
