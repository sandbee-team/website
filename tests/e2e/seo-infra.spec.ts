import { expect, test } from '@playwright/test'

// SEO infrastructure (phase-04b): the machine layer served by the real build.

test('sitemap.xml lists the launch registry with no priority/changefreq', async ({
  request,
}) => {
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)
  const xml = await response.text()
  for (const path of [
    '/products/pos',
    '/services/whatsapp-sms-automation',
    '/technology/electron-tracking',
    '/stories/electron-tracking-origin',
    '/custom-technology',
    '/blog',
    '/packages',
    '/pricing',
    '/services/gst-api',
    '/blog/hosted-api-or-installed-sdk',
  ]) {
    expect(xml).toContain(`<loc>https://sandbee.in${path}</loc>`)
  }
  // Deliberate exclusions and forbidden fields (ADR-0007 §3).
  expect(xml).not.toContain('/styleguide')
  expect(xml).not.toContain('/privacy')
  expect(xml).not.toContain('/terms')
  expect(xml).not.toContain('<priority>')
  expect(xml).not.toContain('<changefreq>')
})

test('robots.txt allows crawl, hides the styleguide, links the sitemap', async ({
  request,
}) => {
  const response = await request.get('/robots.txt')
  expect(response.status()).toBe(200)
  const text = await response.text()
  expect(text).toContain('Allow: /')
  expect(text).toContain('Disallow: /styleguide')
  expect(text).toContain('Sitemap: https://sandbee.in/sitemap.xml')
})

test('root opengraph-image renders as a PNG', async ({ request }) => {
  const response = await request.get('/opengraph-image')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('image/png')
  const body = await response.body()
  // Real PNG magic bytes and a non-trivial payload (content-length is not sent).
  expect(body.subarray(0, 8)).toEqual(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  )
  expect(body.length).toBeGreaterThan(10_000)
})

test('blog feed serves published articles as valid RSS', async ({
  request,
}) => {
  const response = await request.get('/blog/feed.xml')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/rss+xml')
  const xml = await response.text()
  expect(xml).toContain('<rss version="2.0"')
  expect(xml).toContain('<title>Sandbee Blog</title>')
  expect(xml.match(/<item>/g)).toHaveLength(3)
  for (const slug of [
    'hosted-api-or-installed-sdk',
    'customer-hosted-ocr-integration',
    'pos-deployment-handover-checklist',
  ]) {
    expect(xml).toContain(`https://sandbee.in/blog/${slug}`)
  }
  expect(xml).not.toContain('loader-fixture')
})

test('every page carries the site-wide Organization + WebSite JSON-LD graph', async ({
  page,
}) => {
  for (const path of ['/', '/products/pos']) {
    await page.goto(path)
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const types = scripts.map((s) => JSON.parse(s)['@type'])
    expect(types).toContain('Organization')
    expect(types).toContain('WebSite')
    for (const raw of scripts) {
      expect(() => JSON.parse(raw)).not.toThrow()
      expect(raw).not.toContain('offers')
      expect(raw).not.toContain('aggregateRating')
    }
  }
})
