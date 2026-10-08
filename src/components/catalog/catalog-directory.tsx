// Category filtering keeps the complete catalog server-rendered before hydration.
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CATALOG, type ProductId } from '@/content/catalog'
import { ProductPreview } from './product-preview'
import { ProductIcon, Arrow } from './product-icon'
import styles from './marketing.module.css'

export function CatalogDirectory({
  ids,
  filters = false,
}: {
  ids?: ProductId[]
  filters?: boolean
}) {
  const [filter, setFilter] = useState('All products')
  const entries = CATALOG.filter(
    (p) =>
      (!ids || ids.includes(p.id)) &&
      (filter === 'All products' || p.category === filter),
  )
  return (
    <div>
      {filters && (
        <div
          className={styles.filters}
          role="group"
          aria-label="Filter products"
        >
          {[
            'All products',
            'API service',
            'Developer package',
            'Business software',
          ].map((value) => (
            <button
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {value}
            </button>
          ))}
        </div>
      )}
      <div className={styles.catalogGrid}>
        {entries.map((p) => (
          <article className={styles.productCard} key={p.id}>
            <div className={styles.productCardCopy}>
              <div className={styles.cardLabel}>
                <ProductIcon id={p.id} />
                <span>{p.category}</span>
                <b>{p.price}</b>
              </div>
              <h2>
                <Link href={p.href}>
                  {p.name} <Arrow diagonal />
                </Link>
              </h2>
              <p>{p.description}</p>
              <Link href={p.href} className={styles.textLink}>
                Explore {p.name} <Arrow />
              </Link>
            </div>
            <div className={styles.cardPreview}>
              <ProductPreview id={p.id} compact />
            </div>
          </article>
        ))}
      </div>
      <p className={styles.directoryNote} role="status">
        {entries.length} {entries.length === 1 ? 'product' : 'products'} · Every
        product has its own access and pricing model.
      </p>
    </div>
  )
}
