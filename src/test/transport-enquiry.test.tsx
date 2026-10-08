import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TransportEnquiry } from '@/components/contact/transport-enquiry'

const navigation = vi.hoisted(() => ({ query: '' }))
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  useSearchParams: () => new URLSearchParams(navigation.query),
}))

describe('configured-transport enquiry selection', () => {
  it.each([
    ['gst', 'GSTIN'],
    ['ocr', 'Document OCR'],
    ['messaging', 'Sandbee Messaging'],
    ['pos', 'Sandbee POS'],
  ])(
    'preserves %s from the CTA as a submitted field and visible label',
    (product, name) => {
      navigation.query = `product=${product}`
      const { container } = render(<TransportEnquiry />)
      const input = container.querySelector<HTMLInputElement>(
        'input[name="product"]',
      )
      expect(input?.type).toBe('hidden')
      expect(input?.value).toBe(product)
      expect(screen.getByText(`Enquiry about ${name}`)).toBeDefined()
      expect(
        screen.getByRole('button', { name: 'Send the message' }),
      ).toBeDefined()
      expect(screen.queryByText('Received. We will reply by email.')).toBeNull()
    },
  )

  it.each(['', 'product=unknown', 'product=constructor'])(
    'uses a general form for query %j',
    (query) => {
      navigation.query = query
      const { container } = render(<TransportEnquiry />)
      expect(container.querySelector('input[name="product"]')).toBeNull()
      expect(screen.queryByText(/Enquiry about/)).toBeNull()
      expect(screen.getByLabelText('Name')).toBeDefined()
      expect(
        screen.getByRole('button', { name: 'Send the message' }),
      ).toBeDefined()
    },
  )
})
