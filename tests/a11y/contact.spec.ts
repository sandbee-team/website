import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/*
 * Contact-form a11y (06d perf-a11y findings 1–3): persisted axe coverage of the form's
 * idle AND post-invalid-submit states, plus mechanical focus-management assertions —
 * the field primitive's caller contract says the composing form must route focus to
 * the first invalid control (JS re-render) and carry autofocus on the server-rendered
 * error page (no-JS). Budget note: submits here consume the shared per-IP rate limit
 * (5/10 min) — keep total non-honeypot submissions across e2e+a11y under the limit.
 */

test('idle contact form has no detectable WCAG A/AA violations', async ({
  page,
}) => {
  await page.goto('/styleguide#contact-form-preview')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
})

test('post-invalid-submit: axe clean and focus moves to the first invalid control', async ({
  page,
}) => {
  await page.goto('/styleguide#contact-form-preview')
  await page.getByRole('button', { name: 'Send the message' }).click()
  await expect(page.getByText('Error — Enter your name.')).toBeVisible()
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
  // JS path: the effect moves focus to the first invalid control.
  const active = await page.evaluate(() => ({
    id: (document.activeElement as HTMLElement | null)?.id ?? '',
    invalid:
      (document.activeElement as HTMLElement | null)?.getAttribute(
        'aria-invalid',
      ) ?? '',
  }))
  expect(active.id).toBe('name')
  expect(active.invalid).toBe('true')
})

test.describe('no-JS error page', () => {
  test.use({ javaScriptEnabled: false })
  test('server-rendered error page autofocuses the first invalid control', async ({
    page,
  }) => {
    await page.goto('/styleguide#contact-form-preview')
    // Fill only the email so 'name' is the first invalid field after the POST.
    await page
      .getByLabel('Email', { exact: true })
      .fill('nojs-focus@example.com')
    await page.getByRole('button', { name: 'Send the message' }).click()
    await expect(page.getByText('Error — Enter your name.')).toBeVisible()
    const activeId = await page.evaluate(
      () => (document.activeElement as HTMLElement | null)?.id ?? '',
    )
    expect(activeId).toBe('name')
  })
})
