import { expect, test } from '@playwright/test'

/*
 * Sitemap ⊆ indexable (06b qa follow-up; pending list emptied at 06e): every URL the
 * sitemap advertises must be indexable — a noindex page in the sitemap is a signal
 * conflict. The registry deliberately excludes /privacy, /terms and /styleguide
 * (routes.ts), so this spec needs no exception list; if a future phase must ship a
 * sitemap route as noindex temporarily, it re-introduces an explicit PENDING list with
 * a named decision in that phase's 05-review — never silently.
 */
test('every sitemap URL is indexable', async ({ page, request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  const paths = [
    ...xml.matchAll(/<loc>https:\/\/sandbee\.in([^<]*)<\/loc>/g),
  ].map((match) => match[1] || '/')
  expect(paths.length).toBeGreaterThanOrEqual(16)
  for (const path of paths) {
    await page.goto(path)
    const robots = await page
      .locator('meta[name="robots"]')
      .first()
      .getAttribute('content')
    expect(robots, `${path} must not be noindex`).not.toContain('noindex')
  }
})

test('excluded placeholder routes stay noindex and out of the sitemap', async ({
  page,
  request,
}) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  for (const path of ['/privacy', '/terms', '/styleguide']) {
    expect(xml).not.toContain(`<loc>https://sandbee.in${path}</loc>`)
  }
  // /blog: thin while zero posts (06f F14) — noindex, out of the sitemap; the
  // 06e first-post checklist flips it back with the route + alternate + tier chrome.
  for (const path of ['/privacy', '/terms']) {
    await page.goto(path)
    const robots = await page
      .locator('meta[name="robots"]')
      .first()
      .getAttribute('content')
    expect(robots, `${path} must stay noindex until Q8 text ships`).toContain(
      'noindex',
    )
  }
})
