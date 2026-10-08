import { expect, test } from '@playwright/test'

// Independent expectations pin the approved commercial facts rather than importing the implementation.
const products = [
  {
    route: '/services/gst-api',
    name: 'GSTIN',
    price: 'Free',
    action: 'Open in Store',
    href: 'https://store.sandbee.in',
  },
  {
    route: '/technology/aadhaar-pan-ocr',
    name: 'Document OCR',
    price: 'Free',
    action: 'Get the package',
    href: 'https://store.sandbee.in/developers',
  },
  {
    route: '/services/whatsapp-sms-automation',
    name: 'Sandbee Messaging',
    price: 'Prepaid balance',
    action: 'Request messaging access',
    href: '/contact?product=messaging',
  },
  {
    route: '/products/pos',
    name: 'Sandbee POS',
    price: 'One-time setup',
    action: 'Discuss your POS setup',
    href: '/contact?product=pos',
  },
] as const

for (const product of products) {
  test(`${product.name} explains access and provides working FAQ and section navigation`, async ({
    page,
  }) => {
    await page.goto(product.route)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.locator('main #pricing h2')).toHaveText(product.price)
    const actions = page
      .locator('main')
      .getByRole('link', { name: product.action })
    await expect(actions).toHaveCount(2)
    for (const action of await actions.all())
      await expect(action).toHaveAttribute('href', product.href)
    for (const link of await page
      .getByRole('navigation', { name: 'On this page' })
      .getByRole('link')
      .all()) {
      const href = await link.getAttribute('href')
      await expect(page.locator(href!)).toHaveCount(1)
    }
    await page
      .getByRole('navigation', { name: 'On this page' })
      .getByRole('link', { name: 'Questions' })
      .click()
    await expect(page).toHaveURL(/#questions$/)
    const first = page.locator('main #questions details').first()
    await expect(first.locator('p')).toBeHidden()
    await first.locator('summary').focus()
    await page.keyboard.press('Enter')
    await expect(first.locator('p')).toBeVisible()
    await page.keyboard.press('Enter')
    await expect(first.locator('p')).toBeHidden()
    await expect(
      page
        .locator('main')
        .getByRole('region', { name: 'Different tools. One company.' })
        .getByRole('link'),
    ).toHaveCount(3)
  })
}

test('pricing comparison distinguishes free access, prepaid usage and customer-owned setup', async ({
  page,
}) => {
  await page.goto('/pricing')
  const rows = page
    .getByRole('region', { name: 'Product pricing comparison' })
    .locator('tbody tr')
  await expect(rows).toHaveCount(4)
  for (const product of products) {
    const row = rows.filter({
      has: page.getByRole('link', { name: product.name, exact: true }),
    })
    await expect(row).toContainText(product.price)
    await expect(row.getByRole('link')).toHaveAttribute('href', product.route)
  }
  await expect(rows.filter({ hasText: 'Document OCR' })).toContainText(
    'Your Node.js server',
  )
  await expect(rows.filter({ hasText: 'Sandbee POS' })).toContainText(
    'Your Vercel account',
  )
  await expect(
    page.getByRole('link', { name: 'Start in Sandbee Store' }),
  ).toHaveAttribute('href', 'https://store.sandbee.in')
  await expect(
    page.getByText(
      /Free access does not include your own infrastructure costs/,
    ),
  ).toBeVisible()
})

test.describe('native product FAQ without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('OCR requirements and local-processing distinction are available', async ({
    page,
  }) => {
    await page.goto('/technology/aadhaar-pan-ocr')
    const faq = page.locator('#questions')
    await faq
      .locator('summary')
      .filter({ hasText: 'Where does OCR run?' })
      .click()
    await expect(
      faq.getByText(/The hosted Store demo is separate/),
    ).toBeVisible()
    await faq
      .locator('summary')
      .filter({ hasText: 'Which environments are supported?' })
      .click()
    await expect(
      faq.getByText(
        /Node.js 22 or newer on Windows x64 or Linux x64 with glibc/,
      ),
    ).toBeVisible()
  })
})
