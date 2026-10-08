import { expect, test } from '@playwright/test'

test('selected product enquiry validates before preparing an editable email', async ({
  page,
}) => {
  await page.goto('/products/pos')
  await page
    .locator('main')
    .getByRole('link', { name: 'Discuss your POS setup' })
    .first()
    .click()
  await expect(page).toHaveURL(/\/contact\?product=pos$/)
  await expect(page.getByRole('radio', { name: 'Sandbee POS' })).toBeChecked()
  const prepare = page.getByRole('button', { name: 'Prepare my enquiry' })
  await prepare.click()
  await expect(page.getByLabel('Your name', { exact: true })).toBeFocused()
  await expect(page.getByRole('link', { name: 'Open email app' })).toHaveCount(
    0,
  )
  await page.getByLabel('Your name', { exact: true }).fill('Browser Probe')
  await page.getByLabel('Work email', { exact: true }).fill('invalid')
  await page
    .getByLabel('Tell us a little about your workflow')
    .fill('We need billing and kitchen workflows for our restaurant.')
  await prepare.click()
  await expect(page.getByLabel('Work email', { exact: true })).toBeFocused()
  await expect(page.getByRole('link', { name: 'Open email app' })).toHaveCount(
    0,
  )
  await page.getByLabel('Work email', { exact: true }).fill('probe@example.com')
  await page
    .getByLabel('Tell us a little about your workflow')
    .fill('Too short')
  await prepare.click()
  await expect(
    page.getByLabel('Tell us a little about your workflow'),
  ).toBeFocused()
  await expect(page.getByRole('link', { name: 'Open email app' })).toHaveCount(
    0,
  )
  await page
    .getByLabel('Tell us a little about your workflow')
    .fill('We need billing and kitchen workflows for our restaurant.')
  await prepare.click()
  await expect(page.getByRole('status')).toContainText('Your enquiry is ready.')
  const href = await page
    .getByRole('link', { name: 'Open email app' })
    .getAttribute('href')
  const mail = new URL(href!)
  expect(mail.protocol).toBe('mailto:')
  expect(mail.pathname).toBe('sandbee.team@gmail.com')
  expect(mail.searchParams.get('subject')).toBe('Sandbee enquiry: Sandbee POS')
  expect(mail.searchParams.get('body')).toContain('Name: Browser Probe')
  expect(mail.searchParams.get('body')).toContain(
    'Reply email: probe@example.com',
  )
  expect(mail.searchParams.get('body')).toContain(
    'We need billing and kitchen workflows for our restaurant.',
  )
  expect(page.url()).not.toContain('probe')
  await page.getByRole('radio', { name: 'Sandbee Messaging' }).check()
  await expect(page.getByRole('link', { name: 'Open email app' })).toHaveCount(
    0,
  )
  await prepare.click()
  const revised = await page
    .getByRole('link', { name: 'Open email app' })
    .getAttribute('href')
  expect(new URL(revised!).searchParams.get('subject')).toBe(
    'Sandbee enquiry: Sandbee Messaging',
  )
})

test('unknown product query safely defaults to a general enquiry', async ({
  page,
}) => {
  await page.goto('/contact?product=unknown')
  await expect(
    page.getByRole('radio', { name: 'Something else' }),
  ).toBeChecked()
})

test.describe('contact without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('direct email remains available and the inactive composer cannot submit personal data', async ({
    page,
  }) => {
    await page.goto('/contact?product=pos')
    await expect(
      page.locator('main a[href="mailto:sandbee.team@gmail.com"]').first(),
    ).toBeVisible()
    await expect(page.locator('main input:enabled, main textarea:enabled, main button[type="submit"]:enabled')).toHaveCount(0)
    await expect(page.locator('main')).toContainText('JavaScript')
    expect(new URL(page.url()).search).toBe('?product=pos')
  })
})
