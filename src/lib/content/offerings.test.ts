import { describe, expect, it } from 'vitest'

import { getOffering, getOfferingParams, getOfferings } from './offerings'

// Loader tests run against the real fixtures — the reference §15 portfolio (ADR-0011).

describe('offerings loader', () => {
  it('loads current and legacy offerings in category and display order', async () => {
    const offerings = await getOfferings()
    expect(offerings.map((o) => o.id)).toEqual([
      'pos',
      'gst-api',
      'whatsapp-sms-automation',
      'instagram-automation',
      'desktop-notification',
      'electron-tracking',
      'aadhaar-pan-ocr',
      'face-scan-mobile',
    ])
  })

  it('splits by category matching each directory', async () => {
    expect((await getOfferings('product')).map((o) => o.id)).toEqual(['pos'])
    expect(await getOfferings('service')).toHaveLength(4)
    expect(await getOfferings('package')).toHaveLength(3)
  })

  it('leaves status unset on every fixture until Q6 assigns labels', async () => {
    const offerings = await getOfferings()
    expect(offerings.every((o) => o.status === undefined)).toBe(true)
  })

  it('types every delivery edge (graft 8)', async () => {
    const offerings = await getOfferings()
    const models = new Set(offerings.map((o) => o.deliveryModel))
    expect(models).toEqual(
      new Set(['managed-deployment', 'hosted-service', 'package-access']),
    )
  })

  it('resolves a single offering by category and slug', async () => {
    const pos = await getOffering('product', 'pos')
    expect(pos?.name).toBe('Sandbee POS')
    expect(pos?.exampleDelivery).toBe(
      'Sandbee setup in the customer Vercel account',
    )
    expect(await getOffering('product', 'does-not-exist')).toBeUndefined()
  })

  it('produces non-empty static params per category (Cache Components rule)', async () => {
    for (const category of ['product', 'service', 'package'] as const) {
      const params = await getOfferingParams(category)
      expect(params.length).toBeGreaterThanOrEqual(1)
      expect(params[0]).toHaveProperty('slug')
    }
  })
})
