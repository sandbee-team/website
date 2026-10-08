// Product selection is a local illustrative interaction; it makes no API requests.
'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { CATALOG } from '@/content/catalog'
import { BrandMark } from '@/components/site/brand-mark'
import { ProductIcon } from './product-icon'
import { ProductPreview } from './product-preview'
import styles from './workspace-demo.module.css'

export function WorkspaceDemo() {
  const [selected, setSelected] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const uid = useId()
  function navigate(event: KeyboardEvent, index: number) {
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % CATALOG.length
        : event.key === 'ArrowLeft'
          ? (index + CATALOG.length - 1) % CATALOG.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? CATALOG.length - 1
              : -1
    if (next < 0) return
    event.preventDefault()
    setSelected(next)
    tabs.current[next]?.focus()
  }
  const current = CATALOG[selected]
  return (
    <div className={styles.world}>
      <div className={styles.workspace}>
        <span>
          <BrandMark /> Sandbee Store
        </span>
        <small>One account. More possibilities.</small>
      </div>
      <div className={styles.connectors} aria-hidden="true">
        <svg viewBox="0 0 540 50" preserveAspectRatio="none">
          <path d="M270 0v20M60 50V30Q60 20 70 20H470Q480 20 480 30V50M200 20v30M340 20v30" />
        </svg>
      </div>
      <div
        role="tablist"
        aria-label="Explore Sandbee products"
        className={styles.tabs}
      >
        {CATALOG.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => {
              tabs.current[i] = el
            }}
            role="tab"
            aria-selected={selected === i}
            aria-controls={`${uid}-panel`}
            id={`${uid}-${i}`}
            tabIndex={selected === i ? 0 : -1}
            onKeyDown={(event) => navigate(event, i)}
            onClick={() => setSelected(i)}
          >
            <ProductIcon id={p.id} />
            <span>
              {p.id === 'messaging'
                ? 'Messaging'
                : p.id === 'ocr'
                  ? 'OCR'
                  : p.id === 'pos'
                    ? 'POS'
                    : 'GSTIN'}
            </span>
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`${uid}-${selected}`}
        id={`${uid}-panel`}
        className={styles.panel}
      >
        <div key={current.id} className={styles.transition}>
          <ProductPreview id={current.id} />
        </div>
      </div>
      <div className={styles.caption}>
        <span>{current.category}</span>
        <strong>{current.price}</strong>
      </div>
    </div>
  )
}
