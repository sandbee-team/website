import Link from 'next/link'
import { CATALOG, STORE_URL } from '@/content/catalog'
import { SITE_IDENTITY } from '@/config/site-identity'
import { BrandMark } from './brand-mark'
import { Arrow } from '@/components/catalog/product-icon'
import styles from './footer.module.css'

export function SiteFooter() {
  return (
    <footer className={styles.footer} data-surface="daylight">
      <div className="container-site">
        <div className={styles.top}>
          <div>
            <Link href="/" className={styles.brand} aria-label="Sandbee">
              <BrandMark />
              Sandbee.
            </Link>
            <p>
              Useful technology.
              <br />
              Built around your work.
            </p>
          </div>
          <a href={STORE_URL} className={styles.store}>
            Your next tool is here.
            <span>
              Explore Sandbee Store <Arrow diagonal />
            </span>
          </a>
        </div>
        <nav aria-label="Footer" className={styles.links}>
          <div>
            <h2>Products</h2>
            {CATALOG.map((p) => (
              <Link href={p.href} key={p.id}>
                {p.name}
              </Link>
            ))}
          </div>
          <div>
            <h2>Build with us</h2>
            <Link href="/services">Services</Link>
            <Link href="/packages">Packages & APIs</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/custom-technology">Custom technology</Link>
          </div>
          <div>
            <h2>Explore</h2>
            <Link href="/blog">Blog</Link>
            <Link href="/stories">Engineering stories</Link>
            <Link href="/company">Company</Link>
            <a href={`${STORE_URL}/developers`}>Developer guides</a>
          </div>
          <div>
            <h2>Let’s talk</h2>
            <Link href="/contact">Contact Sandbee</Link>
            {SITE_IDENTITY.email && (
              <a href={`mailto:${SITE_IDENTITY.email}`}>
                {SITE_IDENTITY.email}
              </a>
            )}
            <p>
              One website to explore.
              <br />
              One Store to get started.
            </p>
          </div>
        </nav>
        <div className={styles.bottom}>
          <span>© Sandbee</span>
          <span>Products. Services. Possibilities.</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
