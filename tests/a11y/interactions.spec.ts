import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

test('selected OCR tab and open desktop navigation have no detectable WCAG violations', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('tab', { name: 'OCR', exact: true }).click()
  await page
    .getByRole('navigation', { name: 'Primary' })
    .locator('summary')
    .click()
  await expect(
    page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'All products' }),
  ).toBeVisible()
  expect(
    (await new AxeBuilder({ page }).withTags(tags).analyze()).violations,
  ).toEqual([])
})

test('filtered product catalog has no detectable WCAG violations', async ({
  page,
}) => {
  await page.goto('/products')
  await page
    .getByRole('button', { name: 'Developer package', exact: true })
    .click()
  await expect(page.locator('main article')).toHaveCount(1)
  expect(
    (await new AxeBuilder({ page }).withTags(tags).analyze()).violations,
  ).toEqual([])
})

test('expanded product FAQ has no detectable WCAG violations', async ({
  page,
}) => {
  await page.goto('/products/pos')
  await page.locator('#questions summary').first().click()
  await expect(
    page.locator('#questions details').first().locator('p'),
  ).toBeVisible()
  expect(
    (await new AxeBuilder({ page }).withTags(tags).analyze()).violations,
  ).toEqual([])
})

test('open mobile menu has no detectable WCAG violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.locator('summary[aria-label="Open navigation"]').click()
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation' }),
  ).toBeVisible()
  expect(
    (await new AxeBuilder({ page }).withTags(tags).analyze()).violations,
  ).toEqual([])
})

test('prepared contact enquiry is announced and has no detectable WCAG violations', async ({
  page,
}) => {
  await page.goto('/contact?product=messaging')
  await page.getByLabel('Your name', { exact: true }).fill('Browser Probe')
  await page.getByLabel('Work email', { exact: true }).fill('probe@example.com')
  await page
    .getByLabel('Tell us a little about your workflow')
    .fill('Please discuss messaging access for our order notifications.')
  await page.getByRole('button', { name: 'Prepare my enquiry' }).click()
  await expect(page.getByRole('status')).toContainText('Your enquiry is ready.')
  expect(
    (await new AxeBuilder({ page }).withTags(tags).analyze()).violations,
  ).toEqual([])
})
