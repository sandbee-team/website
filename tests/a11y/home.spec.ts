import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Quality bar: WCAG 2.2 AA plus named extras (ADR-0009 §1). axe covers the automated subset;
// manual keyboard/zoom/reduced-motion passes are phase-10a's job.
test('home route has no detectable WCAG A/AA violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
})
