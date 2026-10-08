import { expect, test } from '@playwright/test'

/*
 * Public-voice + share-card gates (06f F8/F16 preventions):
 * 1. No internal-document apparatus in rendered copy — a visitor has no idea what
 *    "the reference", "the deck" or "§3.1" is. Five instances shipped (one
 *    test-pinned) because verbatim-fidelity checks validate render-vs-deck and the
 *    decks carried the defect. This gate reads the page as a stranger would.
 * 2. Every indexable route carries og:image + twitter:image — the root card served
 *    200 for weeks while nothing referenced it (blank large share cards).
 */
const INDEXABLE = [
  '/packages',
  '/pricing',
  '/services/gst-api',
  '/blog',
  '/blog/hosted-api-or-installed-sdk',
  '/blog/customer-hosted-ocr-integration',
  '/blog/pos-deployment-handover-checklist',
  '/',
  '/products',
  '/products/pos',
  '/services',
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
  '/contact',
]

test('no rendered route leaks internal-document language', async ({ page }) => {
  for (const path of [...INDEXABLE, '/blog', '/privacy', '/terms']) {
    await page.goto(path)
    const text = await page.evaluate(() =>
      document.body.innerText.replace(/\s+/g, ' '),
    )
    expect(text, `${path} leaks a §-citation`).not.toMatch(/§\s?\d/)
    expect(text, `${path} says "the reference"`).not.toMatch(/the reference/i)
    expect(text, `${path} says "the deck"`).not.toMatch(/the deck\b/i)
  }
})

test('every indexable route wires og:image and twitter:image', async ({
  page,
}) => {
  for (const path of INDEXABLE) {
    await page.goto(path)
    const og = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute('content')
    expect(og, `${path} og:image`).toContain('/opengraph-image')
    const tw = await page
      .locator('meta[name="twitter:image"]')
      .first()
      .getAttribute('content')
    expect(tw, `${path} twitter:image`).toContain('/opengraph-image')
  }
})
