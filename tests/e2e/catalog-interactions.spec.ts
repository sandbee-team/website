import { expect, test } from '@playwright/test'

test('product tabs select with click and arrow, Home and End keys', async ({
  page,
}) => {
  await page.goto('/')
  const tabs = page
    .getByRole('tablist', { name: 'Explore Sandbee products' })
    .getByRole('tab')
  const panel = page.getByRole('tabpanel')
  await expect(tabs).toHaveCount(4)
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')
  await tabs.nth(1).click()
  await expect(panel.locator('[data-product-preview="ocr"]')).toBeVisible()
  await expect(panel).toHaveAccessibleName('OCR')
  await page.keyboard.press('ArrowRight')
  await expect(tabs.nth(2)).toBeFocused()
  await expect(
    panel.locator('[data-product-preview="messaging"]'),
  ).toBeVisible()
  await page.keyboard.press('End')
  await expect(tabs.nth(3)).toBeFocused()
  await expect(panel.locator('[data-product-preview="pos"]')).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(tabs.nth(0)).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(tabs.nth(3)).toBeFocused()
  await page.keyboard.press('Home')
  await expect(tabs.nth(0)).toBeFocused()
  await expect(panel.locator('[data-product-preview="gst"]')).toBeVisible()
  await expect(page.getByRole('tab', { selected: true })).toHaveCount(1)
  await expect(
    page.getByRole('tab', { selected: false }).first(),
  ).toHaveAttribute('tabindex', '-1')
  await page.keyboard.press('Tab')
  await expect(panel).toBeFocused()
})

test('catalog filters announce the result count and restore every product', async ({
  page,
}) => {
  await page.goto('/products')
  const filters = page.getByRole('group', { name: 'Filter products' })
  const cards = page.locator('main article')
  await expect(cards).toHaveCount(4)
  for (const [category, names] of [
    ['API service', ['GSTIN', 'Sandbee Messaging']],
    ['Developer package', ['Document OCR']],
    ['Business software', ['Sandbee POS']],
    [
      'All products',
      ['GSTIN', 'Document OCR', 'Sandbee Messaging', 'Sandbee POS'],
    ],
  ] as const) {
    const button = filters.getByRole('button', { name: category, exact: true })
    await button.focus()
    await page.keyboard.press('Enter')
    await expect(button).toHaveAttribute('aria-pressed', 'true')
    await expect(cards).toHaveCount(names.length)
    for (const name of names)
      await expect(cards.getByRole('heading', { name })).toBeVisible()
    await expect(page.getByRole('status')).toContainText(
      `${names.length} product`,
    )
  }
})

test('reduced motion preserves tab selection without long-running animation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('tab', { name: 'POS', exact: true }).click()
  await expect(
    page.getByRole('tabpanel').locator('[data-product-preview="pos"]'),
  ).toBeVisible()
  expect(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter(
            (animation) =>
              animation.playState === 'running' &&
              Number(animation.effect?.getTiming().duration) > 50,
          ).length,
    ),
  ).toBe(0)
})

test.describe('catalog without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  for (const route of ['/', '/products']) {
    test(`${route} keeps all product descriptions, prices and working links`, async ({
      page,
    }) => {
      await page.goto(route)
      for (const name of [
        'GSTIN',
        'Document OCR',
        'Sandbee Messaging',
        'Sandbee POS',
      ]) {
        const card = page
          .locator('main article')
          .filter({ has: page.getByRole('heading', { name, exact: true }) })
        await expect(card).toBeVisible()
        await expect(card.locator('p').first()).not.toBeEmpty()
      }
      await page
        .locator('main')
        .getByRole('link', { name: 'Explore Document OCR', exact: true })
        .click()
      await expect(page).toHaveURL(/\/technology\/aadhaar-pan-ocr$/)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        'Extract the text. Keep the document.',
      )
    })
  }
})
