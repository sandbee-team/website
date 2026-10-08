import Link from 'next/link'

import { ButtonLink } from '@/components/primitives'

import styles from './developer.module.css'

/*
 * Homepage section 5 (plan §6): developer technology on the night surface — a precise
 * package directory with the actual technologies. Q6/ADR-0014 (named in ADR-0017): no
 * availability labels exist, so each entry carries its reference §15 delivery wording
 * instead of an invented status. Copy: 05a deck (reference §3.3, §4, §12). The single
 * honey rule under the heading is this section's brand moment (honey allowlist).
 */
const DIRECTORY = [
  {
    href: '/technology/electron-tracking',
    name: 'Electron desktop tracking',
    kind: 'Native · cross-platform',
    delivery: 'Build/package + controlled API access',
  },
  {
    href: '/technology/aadhaar-pan-ocr',
    name: 'Aadhaar / PAN OCR',
    kind: 'Document processing',
    delivery: 'Node.js package + API access',
  },
  {
    href: '/technology/face-scan-mobile',
    name: 'Mobile face-scan setup',
    kind: 'Mobile technology',
    delivery: 'Complete mobile integration/setup',
  },
] as const

export function HomeDeveloper() {
  return (
    <section
      className={`section surface-night ${styles.developer}`}
      data-surface="night"
      id="developer-technology"
    >
      <div className={`container-site ${styles.grid}`}>
        <div className={styles.copy}>
          <p className="type-kicker text-inverse-muted">For developers</p>
          <h2 className="type-hero mt-3">Developer technology</h2>
          <span className="mt-6 block h-0.5 w-12 bg-honey" aria-hidden="true" />
          <p className="type-body mt-6 text-inverse-muted">
            Electron desktop tracking. Aadhaar/PAN OCR. Mobile face-scan setup.
            The current direction of the developer portfolio — delivered as
            builds with controlled access, an API key or similar depending on
            the package. Never source code.
          </p>
          <div className="mt-8">
            <ButtonLink href="/technology" variant="secondary">
              Browse the packages
            </ButtonLink>
          </div>
        </div>
        <div className={styles.directory}>
          <div className={`type-caption ${styles.directoryHead}`}>
            <span>Technology directory</span>
            <span>Builds · SDKs · APIs</span>
          </div>
          <ul>
            {DIRECTORY.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.entry}>
                  <span className={styles.entryBody}>
                    <span className={`type-title-sm ${styles.entryName}`}>
                      {item.name}
                    </span>
                    <span className={`type-caption ${styles.entryKind}`}>
                      {item.kind}
                    </span>
                  </span>
                  <span className={`type-caption ${styles.entryDelivery}`}>
                    {item.delivery}
                  </span>
                  <span className={styles.entryArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className={`type-caption ${styles.directoryNote}`}>
            Current portfolio direction, not a fixed roadmap. Access is
            described on each technology page.
          </p>
        </div>
      </div>
    </section>
  )
}
