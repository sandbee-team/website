import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ServicesPage from '@/app/(marketing)/services/page'

describe('services index', () => {
  it('presents the two current hosted services as linked cards', () => {
    const { container } = render(<ServicesPage />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(container.querySelectorAll('article')).toHaveLength(2)
    expect(
      screen.getByRole('link', { name: 'GSTIN' }).getAttribute('href'),
    ).toBe('/services/gst-api')
    expect(
      screen
        .getByRole('link', { name: 'Sandbee Messaging' })
        .getAttribute('href'),
    ).toBe('/services/whatsapp-sms-automation')
    expect(screen.queryByRole('link', { name: 'Document OCR' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Sandbee POS' })).toBeNull()
    expect(screen.getByRole('status').textContent).toContain('2 products')
  })
  it('keeps free GST and prepaid messaging distinct without numeric paid prices', () => {
    const { container } = render(<ServicesPage />)
    expect(screen.getByText('Free')).toBeDefined()
    expect(screen.getAllByText('Prepaid balance')).toHaveLength(2)
    expect(screen.getByText(/QR scan/)).toBeDefined()
    expect(container.textContent).not.toMatch(
      /\u20b9\s?\d|\$\s?\d|INR\s?\d|USD\s?\d/,
    )
  })
  it('retains legacy service directions and a custom-integration path', () => {
    render(<ServicesPage />)
    expect(
      screen
        .getByRole('link', { name: 'Instagram automation' })
        .getAttribute('href'),
    ).toBe('/services/instagram-automation')
    expect(
      screen
        .getByRole('link', { name: 'Desktop notifications' })
        .getAttribute('href'),
    ).toBe('/services/desktop-notification')
    expect(
      screen
        .getByRole('link', { name: /Discuss a custom integration/ })
        .getAttribute('href'),
    ).toBe('/custom-technology')
    expect(screen.getByText('Explore other service directions')).toBeDefined()
  })
})
