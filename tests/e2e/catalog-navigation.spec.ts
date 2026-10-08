import { expect, test } from '@playwright/test'

test('desktop product disclosure supports keyboard, Escape, outside click and navigation', async ({
  page,
}) => {
  await page.goto('/')
  const primary = page.getByRole('navigation', { name: 'Primary' })
  const menu = primary.locator('details')
  const trigger = menu.locator('summary')
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(menu).toHaveAttribute('open', '')
  await expect(menu.getByRole('link', { name: 'All products' })).toBeVisible()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Escape')
  await expect(menu).not.toHaveAttribute('open')
  await expect(trigger).toBeFocused()
  await trigger.click()
  // The mega menu covers the headline; click the uncovered page margin.
  await page.mouse.click(5, 700)
  await expect(menu).not.toHaveAttribute('open')
  await trigger.click()
  await menu.getByRole('link', { name: /Document OCR/ }).click()
  await expect(page).toHaveURL(/\/technology\/aadhaar-pan-ocr$/)
  await expect(menu).not.toHaveAttribute('open')
})

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } })
  test('menu fits the screen and closes on Escape and route changes', async ({
    page,
  }) => {
    await page.goto('/')
    const trigger = page.locator('summary[aria-label="Open navigation"]')
    const menu = page.getByRole('navigation', { name: 'Mobile navigation' })
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden()
    await trigger.click()
    await expect(menu).toBeVisible()
    await menu.getByRole('link', { name: 'Pricing', exact: true }).focus()
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect(trigger).toBeFocused()
    await trigger.click()
    await menu.getByRole('link', { name: 'Sandbee POS', exact: true }).click()
    await expect(page).toHaveURL(/\/products\/pos$/)
    await expect(menu).toBeHidden()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390)
  })
})

test.describe('native navigation without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  for (const width of [390, 1440]) {
    test(`disclosure opens and navigates at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      const trigger =
        width === 390
          ? page.locator('summary[aria-label="Open navigation"]')
          : page.getByRole('navigation', { name: 'Primary' }).locator('summary')
      await trigger.focus()
      await page.keyboard.press('Enter')
      const menu = page.getByRole('navigation', {
        name: width === 390 ? 'Mobile navigation' : 'Primary',
      })
      await menu
        .getByRole('link', { name: 'All products', exact: true })
        .click()
      await expect(page).toHaveURL(/\/products$/)
      await expect(page.locator('main article')).toHaveCount(4)
    })
  }
})
