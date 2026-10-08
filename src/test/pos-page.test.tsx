import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProductPage from '@/app/(marketing)/products/[product]/page'
const renderPos = async () =>
  render(
    await ProductPage({
      params: Promise.resolve({ product: 'pos' }),
      searchParams: Promise.resolve({}),
    }),
  )

describe('Sandbee POS customer-account deployment', () => {
  it('identifies the product and one-time setup in the customer Vercel account', async () => {
    const { container } = await renderPos()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Your counter. Your workflow. Your setup.',
    )
    expect(container.textContent).toContain('your own Vercel account')
    expect(container.textContent).toContain('one-time implementation charge')
    expect(container.querySelector('[data-product="pos"]')).not.toBeNull()
  })
  it('provides working section anchors and ordered delivery steps', async () => {
    const { container } = await renderPos()
    for (const a of screen
      .getByRole('navigation', { name: 'On this page' })
      .querySelectorAll('a')) {
      expect(container.querySelector(a.getAttribute('href')!)).not.toBeNull()
    }
    const steps = container.querySelectorAll('#how-it-works ol > li')
    expect(steps).toHaveLength(3)
    expect(steps[0].textContent).toContain('Show us your operation')
    expect(steps[1].textContent).toContain('Set up in your account')
    expect(steps[2].textContent).toContain('Review and hand over')
  })
  it('separates provider costs, support and optional work from the setup payment', async () => {
    const { container } = await renderPos()
    expect(
      screen.getByText(
        /Provider subscriptions, support arrangements and later custom work are separate/,
      ),
    ).toBeDefined()
    expect(
      screen.getByText(
        /Choose a provider plan that permits your commercial use/,
      ),
    ).toBeDefined()
    expect(container.textContent).not.toMatch(
      /lifetime free|\u20b9\s?\d|\$\s?\d/,
    )
  })
  it('keeps commercial actions as setup enquiries with the product preselected', async () => {
    await renderPos()
    const links = screen.getAllByRole('link', {
      name: /Discuss your POS setup/,
    })
    expect(links).toHaveLength(2)
    for (const a of links)
      expect(a.getAttribute('href')).toBe('/contact?product=pos')
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeDefined()
    expect(
      screen.getByText('Workflow illustration \u00b7 Sandbee POS'),
    ).toBeDefined()
  })
  it('exposes readable FAQs and links the other three real products', async () => {
    const { container } = await renderPos()
    expect(container.querySelectorAll('#questions details')).toHaveLength(4)
    for (const href of [
      '/services/gst-api',
      '/technology/aadhaar-pan-ocr',
      '/services/whatsapp-sms-automation',
    ])
      expect(container.querySelector('a[href="' + href + '"]')).not.toBeNull()
  })
  it('emits matching breadcrumb and software schema without invented offers', async () => {
    const { container } = await renderPos()
    const raw = [
      ...container.querySelectorAll('script[type="application/ld+json"]'),
    ].map((s) => s.innerHTML)
    const schemas = raw.map((s) => JSON.parse(s))
    expect(schemas.map((s) => s['@type'])).toEqual([
      'BreadcrumbList',
      'SoftwareApplication',
    ])
    const app = schemas[1]
    expect(app.name).toBe('Sandbee POS')
    expect(container.textContent).toContain(app.description)
    for (const s of raw) {
      expect(s).not.toContain('offers')
      expect(s).not.toContain('aggregateRating')
    }
  })
})
