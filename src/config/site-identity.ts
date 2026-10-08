/*
 * SITE IDENTITY — the ONE place for entity/contact/legal identity data (Q8 ruling,
 * ADR-0014, 2026-09-01: "manage all of this in one main config file; I will add
 * manually; whatever is added should be shown").
 *
 * HOW TO USE (for the site owner): fill in any field below with the real value and it
 * appears on the site (footer, contact page, legal pages) automatically. Leave a field
 * as `undefined` and NOTHING renders for it — the UI shows its explicit "pending"
 * placeholder instead. Never put a guessed or temporary value here: everything in this
 * file is published verbatim.
 */

export interface SocialProfile {
  /** Display label, e.g. 'GitHub', 'LinkedIn', 'X'. */
  label: string
  /** Absolute URL of the profile. */
  url: string
}

export interface SiteIdentity {
  /** Registered legal entity name, e.g. 'Sandbee Technologies Private Limited'. */
  legalEntityName?: string
  /** Registered address, one string (line breaks allowed with \n). */
  registeredAddress?: string
  /** Public contact email, e.g. 'hello@sandbee.in'. */
  email?: string
  /** Public phone number, Indian conventions, e.g. '+91 98765 43210' (Q15). */
  phone?: string
  /** WhatsApp number or wa.me link, if a WhatsApp channel should be shown. */
  whatsapp?: string
  /** Public social/profile links, rendered in the order given. */
  socialProfiles?: SocialProfile[]
}

export const SITE_IDENTITY: SiteIdentity = {
  // Confirmed by the owner on September 15, 2026.
  legalEntityName: 'Sandbee',
  email: 'sandbee.team@gmail.com',
}

/** True when at least one direct contact channel exists to render. */
export function hasDirectChannels(
  identity: SiteIdentity = SITE_IDENTITY,
): boolean {
  return Boolean(
    identity.email ??
    identity.phone ??
    identity.whatsapp ??
    (identity.socialProfiles && identity.socialProfiles.length > 0),
  )
}
