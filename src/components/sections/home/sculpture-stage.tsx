import { Sculpture } from './sculpture'
import styles from './sculpture.module.css'
export function SculptureStage() {
  return (
    <div className={styles.stage} aria-hidden="true" data-sculpture-stage>
      <div className={styles.field}>
        <div className={styles.orbit} />
        <div className={styles.shadow} />
        <Sculpture className={styles.canvas} />
        <svg
          className={styles.fallback}
          viewBox="0 0 600 600"
          data-sculpture-fallback
        >
          <defs>
            <linearGradient id="sculpture-coral">
              <stop stopColor="var(--color-sculpture-coral)" />
              <stop offset="1" stopColor="var(--color-primary)" />
            </linearGradient>
            <linearGradient id="sculpture-citron">
              <stop stopColor="var(--color-sculpture-citron)" />
              <stop offset="1" stopColor="var(--color-primary)" />
            </linearGradient>
            <linearGradient id="sculpture-plum">
              <stop stopColor="var(--color-sculpture-plum)" />
              <stop offset="1" stopColor="var(--color-night)" />
            </linearGradient>
          </defs>
          <ellipse
            cx="300"
            cy="260"
            rx="150"
            ry="90"
            fill="none"
            stroke="url(#sculpture-coral)"
            strokeWidth="54"
            transform="rotate(-35 300 300)"
          />
          <ellipse
            cx="300"
            cy="330"
            rx="150"
            ry="90"
            fill="none"
            stroke="url(#sculpture-citron)"
            strokeWidth="54"
            transform="rotate(45 300 300)"
          />
          <ellipse
            cx="300"
            cy="320"
            rx="150"
            ry="90"
            fill="none"
            stroke="url(#sculpture-plum)"
            strokeWidth="54"
            transform="rotate(105 300 300)"
          />
        </svg>
        <div className={styles.annotation}>
          <span>Sandbee / Forms of possibility</span>
          <span>01 — 03</span>
        </div>
      </div>
    </div>
  )
}
