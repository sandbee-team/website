import { ProductIcon, Arrow } from './product-icon'
import styles from './guide-cover.module.css'

/** Decorative editorial cover; the linked article heading supplies its name. */
export function GuideCover({ slug }: { slug: string }) {
  const kind = slug.includes('pos')
    ? 'pos'
    : slug.includes('ocr')
      ? 'ocr'
      : 'gst'
  const labels = {
    pos: ['Your product.', 'Your infrastructure.', 'Deployment notes'],
    ocr: ['From document', 'to useful data.', 'Integration notes'],
    gst: ['API or SDK?', 'Find your fit.', 'Developer notes'],
  }
  return (
    <div className={styles.cover} data-kind={kind} aria-hidden="true">
      <span className={styles.label}>{labels[kind][2]}</span>
      <div className={styles.composition}>
        <span className={styles.tile}>
          <ProductIcon id={kind} />
        </span>
        <span className={styles.connector} />
        <span className={styles.lines}>
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className={styles.caption}>
        <span>
          {labels[kind][0]}
          <br />
          {labels[kind][1]}
        </span>
        <Arrow diagonal />
      </div>
    </div>
  )
}
