import { SITE_IDENTITY, hasDirectChannels } from '@/config/site-identity'

/*
 * Direct channels block (Q8 mechanism, ADR-0014): renders ONLY the fields the owner
 * has filled in src/config/site-identity.ts; while nothing is filled, the explicit
 * pending label (same honesty pattern as the footer). Never a fake address/number.
 */
export function DirectChannels() {
  if (!hasDirectChannels()) {
    return (
      <p className="type-label text-ink-muted">Direct channels — pending</p>
    )
  }
  const { email, phone, whatsapp, socialProfiles } = SITE_IDENTITY
  return (
    <ul className="type-body flex flex-col gap-2">
      {email ? (
        <li>
          <a className="link" href={`mailto:${email}`}>
            {email}
          </a>
        </li>
      ) : null}
      {phone ? (
        <li>
          <a className="link" href={`tel:${phone.replace(/\s+/g, '')}`}>
            {phone}
          </a>
        </li>
      ) : null}
      {whatsapp ? <li>WhatsApp: {whatsapp}</li> : null}
      {socialProfiles?.map((profile) => (
        <li key={profile.url}>
          {/* External profile URLs: plain anchor (typedRoutes Link is internal-only). */}
          <a className="link" href={profile.url} rel="me noopener">
            {profile.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
