import { expect, test } from '@playwright/test'

const slugs = [
  'hosted-api-or-installed-sdk',
  'customer-hosted-ocr-integration',
  'pos-deployment-handover-checklist',
]

test('blog listing links to three published guides with dates and RSS', async ({
  page,
}) => {
  await page.goto('/blog')
  await expect(page.locator('main article')).toHaveCount(3)
  for (const slug of slugs)
    await expect(page.locator(`main h2 a[href="/blog/${slug}"]`)).toBeVisible()
  await expect(page.locator('main article time')).toHaveCount(3)
  await expect(
    page.getByRole('link', { name: 'Subscribe via RSS' }),
  ).toHaveAttribute('href', '/blog/feed.xml')
  await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute(
    'content',
    /noindex/,
  )
})

for (const slug of slugs) {
  test(`${slug} serves a readable article, canonical metadata and Markdown alternate`, async ({
    page,
    request,
  }) => {
    const response = await page.goto(`/blog/${slug}`)
    expect(response?.status()).toBe(200)
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toHaveCount(1)
    await expect(heading).toBeVisible()
    await expect(page.locator('main article h2').first()).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://sandbee.in/blog/${slug}`,
    )
    await expect(
      page.locator('link[rel="alternate"][type="text/markdown"]'),
    ).toHaveAttribute('href', new RegExp(`/blog/${slug}/article\\.md$`))
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const article = scripts
      .map((raw) => JSON.parse(raw))
      .find((entry) => ['BlogPosting', 'TechArticle'].includes(entry['@type']))
    expect(article).toBeDefined()
    expect(article.headline).toBe(await heading.textContent())
    expect(article.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}/)
    const markdown = await request.get(`/blog/${slug}/article.md`)
    expect(markdown.status()).toBe(200)
    expect(markdown.headers()['content-type']).toContain('text/markdown')
    expect(await markdown.text()).toContain(await heading.textContent())
    const toc = page.getByRole('navigation', { name: 'In this post' })
    for (const link of await toc.getByRole('link').all())
      await expect(
        page.locator((await link.getAttribute('href'))!),
      ).toHaveCount(1)
  })
}

test('missing and draft blog entries return real 404 responses', async ({
  page,
  request,
}) => {
  for (const slug of ['unknown-guide', 'loader-fixture']) {
    const response = await page.goto(`/blog/${slug}`)
    expect(response?.status()).toBe(404)
    await expect(
      page.getByRole('heading', { name: 'Page not found' }),
    ).toBeVisible()
    expect((await request.get(`/blog/${slug}/article.md`)).status()).toBe(404)
  }
})
