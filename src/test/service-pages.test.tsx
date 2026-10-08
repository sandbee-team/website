import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import ServiceOfferingPage from '@/app/(marketing)/services/[service]/page'

const renderService = async (service: string) =>
  render(
    await ServiceOfferingPage({
      params: Promise.resolve({ service }),
      searchParams: Promise.resolve({}),
    }),
  )

/*
 * Contract-fidelity checks against the 05b decks (.memory/content/services-*.md).
 * Expected strings copy-pasted from the decks + grep-verified (06b validation).
 */
describe('service pages (RTL, contract fidelity)', () => {
  it('messaging describes QR-connected prepaid delivery with explicit access terms', async () => {
    await renderService('whatsapp-sms-automation')
    expect(screen.getAllByRole('heading', { level: 1 })[0].textContent).toBe(
      'From your application to their WhatsApp.',
    )
    expect(
      screen.getByText(
        'Connect a WhatsApp session with a QR scan. Send messages through the panel or your own application, using a prepaid account balance.',
      ),
    ).toBeDefined()
    expect(
      screen.getByText(
        /not presented as the official WhatsApp Business Platform/,
      ),
    ).toBeDefined()
    expect(
      screen.getByText(/Rates and applicable charges are confirmed/),
    ).toBeDefined()
    for (const link of screen.getAllByRole('link', {
      name: /Request messaging access/,
    }))
      expect(link.getAttribute('href')).toBe('/contact?product=messaging')
  })

  it('instagram-automation renders deck copy incl. the honest-unknown FAQ answer', async () => {
    await renderService('instagram-automation')
    expect(screen.getAllByRole('heading', { level: 1 })[0].textContent).toBe(
      'Instagram automation',
    )
    expect(
      screen.getByText(
        'A direction for Instagram automation through hosted services and integrations. Current scope and availability are discussed per engagement.',
      ),
    ).toBeDefined()
    expect(
      screen.getByText(
        'Scope is agreed per engagement — describe what you need and we will tell you honestly whether this service covers it.',
      ),
    ).toBeDefined()
    expect(
      screen.getByText(
        'There is no requirement that every Sandbee service use the same pricing structure.',
        { exact: false },
      ),
    ).toBeDefined()
  })

  it('desktop-notification keeps the "similar in concept to Pushy" hedge everywhere', async () => {
    await renderService('desktop-notification')
    expect(screen.getAllByRole('heading', { level: 1 })[0].textContent).toBe(
      'Desktop notification',
    )
    const pushyMentions = screen.getAllByText(/similar in concept to Pushy/)
    expect(pushyMentions.length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText(/determined independently/)).toBeDefined()
  })

  it('every service page: §10 outline, dashed hosted edge, one honey group, JSON-LD clean', async () => {
    for (const service of [
      'gst-api',
      'whatsapp-sms-automation',
      'instagram-automation',
      'desktop-notification',
    ]) {
      const { container, unmount } = await renderService(service)
      const h2s = Array.from(container.querySelectorAll('h2')).map(
        (h) => h.textContent,
      )
      if (
        service === 'instagram-automation' ||
        service === 'desktop-notification'
      ) {
        expect(h2s[0]).toBe('What this service is')
        expect(h2s[1]).toBe('How you consume it')
        expect(h2s[2]).toBe('How billing is shaped')
        expect(h2s[h2s.length - 1]).toBe('Common questions')
        // Typed service edge: dashed (grammar v1 §4 semantics) + mono label.
        const svg = container.querySelector('svg')
        expect(svg?.innerHTML).toContain('stroke-dasharray="6 5"')
        expect(svg?.textContent).toContain('hosted · api')
        // One honey group: the hosted-capability chevron.
        expect(svg?.querySelectorAll('.stroke-honey-ink').length).toBe(1)
      } else {
        expect(
          container.querySelectorAll('#how-it-works ol > li'),
        ).toHaveLength(3)
        expect(container.querySelector('#pricing')).not.toBeNull()
        expect(
          container.querySelectorAll('#questions details').length,
        ).toBeGreaterThanOrEqual(3)
      }
      // JSON-LD: BreadcrumbList + Service, never offers/aggregateRating.
      const scripts = Array.from(
        container.querySelectorAll('script[type="application/ld+json"]'),
      ).map((node) => node.innerHTML)
      expect(scripts.length).toBe(2)
      const types = scripts.map((raw) => JSON.parse(raw)['@type'])
      expect(types).toContain('BreadcrumbList')
      expect(types).toContain('Service')
      for (const raw of scripts) {
        expect(raw).not.toContain('offers')
        expect(raw).not.toContain('aggregateRating')
      }
      unmount()
    }
  })

  it('never renders a status badge or price digits (Q6/Q7)', async () => {
    for (const service of [
      'whatsapp-sms-automation',
      'instagram-automation',
      'desktop-notification',
    ]) {
      const { container, unmount } = await renderService(service)
      expect(container.querySelector('.status-badge')).toBeNull()
      expect(container.textContent).not.toMatch(/₹|\$\s?\d|INR|USD/)
      unmount()
    }
  })
})
