import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Shell a11y (phase-03b): axe over a scaffold page and the 404, plus a keyboard pass
// across both shell surfaces (light header / night footer focus rings).
// 06b extends the sweep to every authored portfolio page (all three service pages —
// they share a template but exercise three distinct conditional-section combinations:
// fit-only, deferral-only, deferral+no-fit — 06b qa finding).

// 06c adds the technology surfaces (authored index + Atlas table + all three package
// pages — the template's conditional sections differ per package).
// 06d adds the company/custom/stories/story surfaces (contact was already swept; its
// authored form + router replaced the scaffold this phase).
for (const path of [
  '/packages',
  '/pricing',
  '/services/gst-api',
  '/blog/hosted-api-or-installed-sdk',
  '/blog/customer-hosted-ocr-integration',
  '/blog/pos-deployment-handover-checklist',
  '/products',
  '/contact',
  '/services',
  '/products/pos',
  '/services/whatsapp-sms-automation',
  '/services/instagram-automation',
  '/services/desktop-notification',
  '/technology',
  '/technology/electron-tracking',
  '/technology/aadhaar-pan-ocr',
  '/technology/face-scan-mobile',
  '/company',
  '/custom-technology',
  '/stories',
  '/stories/electron-tracking-origin',
  '/blog',
]) {
  test(`${path} (shell + scaffold) has no detectable WCAG A/AA violations`, async ({
    page,
  }) => {
    await page.goto(path)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })
}

test('404 page has no detectable WCAG A/AA violations', async ({ page }) => {
  await page.goto('/this-route-does-not-exist')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
})

test('header and footer links show visible focus rings on their surfaces', async ({
  page,
}) => {
  await page.goto('/products')
  for (const role of ['banner', 'contentinfo'] as const) {
    const surface = page.getByRole(role)
    const links = surface.getByRole('link')
    await links.first().focus()
    const seen: string[] = []
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab')
      const focused = surface.locator(':focus-visible')
      await expect(focused).toHaveCount(1)
      const outline = await focused.evaluate((el) => {
        const style = getComputedStyle(el)
        return `${style.outlineWidth} ${style.outlineStyle} ${style.outlineColor}`
      })
      expect(outline).toContain('2px solid')
      expect(outline).toContain('rgb(40, 86, 189)')
      seen.push(outline)
    }
    expect(seen).toHaveLength(6)
  }
})
