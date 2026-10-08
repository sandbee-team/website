// The single base-URL constant (ADR-0007 §3): feeds metadataBase, canonicals, sitemap and
// robots. Never hardcode the production origin anywhere else.
const configuredUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://sandbee.in',
)
if (
  !['http:', 'https:'].includes(configuredUrl.protocol) ||
  configuredUrl.username ||
  configuredUrl.password
) {
  throw new Error(
    'NEXT_PUBLIC_SITE_URL must be a public HTTP(S) website URL without credentials.',
  )
}
export const SITE_URL = configuredUrl.origin
