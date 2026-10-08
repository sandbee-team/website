import { expect, test } from '@playwright/test'

test('home responds 200 with the approved hero headline', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /Ideas, made\s*beautifully\s*useful\./,
  )
})

test('home is indexable with the contract metadata', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(
    'Sandbee \u2014 useful software, APIs and developer tools',
  )
  const robots = await page
    .locator('meta[name="robots"]')
    .first()
    .getAttribute('content')
  expect(robots).toContain('index')
  expect(robots).not.toContain('noindex')
  // Next normalizes the root canonical to the origin without a trailing slash.
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://sandbee.in',
  )
})

test('brand hero precedes product discovery and honors reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const hero = page.locator('[data-landing-hero]')
  await expect(hero.getByRole('tablist')).toHaveCount(0)
  await expect(hero.locator('[data-product-preview]')).toHaveCount(0)
  await expect(
    hero.getByRole('link', { name: 'Let’s build something' }),
  ).toHaveAttribute('href', '/contact')
  const products = page.getByRole('tablist', {
    name: 'Explore Sandbee products',
  })
  expect((await products.boundingBox())!.y).toBeGreaterThan(
    (await hero.boundingBox())!.height,
  )
  const emblem = page.locator('[data-glass-emblem]')
  const rect = (await emblem.boundingBox())!
  await page.mouse.move(rect.x + rect.width * 0.75, rect.y + rect.height * 0.6)
  await expect
    .poll(() =>
      emblem.evaluate((el) =>
        (el as HTMLElement).style.getPropertyValue('--glass-x'),
      ),
    )
    .not.toBe('')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect
    .poll(() =>
      emblem.evaluate((el) =>
        (el as HTMLElement).style.getPropertyValue('--glass-x'),
      ),
    )
    .toBe('')
  expect(
    await hero.evaluate(
      (el) =>
        el
          .getAnimations({ subtree: true })
          .filter((a) => a.playState === 'running').length,
    ),
  ).toBe(0)
  await hero.getByRole('link', { name: 'Meet Sandbee' }).click()
  await expect(page).toHaveURL(/#what-we-do$/)
  await expect(
    page.getByRole('heading', {
      name: 'Good technology gets out of your way.',
    }),
  ).toBeInViewport()
})

test('brand landing and useful navigation work without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  try {
    const page = await context.newPage()
    await page.goto('http://localhost:3100/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Ideas, made',
    )
    await page.getByRole('link', { name: 'Meet Sandbee', exact: true }).click()
    await expect(page.locator('#what-we-do')).toBeInViewport()
    await page.getByRole('link', { name: /Something of your own/ }).click()
    await expect(page).toHaveURL(/\/custom-technology$/)
  } finally {
    await context.close()
  }
})

test('styleguide renders the MDX fixture through the pipeline', async ({
  page,
}) => {
  await page.goto('/styleguide')
  await expect(
    page.getByRole('heading', { level: 2, name: 'Fixture body heading' }),
  ).toBeVisible()
})

test('home produces no browser console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  // console events alone miss network failures (a favicon 404 slipped past this test once);
  // watch failed requests and error responses too.
  page.on('requestfailed', (request) => {
    errors.push(`request failed: ${request.url()}`)
  })
  page.on('response', (response) => {
    if (response.status() >= 400) {
      errors.push(`HTTP ${response.status()}: ${response.url()}`)
    }
  })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(errors).toEqual([])
})
