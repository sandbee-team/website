import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HomePage from '@/app/(marketing)/page'
import { getPosts } from '@/lib/content'

describe('homepage product discovery', () => {
  it('has one meaningful headline and leaves the main landmark to the layout', async () => {
    const { container } = render(await HomePage())
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Ideas, madebeautifullyuseful.',
    )
    expect(container.querySelector('main')).toBeNull()
    expect(
      screen
        .getByRole('link', { name: /View all products/ })
        .getAttribute('href'),
    ).toBe('/products')
    expect(
      screen
        .getByRole('link', { name: /Let’s build something/ })
        .getAttribute('href'),
    ).toBe('/contact')
    const hero = container.querySelector('[data-landing-hero]')!
    expect(hero.querySelector('[role="tablist"]')).toBeNull()
    expect(hero.querySelector('[data-product-preview]')).toBeNull()
  })
  it('renders four linked products with their distinct commercial models', async () => {
    const { container } = render(await HomePage())
    const catalog = container.querySelector<HTMLElement>('#products')!
    expect(catalog.querySelectorAll('article')).toHaveLength(4)
    for (const [name, href] of [
      ['GSTIN', '/services/gst-api'],
      ['Document OCR', '/technology/aadhaar-pan-ocr'],
      ['Sandbee Messaging', '/services/whatsapp-sms-automation'],
      ['Sandbee POS', '/products/pos'],
    ])
      expect(
        within(catalog).getByRole('link', { name }).getAttribute('href'),
      ).toBe(href)
    expect(catalog.textContent).toContain('Prepaid balance')
    expect(catalog.textContent).toContain('One-time setup')
    expect(within(catalog).getAllByText('Free')).toHaveLength(2)
  })
  it('supports keyboard selection in the illustrative product preview', async () => {
    render(await HomePage())
    const tabs = within(screen.getByRole('tablist')).getAllByRole('tab')
    expect(tabs).toHaveLength(4)
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' })
    expect(tabs[1].getAttribute('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(tabs[1])
    expect(screen.getByRole('tabpanel').getAttribute('aria-labelledby')).toBe(
      tabs[1].id,
    )
    fireEvent.keyDown(tabs[1], { key: 'End' })
    expect(tabs[3].tabIndex).toBe(0)
    fireEvent.keyDown(tabs[3], { key: 'ArrowRight' })
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    fireEvent.click(tabs[2])
    expect(tabs[2].getAttribute('aria-selected')).toBe('true')
    expect(tabs.filter((tab) => tab.tabIndex === 0)).toHaveLength(1)
  })
  it('links Store and explains guided setup and credential handling', async () => {
    render(await HomePage())
    expect(
      screen
        .getByRole('link', { name: /Step inside the Store/ })
        .getAttribute('href'),
    ).toBe('https://store.sandbee.in')
    expect(
      screen.getByText(/Messaging and POS start with a guided setup request/),
    ).toBeDefined()
    expect(
      screen.getByText(/Keep your credentials on your server/),
    ).toBeDefined()
  })
  it('links real published guides without exposing drafts', async () => {
    const { container } = render(await HomePage())
    for (const post of await getPosts())
      expect(
        screen.getByRole('link', { name: post.title }).getAttribute('href'),
      ).toBe('/blog/' + post.slug)
    expect(container.textContent).not.toContain('loader-fixture')
  })
  it('avoids invented commercial amounts and social-proof metrics', async () => {
    const { container } = render(await HomePage())
    expect(container.textContent).not.toMatch(
      /\u20b9\s?\d|\$\s?\d|INR\s?\d|USD\s?\d|\d+%|\d+\+ customers/,
    )
  })
})
