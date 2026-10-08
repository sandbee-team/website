import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TechnologyPage from '@/app/(marketing)/technology/page'

describe('developer technology index', () => {
  it('gives GSTIN and OCR distinct linked entry points', async () => {
    render(await TechnologyPage())
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(
      screen.getByRole('link', { name: 'GSTIN' }).getAttribute('href'),
    ).toBe('/services/gst-api')
    expect(
      screen.getByRole('link', { name: 'Document OCR' }).getAttribute('href'),
    ).toBe('/technology/aadhaar-pan-ocr')
    expect(
      screen
        .getByRole('link', { name: 'Open developer resources' })
        .getAttribute('href'),
    ).toBe('https://store.sandbee.in/developers')
  })
  it('distinguishes local document processing, hosted demos, access renewal and costs', async () => {
    render(await TechnologyPage())
    expect(
      screen.getByText(/your backend makes requests to the hosted service/),
    ).toBeDefined()
    expect(
      screen.getByText(/process documents on your own Node.js server/),
    ).toBeDefined()
    expect(
      screen.getByText(/startup verification and periodic license renewal/),
    ).toBeDefined()
    expect(screen.getByText(/hosted Store demo is separate/)).toBeDefined()
    expect(
      screen.getByText(
        /Free access does not remove service limits or your own infrastructure costs/,
      ),
    ).toBeDefined()
  })
  it('keeps legacy technology explicitly framed as directions', async () => {
    render(await TechnologyPage())
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Other technology directions',
      }),
    ).toBeDefined()
    expect(
      screen.getByText(/contact us to discuss current scope and availability/),
    ).toBeDefined()
    expect(
      screen.getByText(
        /covering areas such as keyboard, mouse, application and web tracking/,
      ),
    ).toBeDefined()
    expect(
      screen.getByText(/intended to provide the required technology stack/),
    ).toBeDefined()
    expect(
      screen
        .getByRole('link', { name: 'Electron tracking' })
        .getAttribute('href'),
    ).toBe('/technology/electron-tracking')
    expect(
      screen
        .getByRole('link', { name: 'Face scan/mobile setup' })
        .getAttribute('href'),
    ).toBe('/technology/face-scan-mobile')
  })
  it('links messaging and custom work while retaining the prepaid model', async () => {
    render(await TechnologyPage())
    expect(
      screen.getByText(
        /QR-connected WhatsApp session with a panel and API, using prepaid balance/,
      ),
    ).toBeDefined()
    expect(
      screen
        .getByRole('link', { name: 'Explore Sandbee Messaging' })
        .getAttribute('href'),
    ).toBe('/services/whatsapp-sms-automation')
    expect(
      screen
        .getByRole('link', { name: 'Custom technology work' })
        .getAttribute('href'),
    ).toBe('/custom-technology')
  })
  it('has visible breadcrumbs and corresponding schema without invented prices or reviews', async () => {
    const { container } = render(await TechnologyPage())
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeDefined()
    const raw = container.querySelector(
      'script[type="application/ld+json"]',
    )!.innerHTML
    expect(JSON.parse(raw)['@type']).toBe('BreadcrumbList')
    expect(raw).not.toContain('offers')
    expect(raw).not.toContain('aggregateRating')
    expect(container.textContent).not.toMatch(
      /\u20b9\s?\d|\$\s?\d|INR\s?\d|USD\s?\d/,
    )
  })
})
