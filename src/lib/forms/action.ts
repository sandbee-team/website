'use server'

import { headers } from 'next/headers'
import { SITE_IDENTITY } from '@/config/site-identity'
import { CATALOG } from '@/content/catalog'

import { deliver } from './deliver'
import { contactRateLimiter } from './rate-limit'
import { contactSchema, type ContactFormState } from './schema'

/*
 * Contact Server Action (ADR-0007 §8): honeypot → rate limit → Zod validation →
 * deliver(). All copy is the 05a deck's microcopy (.memory/content/contact.md, amended
 * 2026-09-01). Honesty rules: a honeypot hit returns the generic failure (never a fake
 * success — named decision, 06d 05-review); an unconfigured transport returns the
 * deck's transport-pending line (ADR-0014 Q14). Sticky values keep no-JS full-page
 * submits from losing input.
 */

// Deck-exact casing: the field/alert markup prefixes "Error — ", so the deck line
// starts lowercase (.memory/content/contact.md — 06d qa finding 2).
const FAILURE_LINE = 'the message did not send. Try again.'
// Rate-limited retry-now would fail again for up to the window — say so honestly
// (06d perf-a11y finding 5; deck amended 2026-09-01).
const RATE_LIMIT_LINE = 'the message did not send. Try again in a few minutes.'
const TRANSPORT_PENDING_LINE = `The message did not send — the form is not connected yet. Please email ${SITE_IDENTITY.email}.`

export async function submitContactMessage(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
  }

  // Honeypot: the visually hidden field must stay empty (generic failure — honest,
  // never a fake success; named decision, 06d 05-review).
  if (String(formData.get('hp_field') ?? '') !== '') {
    return { status: 'error', formError: FAILURE_LINE, values }
  }

  // Per-instance IP guard. The receiving API owns the shared serverless rate limit.
  const headerList = await headers()
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!contactRateLimiter.allow(`contact:${ip}`)) {
    return { status: 'error', formError: RATE_LIMIT_LINE, values }
  }

  const parsed = contactSchema.safeParse(values)
  if (!parsed.success) {
    const fieldErrors: ContactFormState['fieldErrors'] = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]
      if (
        (field === 'name' || field === 'email' || field === 'message') &&
        !fieldErrors[field]
      ) {
        fieldErrors[field] = issue.message
      }
    }
    return { status: 'error', fieldErrors, values }
  }

  const requestedProduct = formData.get('product')
  const product = CATALOG.find(entry => entry.id === requestedProduct)
  if (requestedProduct && !product) {
    return { status: 'error', formError: 'Choose a supported product or submit a general enquiry.', values }
  }
  const result = await deliver({
    ...parsed.data,
    message: product ? `Product: ${product.name}\n\n${parsed.data.message}` : parsed.data.message,
    submittedAt: new Date().toISOString(),
  })
  if (!result.delivered) {
    return {
      status: 'error',
      formError:
        result.reason === 'transport-unconfigured'
          ? TRANSPORT_PENDING_LINE
          : FAILURE_LINE,
      values,
    }
  }
  return { status: 'success' }
}
