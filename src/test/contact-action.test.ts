import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/*
 * Server-action contract tests (06d perf-a11y finding 5 follow-up): honeypot, per-IP
 * rate limit (with its honest amended copy), validation mapping, and the
 * transport-pending line — with next/headers mocked (no request context in vitest).
 * The rate limiter is module-shared, so each test uses a distinct mocked IP.
 */
let mockIp = 'test-ip'
vi.mock('next/headers', () => ({
  headers: async () => new Map([['x-forwarded-for', mockIp]]),
}))

import { submitContactMessage } from '@/lib/forms/action'
import { CONTACT_FORM_INITIAL } from '@/lib/forms/state'

const form = (entries: Record<string, string>) => {
  const data = new FormData()
  for (const [key, value] of Object.entries(entries)) data.set(key, value)
  return data
}

const fetchTransport = vi.fn<typeof fetch>()

beforeEach(() => {
  mockIp = `ip-${Math.random().toString(36).slice(2)}`
  vi.stubEnv('CONTACT_TRANSPORT_URL', '')
  vi.stubEnv('CONTACT_TRANSPORT_TOKEN', '')
  fetchTransport.mockReset()
  vi.stubGlobal('fetch', fetchTransport)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('submitContactMessage', () => {
  it('rejects a honeypot hit with the generic failure (never success)', async () => {
    const state = await submitContactMessage(
      CONTACT_FORM_INITIAL,
      form({ name: 'B', email: 'b@x.co', message: 'x', hp_field: 'spam' }),
    )
    expect(state.status).toBe('error')
    expect(state.formError).toBe('the message did not send. Try again.')
  })

  it('maps validation issues to per-field deck errors with sticky values', async () => {
    const state = await submitContactMessage(
      CONTACT_FORM_INITIAL,
      form({ name: '', email: 'nope', message: '' }),
    )
    expect(state.status).toBe('error')
    expect(state.fieldErrors).toEqual({
      name: 'Enter your name.',
      email: 'Enter an email address.',
      message: 'Tell us what you are building.',
    })
    expect(state.values?.email).toBe('nope')
  })

  it('returns the honest transport-pending line for a valid message (no transport configured)', async () => {
    const state = await submitContactMessage(
      CONTACT_FORM_INITIAL,
      form({ name: 'A', email: 'a@x.co', message: 'Build this.' }),
    )
    expect(state.status).toBe('error')
    expect(state.formError).toBe(
      'The message did not send — the form is not connected yet. Please email sandbee.team@gmail.com.',
    )
  })

  it('rate-limits the 6th submission from one IP with the amended honest copy', async () => {
    const submit = () =>
      submitContactMessage(
        CONTACT_FORM_INITIAL,
        form({ name: 'A', email: 'a@x.co', message: 'x' }),
      )
    for (let i = 0; i < 5; i++) await submit()
    const state = await submit()
    expect(state.status).toBe('error')
    expect(state.formError).toBe(
      'the message did not send. Try again in a few minutes.',
    )
  })

  it.each([
    ['gst', 'GSTIN'],
    ['ocr', 'Document OCR'],
    ['messaging', 'Sandbee Messaging'],
    ['pos', 'Sandbee POS'],
  ])(
    'delivers the canonical %s product name with the validated enquiry',
    async (product, name) => {
      vi.stubEnv(
        'CONTACT_TRANSPORT_URL',
        'https://contact.example.test/enquiries',
      )
      fetchTransport.mockResolvedValue(new Response(null, { status: 204 }))
      const state = await submitContactMessage(
        CONTACT_FORM_INITIAL,
        form({
          name: '  Example User  ',
          email: 'example@example.test',
          message: '  Please discuss my workflow.  ',
          product,
        }),
      )
      expect(state).toEqual({ status: 'success' })
      expect(fetchTransport).toHaveBeenCalledTimes(1)
      const [endpoint, request] = fetchTransport.mock.calls[0]
      expect(String(endpoint)).toBe('https://contact.example.test/enquiries')
      expect(request?.method).toBe('POST')
      expect(request?.redirect).toBe('error')
      expect(request?.cache).toBe('no-store')
      const payload = JSON.parse(String(request?.body))
      expect(payload).toEqual({
        name: 'Example User',
        email: 'example@example.test',
        message: `Product: ${name}\n\nPlease discuss my workflow.`,
        submittedAt: expect.any(String),
      })
      expect(new Date(payload.submittedAt).toISOString()).toBe(
        payload.submittedAt,
      )
    },
  )

  it('keeps a general enquiry unchanged when no product was selected', async () => {
    vi.stubEnv(
      'CONTACT_TRANSPORT_URL',
      'https://contact.example.test/enquiries',
    )
    fetchTransport.mockResolvedValue(new Response(null, { status: 204 }))
    const state = await submitContactMessage(
      CONTACT_FORM_INITIAL,
      form({
        name: 'Example User',
        email: 'example@example.test',
        message: 'A custom workflow.',
      }),
    )
    expect(state.status).toBe('success')
    expect(fetchTransport).toHaveBeenCalledTimes(1)
    expect(
      JSON.parse(String(fetchTransport.mock.calls[0][1]?.body)).message,
    ).toBe('A custom workflow.')
  })

  it.each(['not-a-product', 'pos\nProduct: forged', 'constructor'])(
    'rejects unknown product %j without contacting the transport',
    async (product) => {
      vi.stubEnv(
        'CONTACT_TRANSPORT_URL',
        'https://contact.example.test/enquiries',
      )
      const values = {
        name: 'Example User',
        email: 'example@example.test',
        message: 'Keep my entered message.',
      }
      const state = await submitContactMessage(
        CONTACT_FORM_INITIAL,
        form({ ...values, product }),
      )
      expect(state).toEqual({
        status: 'error',
        formError: 'Choose a supported product or submit a general enquiry.',
        values,
      })
      expect(fetchTransport).not.toHaveBeenCalled()
    },
  )

  it('does not claim success when delivery of a selected-product enquiry fails', async () => {
    vi.stubEnv(
      'CONTACT_TRANSPORT_URL',
      'https://contact.example.test/enquiries',
    )
    fetchTransport.mockResolvedValue(new Response(null, { status: 503 }))
    const values = {
      name: 'Example User',
      email: 'example@example.test',
      message: 'Please discuss POS setup.',
    }
    const state = await submitContactMessage(
      CONTACT_FORM_INITIAL,
      form({ ...values, product: 'pos' }),
    )
    expect(state).toEqual({
      status: 'error',
      formError: 'the message did not send. Try again.',
      values,
    })
    expect(fetchTransport).toHaveBeenCalledTimes(1)
  })
})
