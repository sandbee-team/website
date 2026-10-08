import { afterEach, describe, expect, it, vi } from 'vitest'
import { deliver } from './deliver'

const message = {
  name: 'Test',
  email: 'test@example.com',
  message: 'A test enquiry.',
  submittedAt: '2026-09-15T00:00:00Z',
}
afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('contact delivery configuration', () => {
  it('does not send or expose personal details when the API is absent', async () => {
    vi.stubEnv('CONTACT_TRANSPORT_URL', '')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    expect(await deliver(message)).toEqual({
      delivered: false,
      reason: 'transport-unconfigured',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('uses an HTTPS endpoint, optional bearer token, timeout and no redirects', async () => {
    vi.stubEnv('CONTACT_TRANSPORT_URL', 'https://contact.example.com/messages')
    vi.stubEnv('CONTACT_TRANSPORT_TOKEN', 'test-only-token')
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    expect(await deliver(message)).toEqual({ delivered: true })
    const [url, options] = fetchMock.mock.calls[0]
    expect(url.toString()).toBe('https://contact.example.com/messages')
    expect(options).toMatchObject({
      method: 'POST',
      headers: { authorization: 'Bearer test-only-token' },
      redirect: 'error',
      cache: 'no-store',
      body: JSON.stringify(message),
    })
    expect(options.signal).toBeDefined()
  })
  it('rejects insecure transport and reports rejected requests honestly', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('timeout'))
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('CONTACT_TRANSPORT_URL', 'http://contact.example.com/messages')
    expect(await deliver(message)).toEqual({
      delivered: false,
      reason: 'transport-error',
    })
    expect(fetchMock).not.toHaveBeenCalled()
    vi.stubEnv('CONTACT_TRANSPORT_URL', 'https://contact.example.com/messages')
    expect(await deliver(message)).toEqual({
      delivered: false,
      reason: 'transport-error',
    })
  })
})
