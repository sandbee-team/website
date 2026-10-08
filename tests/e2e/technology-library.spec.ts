import { expect, test } from '@playwright/test'

test('technology library distinguishes current developer tools from other directions', async ({
  page,
}) => {
  await page.goto('/technology')
  const current = page
    .locator('main section')
    .filter({
      has: page.getByRole('heading', {
        name: 'Start with GSTIN or Document OCR',
      }),
    })
  await expect(current.locator('li')).toHaveCount(2)
  await expect(
    current.getByRole('link', { name: 'GSTIN', exact: true }),
  ).toHaveAttribute('href', '/services/gst-api')
  await expect(
    current.getByRole('link', { name: 'Document OCR', exact: true }),
  ).toHaveAttribute('href', '/technology/aadhaar-pan-ocr')
  for (const item of await current.locator('li').all())
    await expect(item).toContainText('Free')
  const directions = page
    .locator('main section')
    .filter({
      has: page.getByRole('heading', { name: 'Other technology directions' }),
    })
  await expect(directions).toContainText(
    'contact us to discuss current scope and availability',
  )
  await expect(directions.locator('li')).toHaveCount(2)
  await expect(
    directions.locator('a[href="/technology/electron-tracking"]'),
  ).toBeVisible()
  await expect(
    directions.locator('a[href="/technology/face-scan-mobile"]'),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Open developer resources' }),
  ).toHaveAttribute('href', 'https://store.sandbee.in/developers')
})

test('developer access guidance separates hosted requests, local processing and license verification', async ({
  page,
}) => {
  await page.goto('/technology')
  const section = page
    .locator('main section')
    .filter({
      has: page.getByRole('heading', {
        name: 'Access and processing are different things',
      }),
    })
  await expect(section).toContainText(
    'your backend makes requests to the hosted service',
  )
  await expect(section).toContainText(
    'process documents on your own Node.js server',
  )
  await expect(section).toContainText(
    'internet access for startup verification and periodic license renewal',
  )
  await expect(section).toContainText('The hosted Store demo is separate')
  await expect(section).toContainText('your own infrastructure costs')
})

test.describe('technology library without JavaScript', () => {
  test.use({
    javaScriptEnabled: false,
    contextOptions: { reducedMotion: 'reduce' },
    viewport: { width: 390, height: 844 },
  })
  test('current tools remain readable and keyboard navigation reaches real details', async ({
    page,
  }) => {
    await page.goto('/technology')
    const main = page.locator('main')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const gst = main.getByRole('link', { name: 'GSTIN', exact: true })
    await gst.focus()
    await page.keyboard.press('Tab')
    const ocr = main.getByRole('link', { name: 'Document OCR', exact: true })
    await expect(ocr).toBeFocused()
    await expect(ocr).toHaveCSS('outline-style', 'solid')
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/technology\/aadhaar-pan-ocr$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Extract the text. Keep the document.',
    )
  })
})
