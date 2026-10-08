/*
 * Client-safe form state types/values — deliberately zod-free: the client form leaf
 * imports ONLY this module (plus the server-action reference), so the zod schema never
 * enters the client bundle (06d finding: importing state from schema.ts pulled ~87 KB
 * gzip of zod into /contact's route JS).
 */
export interface ContactFormValues {
  name: string
  email: string
  message: string
}

export interface ContactFormState {
  status: 'idle' | 'success' | 'error'
  /** Form-level error line (deck copy), when the message could not be sent. */
  formError?: string
  /** Per-field error text, keyed by field id. */
  fieldErrors?: Partial<Record<keyof ContactFormValues, string>>
  /** Sticky values so a full-page (no-JS) re-render does not lose input. */
  values?: Partial<ContactFormValues>
}

export const CONTACT_FORM_INITIAL: ContactFormState = { status: 'idle' }
