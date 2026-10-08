import { expect, test } from '@playwright/test'

// Site shell (phase-03b): landmarks, skip link, nav resolution, 404, console health.

test('shell landmarks are present and unique on the home route', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByRole('banner')).toHaveCount(1)
  await expect(page.locator('main#main-content')).toHaveCount(1)
  await expect(page.getByRole('contentinfo')).toHaveCount(1)
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Footer' })).toBeVisible()
})

test('skip link is the first tab stop and moves focus into main', async ({
  page,
}) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeVisible()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Tab')
  const inMain = await page.evaluate(() =>
    Boolean(document.activeElement?.closest('#main-content')),
  )
  expect(inMain).toBe(true)
})

test('primary navigation reaches the catalog, services, developers, pricing and resources', async ({
  page,
}) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Primary' })
  await nav.locator('summary').click()
  await nav.getByRole('link', { name: 'All products' }).click()
  await expect(page).toHaveURL('/products')
  for (const [label, path] of [
    ['Services', '/services'],
    ['Developers', '/packages'],
    ['Pricing', '/pricing'],
    ['Resources', '/blog'],
  ] as const) {
    await nav.getByRole('link', { name: label, exact: true }).click()
    await expect(page).toHaveURL(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  }
})

test('every internal link on the home route resolves (no dead links)', async ({
  page,
  request,
}) => {
  await page.goto('/')
  const hrefs = await page.$$eval('a[href]', (as) =>
    Array.from(
      new Set(
        as
          .map((a) => a.getAttribute('href') ?? '')
          .filter((h) => h.startsWith('/') || h.startsWith('#')),
      ),
    ),
  )
  expect(hrefs.length).toBeGreaterThanOrEqual(7)
  for (const href of hrefs) {
    if (href.startsWith('#')) {
      // Fragment links must target an element that exists.
      expect(await page.locator(href).count()).toBe(1)
    } else {
      const response = await request.get(href)
      expect(response.status(), `${href} should resolve`).toBe(200)
    }
  }
})

test('unknown routes render the 404 page inside the shell with status 404', async ({
  page,
}) => {
  const response = await page.goto('/this-route-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Page not found' }),
  ).toBeVisible()
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Go to the homepage' }),
  ).toBeVisible()
})

test('shell routes produce no console or network errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('requestfailed', (request) => {
    errors.push(`request failed: ${request.url()}`)
  })
  page.on('response', (response) => {
    if (response.status() >= 400) {
      errors.push(`HTTP ${response.status()}: ${response.url()}`)
    }
  })
  for (const path of [
    '/',
    '/products',
    '/packages',
    '/pricing',
    '/services/gst-api',
    '/blog/hosted-api-or-installed-sdk',
    '/services',
    '/technology',
    '/company',
    '/contact',
    // 06b authored portfolio pages.
    '/products/pos',
    '/services/whatsapp-sms-automation',
    '/services/instagram-automation',
    '/services/desktop-notification',
    // 06c technology pages.
    '/technology/electron-tracking',
    '/technology/aadhaar-pan-ocr',
    '/technology/face-scan-mobile',
    // 06d/06e pages.
    '/blog',
    '/stories',
    '/stories/electron-tracking-origin',
    '/custom-technology',
  ]) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
  }
  expect(errors).toEqual([])
})

// 06b: every internal link on the authored portfolio pages resolves (contract
// internal-links sections became real anchors this phase).
for (const origin of [
  '/packages',
  '/pricing',
  '/services/gst-api',
  '/services/whatsapp-sms-automation',
  '/blog/hosted-api-or-installed-sdk',
  '/blog/customer-hosted-ocr-integration',
  '/blog/pos-deployment-handover-checklist',
  '/products',
  '/services',
  '/products/pos',
  '/technology',
  '/technology/electron-tracking',
  '/technology/aadhaar-pan-ocr',
  '/technology/face-scan-mobile',
  '/company',
  '/custom-technology',
  '/stories',
  '/stories/electron-tracking-origin',
  '/contact',
  '/blog',
]) {
  test(`every internal link on ${origin} resolves`, async ({
    page,
    request,
  }) => {
    await page.goto(origin)
    const hrefs = await page.$$eval('a[href]', (as) =>
      Array.from(
        new Set(
          as
            .map((a) => a.getAttribute('href') ?? '')
            .filter((h) => h.startsWith('/') || h.startsWith('#')),
        ),
      ),
    )
    for (const href of hrefs) {
      if (href.startsWith('#')) {
        expect(await page.locator(href).count()).toBe(1)
      } else {
        const response = await request.get(href)
        expect(response.status(), `${href} should resolve`).toBe(200)
      }
    }
  })
}
