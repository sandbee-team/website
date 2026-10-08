import { expect, test } from '@playwright/test'

/*
 * Diagram label legibility (06b qa finding): CSS font-size on SVG <text> scales with
 * the viewBox→CSS-width transform, so a 12px label inside a 900-unit viewBox rendered
 * into a ~280px mobile container shrinks to ~4-5px. The fix wraps each grammar diagram
 * in a focusable overflow-x container with a min-width that keeps labels >=10px. This
 * spec pins the measured number at the narrowest tier and on desktop, per diagram page.
 */
// EVERY route that renders SVG text (06f F1: the list was 06b-scoped and the identical
// defect survived on the homepage — enumerate by defect class, not by phase).
const PAGES = [
  '/services/instagram-automation',
  '/services/desktop-notification',
]

async function minSvgTextHeight(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    let min = Infinity
    for (const el of document.querySelectorAll('svg text')) {
      const height = el.getBoundingClientRect().height
      if (height > 0 && height < min) min = height
    }
    return min === Infinity ? null : min
  })
}

test.describe('diagram labels stay legible at 320px', () => {
  test.use({ viewport: { width: 320, height: 700 } })
  for (const path of PAGES) {
    test(`${path} SVG labels >= 9.5px at 320`, async ({ page }) => {
      await page.goto(path)
      // The sky story uses HTML stage labels, avoiding SVG text scaling entirely.
      const min = await minSvgTextHeight(page)
      expect(min, `${path} should render diagram labels`).not.toBeNull()
      expect(min as number).toBeGreaterThanOrEqual(9.5)
      // The page itself never scrolls horizontally — only the diagram figure does.
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })
  }
})

test.describe('diagram labels stay legible at 1440px', () => {
  test.use({ viewport: { width: 1440, height: 900 } })
  for (const path of PAGES) {
    test(`${path} SVG labels >= 9.5px at 1440`, async ({ page }) => {
      await page.goto(path)
      const min = await minSvgTextHeight(page)
      expect(min as number).toBeGreaterThanOrEqual(9.5)
    })
  }
})
