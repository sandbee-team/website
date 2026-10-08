import { describe, expect, it, vi } from 'vitest'

import { createRateLimiter } from '@/lib/forms/rate-limit'
import { contactSchema } from '@/lib/forms/schema'

/*
 * Forms-lib contract tests (ADR-0007 §8 + ADR-0014 Q14). The Server Action itself is
 * exercised end-to-end by tests/e2e/contact-form.spec.ts (real POST through the built
 * app, JS on and off); these pin the pure pieces.
 */
describe('contact schema (deck error copy)', () => {
  it('accepts a valid message', () => {
    const parsed = contactSchema.safeParse({
      name: 'A',
      email: 'a@b.co',
      message: 'Build this.',
    })
    expect(parsed.success).toBe(true)
  })

  it('rejects a bad email with the deck error line', () => {
    const parsed = contactSchema.safeParse({
      name: 'A',
      email: 'not-an-email',
      message: 'x',
    })
    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(
        parsed.error.issues.some(
          (issue) => issue.message === 'Enter an email address.',
        ),
      ).toBe(true)
    }
  })

  it('rejects empty name/message', () => {
    const parsed = contactSchema.safeParse({
      name: '',
      email: 'a@b.co',
      message: '',
    })
    expect(parsed.success).toBe(false)
  })
})

describe('rate limiter', () => {
  it('allows up to the limit inside the window, then blocks, then recovers', () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 })
    expect(limiter.allow('ip', 0)).toBe(true)
    expect(limiter.allow('ip', 100)).toBe(true)
    expect(limiter.allow('ip', 200)).toBe(false)
    // Other keys are independent.
    expect(limiter.allow('other', 200)).toBe(true)
    // After the window slides, the key recovers.
    expect(limiter.allow('ip', 1201)).toBe(true)
  })
})

describe('deliver adapter (ADR-0014 Q14: never fake success)', () => {
  it('reports transport-unconfigured when no transport URL is set', async () => {
    vi.stubEnv('CONTACT_TRANSPORT_URL', '')
    vi.resetModules()
    const { deliver } = await import('@/lib/forms/deliver')
    const result = await deliver({
      name: 'A',
      email: 'a@b.co',
      message: 'x',
      submittedAt: '2026-09-01T00:00:00.000Z',
    })
    expect(result).toEqual({
      delivered: false,
      reason: 'transport-unconfigured',
    })
    vi.unstubAllEnvs()
  })
})
