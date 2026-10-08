import { z } from 'zod'

/*
 * Contact form contract (ADR-0007 §8): Zod-validated server-side; error copy is the
 * 05a deck's microcopy (.memory/content/contact.md). The `website` field is the
 * honeypot — visually hidden, must stay empty; bots that fill it are rejected.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.').max(200),
  email: z.email('Enter an email address.'),
  message: z.string().trim().min(1, 'Tell us what you are building.').max(5000),
})

export type ContactInput = z.infer<typeof contactSchema>

// Form state lives in ./state (zod-free) so the client leaf never bundles zod.
export type { ContactFormState } from './state'
