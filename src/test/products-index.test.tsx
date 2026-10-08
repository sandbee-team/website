import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProductsPage from '@/app/(marketing)/products/page'

describe('product directory', () => {
  it('renders one headline and four offerings before interaction', () => {
    const { container } = render(<ProductsPage />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(container.querySelectorAll('article')).toHaveLength(4)
    expect(screen.getByRole('status').textContent).toContain('4 products')
    for (const [name, href] of [
      ['GSTIN', '/services/gst-api'],
      ['Document OCR', '/technology/aadhaar-pan-ocr'],
      ['Sandbee Messaging', '/services/whatsapp-sms-automation'],
      ['Sandbee POS', '/products/pos'],
    ]) {
      expect(screen.getByRole('link', { name }).getAttribute('href')).toBe(href)
    }
  })
  it('filters entries and announces count with a single pressed button', () => {
    const { container } = render(<ProductsPage />)
    for (const [category, names] of [
      ['API service', ['GSTIN', 'Sandbee Messaging']],
      ['Developer package', ['Document OCR']],
      ['Business software', ['Sandbee POS']],
      [
        'All products',
        ['GSTIN', 'Document OCR', 'Sandbee Messaging', 'Sandbee POS'],
      ],
    ] as const) {
      const button = screen.getByRole('button', { name: category })
      fireEvent.click(button)
      expect(button.getAttribute('aria-pressed')).toBe('true')
      expect(
        container.querySelectorAll('button[aria-pressed="true"]'),
      ).toHaveLength(1)
      expect(container.querySelectorAll('article')).toHaveLength(names.length)
      for (const name of names)
        expect(screen.getByRole('link', { name })).toBeDefined()
      expect(screen.getByRole('status').textContent).toContain(
        names.length + ' product',
      )
    }
  })
  it('states commercial models without inventing paid amounts', () => {
    const { container } = render(<ProductsPage />)
    expect(screen.getAllByText('Free')).toHaveLength(2)
    expect(screen.getAllByText('Prepaid balance')).toHaveLength(2)
    expect(screen.getByText('One-time setup')).toBeDefined()
    expect(container.textContent).not.toMatch(
      /\u20b9\s?\d|\$\s?\d|INR\s?\d|USD\s?\d/,
    )
  })
  it('emits visible breadcrumbs and BreadcrumbList without invented offers', () => {
    const { container } = render(<ProductsPage />)
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeDefined()
    const scripts = [
      ...container.querySelectorAll('script[type="application/ld+json"]'),
    ].map((node) => node.innerHTML)
    expect(scripts.map((raw) => JSON.parse(raw)['@type'])).toContain(
      'BreadcrumbList',
    )
    for (const raw of scripts) {
      expect(raw).not.toContain('offers')
      expect(raw).not.toContain('aggregateRating')
    }
  })
})
