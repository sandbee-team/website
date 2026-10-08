import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AtlasIndex } from '@/components/technology/atlas-index'
import { AtlasMap } from '@/components/technology/atlas-map'
import { getOfferings } from '@/lib/content'

/*
 * 07c map-layer contract: the A2 band renders server-side as SVG whose every node is
 * a real <a> to its ADR-0005 detail route (acceptance 4), edge types are dash-pattern
 * + label distinct (acceptance 5, never colour alone), labels are comp-verbatim, and
 * the band sits ABOVE the A1 table (approved moments record).
 */
describe('atlas map layer (RTL)', () => {
  it('renders every offering as a real link to its detail route', async () => {
    const { container } = render(<AtlasMap offerings={await getOfferings()} />)
    const nodes = Array.from(
      container.querySelectorAll('a[data-atlas-node]'),
    ) as SVGAElement[]
    expect(nodes).toHaveLength(8)
    // Accessible names carry name + category + delivery type (perf-a11y finding 2:
    // the category adjacency must reach non-visual users too).
    expect(nodes[0].getAttribute('aria-label')).toBe(
      'Sandbee POS — Product — managed deployment',
    )
    expect(
      nodes
        .find(
          (node) =>
            node.getAttribute('href') === '/technology/electron-tracking',
        )
        ?.getAttribute('aria-label'),
    ).toMatch(/ — Package \/ SDK \/ API — build \+ api key$/)
    const hrefs = nodes.map((node) => node.getAttribute('href'))
    expect(hrefs).toEqual([
      '/products/pos',
      '/services/gst-api',
      '/services/whatsapp-sms-automation',
      '/services/instagram-automation',
      '/services/desktop-notification',
      '/technology/electron-tracking',
      '/technology/aadhaar-pan-ocr',
      '/technology/face-scan-mobile',
    ])
  })

  it('distinguishes delivery-model edges by dash pattern, not colour (grammar v1)', async () => {
    const { container } = render(<AtlasMap offerings={await getOfferings()} />)
    const dashOf = (href: string) =>
      container
        .querySelector(`a[href='${href}'] .atlas-edge`)
        ?.getAttribute('stroke-dasharray') ?? null
    expect(dashOf('/products/pos')).toBeNull()
    expect(dashOf('/services/whatsapp-sms-automation')).toBe('7 5')
    expect(dashOf('/technology/electron-tracking')).toBe('18 5 3 5')
    // ...and each edge type carries its comp-verbatim mono label.
    const edgeLabels = Array.from(
      container.querySelectorAll('.atlas-edge-label'),
    ).map((el) => el.textContent)
    expect(edgeLabels).toEqual([
      'managed deployment',
      'hosted / api',
      'build + api key',
    ])
  })

  it('draws grammar glyphs per category: square, chevrons, hexagon', async () => {
    const { container } = render(<AtlasMap offerings={await getOfferings()} />)
    expect(
      container.querySelectorAll("a[href='/products/pos'] rect.atlas-glyph"),
    ).toHaveLength(1)
    expect(
      container.querySelectorAll(
        "a[href='/services/instagram-automation'] g.atlas-glyph path",
      ),
    ).toHaveLength(2)
    const hexagon = container.querySelector(
      "a[href='/technology/face-scan-mobile'] path.atlas-glyph",
    )
    expect(hexagon?.getAttribute('d')).toMatch(/Z$/)
  })

  it('names the map accessibly and carries the text fallback', async () => {
    const { container } = render(<AtlasMap offerings={await getOfferings()} />)
    const svg = container.querySelector('svg[data-atlas-map]')
    expect(svg?.getAttribute('aria-labelledby')).toBe(
      'atlas-map-title atlas-map-desc',
    )
    expect(svg?.querySelector('title')?.textContent).toBe(
      'Portfolio map: every offering and its route to customers',
    )
    expect(svg?.hasAttribute('role')).toBe(false)
    expect(svg?.querySelector('desc')?.textContent).toContain(
      '8 offerings grouped by category',
    )
    expect(
      screen.getByText(/8 offerings grouped by category\. Solid lines/),
    ).toBeDefined()
    // Comp-verbatim node labels.
    for (const label of [
      'POS · product',
      'messaging',
      'gstin api',
      'instagram',
      'desktop notif.',
      'electron tracking',
      'document ocr',
      'face scan',
    ]) {
      expect(screen.getByText(label)).toBeDefined()
    }
    expect(screen.getByText('customers')).toBeDefined()
  })

  it('can compose the optional map with its semantic table fallback', async () => {
    const offerings = await getOfferings()
    const { container } = render(
      <>
        <AtlasMap offerings={offerings} />
        <AtlasIndex offerings={offerings} />
      </>,
    )
    const map = container.querySelector('svg[data-atlas-map]')
    const table = container.querySelector('table')
    expect(map).not.toBeNull()
    expect(table).not.toBeNull()
    expect(
      map!.compareDocumentPosition(table!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })
})
