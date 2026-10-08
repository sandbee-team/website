// Native disclosures retain no-JS navigation; client code adds Escape and outside dismissal.
'use client'

import Link from 'next/link'
import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react'
import { CATALOG, STORE_URL } from '@/content/catalog'
import { BrandMark } from './brand-mark'
import { ProductIcon, Arrow } from '@/components/catalog/product-icon'
import styles from './header.module.css'

export function SiteHeader() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key !== 'Escape') return
      if (
        event instanceof MouseEvent &&
        root.current?.contains(event.target as Node)
      )
        return
      root.current?.querySelectorAll('details[open]').forEach((details) => {
        details.removeAttribute('open')
        if (event instanceof KeyboardEvent)
          details.querySelector('summary')?.focus()
      })
    }
    document.addEventListener('click', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('click', close)
      document.removeEventListener('keydown', close)
    }
  }, [])
  function closeLinks(event: ReactMouseEvent) {
    if ((event.target as HTMLElement).closest('a'))
      root.current
        ?.querySelectorAll('details[open]')
        .forEach((d) => d.removeAttribute('open'))
  }
  return (
    <header
      ref={root}
      className={styles.header}
      data-site-header
      onClick={closeLinks}
    >
      <div className={`container-site ${styles.bar}`}>
        <Link href="/" className={styles.lockup} aria-label="Sandbee">
          <BrandMark className={styles.mark} />
          <span>
            Sandbee<span className={styles.brandDot}>.</span>
          </span>
        </Link>
        <nav aria-label="Primary" className={styles.nav}>
          <details className={styles.products}>
            <summary>
              Products
              <svg
                className={styles.chevron}
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m5 7.5 5 5 5-5" />
              </svg>
            </summary>
            <div className={styles.mega}>
              <div className={styles.megaHeading}>
                <div>
                  <strong>Useful software. Built to fit.</strong>
                  <p>Find the right starting point for your work.</p>
                </div>
                <Link href="/products">
                  All products <Arrow />
                </Link>
              </div>
              <div className={styles.productLinks}>
                {CATALOG.map((p) => (
                  <Link href={p.href} key={p.id}>
                    <ProductIcon id={p.id} />
                    <div>
                      <strong>{p.name}</strong>
                      <span>{p.label}</span>
                    </div>
                    <small>{p.price}</small>
                  </Link>
                ))}
              </div>
              <div className={styles.megaFooter}>
                <Link href="/services">Hosted services</Link>
                <Link href="/packages">Packages & APIs</Link>
                <a href={STORE_URL}>
                  Open Sandbee Store <Arrow diagonal />
                </a>
              </div>
            </div>
          </details>
          <Link href="/services">Services</Link>
          <Link href="/packages">Developers</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/blog">Resources</Link>
        </nav>
        <div className={styles.actions}>
          <a href={STORE_URL} className={styles.signin}>
            Sign in
          </a>
          <a href={STORE_URL} className={styles.store}>
            Open Store <Arrow diagonal />
          </a>
        </div>
        <details className={styles.mobile}>
          <summary aria-label="Open navigation">
            <span /> <span />
          </summary>
          <nav aria-label="Mobile navigation">
            <Link href="/products">All products</Link>
            {CATALOG.map((p) => (
              <Link href={p.href} key={p.id}>
                <ProductIcon id={p.id} />
                {p.name}
              </Link>
            ))}
            <Link href="/services">Services</Link>
            <Link href="/packages">Packages & APIs</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/company">Company</Link>
            <Link href="/contact">Contact</Link>
            <a href={STORE_URL}>
              Open Sandbee Store <Arrow diagonal />
            </a>
          </nav>
        </details>
      </div>
    </header>
  )
}
