import { expect, test } from '@playwright/test'

const routes = [
  '/',
  '/products',
  '/services',
  '/packages',
  '/pricing',
  '/blog',
  '/contact',
  '/services/gst-api',
  '/technology/aadhaar-pan-ocr',
  '/services/whatsapp-sms-automation',
  '/products/pos',
]

for (const width of [320, 390, 768, 1440, 1920]) {
  test(`catalog pages contain headings and controls at ${width}px without document overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const route of routes) {
      await page.goto(route)
      const heading = page.getByRole('heading', { level: 1 })
      await expect(heading).toBeVisible()
      const bounds = await heading.boundingBox()
      expect(bounds!.x, route).toBeGreaterThanOrEqual(0)
      expect(bounds!.x + bounds!.width, route).toBeLessThanOrEqual(width + 1)
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        ),
        route,
      ).toBeLessThanOrEqual(0)
    }
  })
}

test('small-phone product tabs have usable touch targets and the main CTA precedes the demo', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/')
  const cta = await page
    .getByRole('link', { name: 'Let’s build something', exact: true })
    .boundingBox()
  const tabs = page.getByRole('tablist', { name: 'Explore Sandbee products' })
  const demo = await tabs.boundingBox()
  expect(cta!.y).toBeLessThan(700 * 1.35)
  expect(cta!.y + cta!.height).toBeLessThan(demo!.y)
  for (const tab of await tabs.getByRole('tab').all()) {
    const box = await tab.boundingBox()
    expect(box!.height).toBeGreaterThanOrEqual(44)
    expect(box!.width).toBeGreaterThanOrEqual(44)
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(320)
  }
})
