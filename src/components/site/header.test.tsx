import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteHeader } from './header'

describe('SiteHeader', () => {
  it('provides native desktop and mobile disclosures with all product destinations', () => {
    const { container } = render(<SiteHeader />)
    expect(screen.getByRole('banner')).toBeDefined()
    expect(container.querySelectorAll('details > summary')).toHaveLength(2)
    for (const label of ['Primary', 'Mobile navigation']) {
      const nav = screen.getByRole('navigation', { name: label, hidden: true })
      for (const href of [
        '/services/gst-api',
        '/technology/aadhaar-pan-ocr',
        '/services/whatsapp-sms-automation',
        '/products/pos',
      ]) {
        expect(nav.querySelector('a[href="' + href + '"]')).not.toBeNull()
      }
    }
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    expect(
      within(nav)
        .getByRole('link', { name: 'Developers' })
        .getAttribute('href'),
    ).toBe('/packages')
    expect(
      within(nav).getByRole('link', { name: 'Pricing' }).getAttribute('href'),
    ).toBe('/pricing')
    expect(
      screen.getByRole('link', { name: 'Open Store' }).getAttribute('href'),
    ).toBe('https://store.sandbee.in')
  })
  it('gives the wordmark an accessible home link', () => {
    render(<SiteHeader />)
    expect(
      screen.getByRole('link', { name: 'Sandbee' }).getAttribute('href'),
    ).toBe('/')
  })
  it('closes on Escape and returns focus to the summary', () => {
    const { container } = render(<SiteHeader />)
    const details = container.querySelector('details')!
    details.open = true
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(details.open).toBe(false)
    expect(document.activeElement).toBe(details.querySelector('summary'))
  })
  it('closes disclosures on outside and navigation clicks', () => {
    const { container } = render(<SiteHeader />)
    const details = container.querySelector('details')!
    details.open = true
    fireEvent.click(document.body)
    expect(details.open).toBe(false)
    details.open = true
    // JSDOM has no page navigation; keep the real click bubbling to the header.
    details
      .querySelector('a')!
      .addEventListener('click', (event) => event.preventDefault(), {
        once: true,
      })
    fireEvent.click(details.querySelector('a')!)
    expect(details.open).toBe(false)
  })
})
