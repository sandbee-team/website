import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// The styleguide renders every primitive in both surface contexts, so this scan is the
// automated a11y evidence for the whole primitive set (phase-03a acceptance A4).
test('styleguide (all primitives) has no detectable WCAG A/AA violations', async ({
  page,
}) => {
  await page.goto('/styleguide')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
})

test('every interactive primitive is keyboard-reachable with a visible focus ring', async ({
  page,
}) => {
  await page.goto('/styleguide')
  // Tab through the page and collect the outline colour on each focused element.
  const seen: Array<{ tag: string; outline: string; surface: string }> = []
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab')
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null
      if (!el || el === document.body) return null
      const style = getComputedStyle(el)
      return {
        tag: el.tagName,
        outline: `${style.outlineWidth} ${style.outlineStyle} ${style.outlineColor}`,
        surface: el.closest('[data-surface="night"]') ? 'night' : 'light',
      }
    })
    if (info) seen.push(info)
  }
  const interactive = seen.filter((s) =>
    ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'DIV', 'SECTION'].includes(s.tag),
  )
  // All primitives on the page: buttons, links, fields, plus the focusable code region.
  expect(interactive.length).toBeGreaterThanOrEqual(10)
  for (const el of interactive) {
    // 2px solid ring: primary on light grounds, honey on night.
    expect(el.outline).toContain('2px solid')
    expect(el.outline).toContain(
      el.surface === 'night' ? 'rgb(242, 195, 91)' : 'rgb(40, 86, 189)',
    )
  }
})

test('styleguide is noindex and produces no console or network errors', async ({
  page,
}) => {
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
  await page.goto('/styleguide')
  await page.waitForLoadState('networkidle')
  expect(errors).toEqual([])
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    /noindex/,
  )
})
