import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteFooter } from './footer'

describe('SiteFooter', () => {
  it('provides product, company, developer and legal links in the footer landmark', () => {
    render(<SiteFooter />)
    const footer = screen.getByRole('contentinfo')
    expect(footer.dataset.surface).toBe('daylight')
    const nav = screen.getByRole('navigation', { name: 'Footer' })
    expect(
      [...nav.querySelectorAll('a')].map((a) => a.getAttribute('href')),
    ).toEqual([
      '/services/gst-api',
      '/technology/aadhaar-pan-ocr',
      '/services/whatsapp-sms-automation',
      '/products/pos',
      '/services',
      '/packages',
      '/pricing',
      '/custom-technology',
      '/blog',
      '/stories',
      '/company',
      'https://store.sandbee.in/developers',
      '/contact',
      'mailto:sandbee.team@gmail.com',
    ])
    expect(footer.querySelector('a[href="/privacy"]')).not.toBeNull()
    expect(footer.querySelector('a[href="/terms"]')).not.toBeNull()
  })
  it('uses confirmed identity and only known external destinations', () => {
    const { container } = render(<SiteFooter />)
    expect(
      screen
        .getByRole('link', { name: 'sandbee.team@gmail.com' })
        .getAttribute('href'),
    ).toBe('mailto:sandbee.team@gmail.com')
    expect(screen.queryByText(/pending/i)).toBeNull()
    expect(container.textContent).toContain('\u00a9 Sandbee')
    expect(container.querySelector('a[href^="tel:"]')).toBeNull()
    for (const a of container.querySelectorAll('a')) {
      const href = a.getAttribute('href')!
      if (!href.startsWith('/'))
        expect([
          'https://store.sandbee.in',
          'https://store.sandbee.in/developers',
          'mailto:sandbee.team@gmail.com',
        ]).toContain(href)
    }
  })
})
