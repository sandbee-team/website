import { expect, test } from '@playwright/test'

/*
 * Contact form end-to-end against the real build (ADR-0007 §8 + ADR-0014 Q14):
 * validation, honeypot, and the HONEST transport-pending failure (the e2e server runs
 * without CONTACT_TRANSPORT_URL, so a genuine delivery is impossible and the form must
 * say so — never a fake success). Progressive enhancement is proven with JavaScript
 * disabled: the plain <form action> POST re-renders the page with the returned state.
 *
 * Budget note: the per-IP rate limit is 5 submissions / 10 min and every non-honeypot
 * submit here consumes one — keep total submissions in this file under 5.
 */

const PENDING_LINE =
  'The message did not send — the form is not connected yet. Please email sandbee.team@gmail.com.'

test('public contact page provides a truthful email composer and direct email', async ({
  page,
}) => {
  await page.goto('/contact')
  await expect(
    page.locator('main a[href="mailto:sandbee.team@gmail.com"]'),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Prepare my enquiry' }),
  ).toBeVisible()
  await expect(
    page.getByText('Your enquiry is sent only when', { exact: false }),
  ).toBeVisible()
})

test('empty submit returns deck field errors (server-side validation)', async ({
  page,
}) => {
  await page.goto('/styleguide#contact-form-preview')
  await page.getByRole('button', { name: 'Send the message' }).click()
  await expect(page.getByText('Error — Enter your name.')).toBeVisible()
  await expect(page.getByText('Error — Enter an email address.')).toBeVisible()
  await expect(
    page.getByText('Error — Tell us what you are building.'),
  ).toBeVisible()
})

test('valid submit reports the honest transport-pending failure, never success', async ({
  page,
}) => {
  await page.goto('/styleguide#contact-form-preview')
  await page.getByLabel('Name', { exact: true }).fill('Playwright Probe')
  await page.getByLabel('Email', { exact: true }).fill('probe@example.com')
  await page.getByLabel('What are you building?').fill('An e2e check.')
  await page.getByRole('button', { name: 'Send the message' }).click()
  await expect(page.getByText(PENDING_LINE)).toBeVisible()
  await expect(page.getByText('Received. We will reply by email.')).toHaveCount(
    0,
  )
})

test.describe('progressive enhancement (JavaScript disabled)', () => {
  test.use({ javaScriptEnabled: false })
  test('the plain form POST works and keeps sticky values', async ({
    page,
  }) => {
    await page.goto('/styleguide#contact-form-preview')
    await page.getByLabel('Name', { exact: true }).fill('No JS')
    await page.getByLabel('Email', { exact: true }).fill('nojs@example.com')
    await page.getByLabel('What are you building?').fill('A no-JS submit.')
    await page.getByRole('button', { name: 'Send the message' }).click()
    // Full-page re-render carries the honest state and the entered values.
    await expect(page.getByText(PENDING_LINE)).toBeVisible()
    await expect(page.getByLabel('Name', { exact: true })).toHaveValue('No JS')
    await expect(page.getByLabel('Email', { exact: true })).toHaveValue(
      'nojs@example.com',
    )
  })
})

test('honeypot submission gets the generic failure (no success, no crash)', async ({
  page,
}) => {
  await page.goto('/styleguide#contact-form-preview')
  await page.getByLabel('Name', { exact: true }).fill('Bot')
  await page.getByLabel('Email', { exact: true }).fill('bot@example.com')
  await page.getByLabel('What are you building?').fill('Spam.')
  // Fill the visually hidden honeypot the way a naive bot would.
  await page
    .locator('input[name="hp_field"]')
    .evaluate((el: HTMLInputElement) => {
      el.value = 'https://spam.example'
    })
  await page.getByRole('button', { name: 'Send the message' }).click()
  await expect(
    page.getByText('Error — the message did not send. Try again.'),
  ).toBeVisible()
  await expect(page.getByText('Received. We will reply by email.')).toHaveCount(
    0,
  )
})

test('story page serves the §13 body server-rendered', async ({ page }) => {
  await page.goto('/stories/electron-tracking-origin')
  const h2s = await page.locator('main h2').allTextContents()
  expect(h2s).toEqual([
    'The problem',
    'What existed',
    'What was missing',
    'What Sandbee engineered',
    'What became reusable',
  ])
  await expect(
    page.getByText(
      /Not every client project should automatically become a product\./,
    ),
  ).toBeVisible()
})
