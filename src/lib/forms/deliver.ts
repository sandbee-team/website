import 'server-only'

/*
 * Message delivery adapter (ADR-0007 §8): the ONLY place a transport is wired.
 * Q14 ruling (ADR-0014, 2026-09-01): the transport is the site owner's admin-panel
 * API, supplied at the end of the build — until then this adapter reports the honest
 * truth (`transport-unconfigured`) and the form NEVER fakes success. Wiring the real
 * transport later means implementing ONE branch here (plus the config value), nothing
 * in the pages.
 */

export interface ContactMessage {
  name: string
  email: string
  message: string
  /** ISO timestamp, set by the action at submit time. */
  submittedAt: string
}

export type DeliveryResult =
  | { delivered: true }
  | { delivered: false; reason: 'transport-unconfigured' | 'transport-error' }

/**
 * Q14 transport endpoint — the admin-panel API URL, set via environment when the
 * owner supplies it (kept out of the repo; .env* is git-ignored). Empty = pending.
 */
export async function deliver(
  message: ContactMessage,
): Promise<DeliveryResult> {
  const transportUrl = process.env.CONTACT_TRANSPORT_URL?.trim()
  if (!transportUrl) {
    // Honest pending state (never a fake success). The submission is intentionally
    // NOT persisted anywhere — a silently-buffered message would be a hidden promise.
    console.warn('[contact] transport unconfigured; message not delivered')
    return { delivered: false, reason: 'transport-unconfigured' }
  }
  try {
    const endpoint = new URL(transportUrl)
    if (endpoint.protocol !== 'https:') {
      return { delivered: false, reason: 'transport-error' }
    }
    const token = process.env.CONTACT_TRANSPORT_TOKEN?.trim()
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(message),
      signal: AbortSignal.timeout(8000),
      redirect: 'error',
      cache: 'no-store',
    })
    if (!response.ok) return { delivered: false, reason: 'transport-error' }
    return { delivered: true }
  } catch {
    return { delivered: false, reason: 'transport-error' }
  }
}
