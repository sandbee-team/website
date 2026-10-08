'use client'

import { useEffect, useId, useRef } from 'react'
import styles from './landing.module.css'

// Finite assembly reveals one brand from several layers. Pointer response only
// explains their depth: no persistent RAF loop, touch tracking or scroll listener.
export function GlassEmblem() {
  const host = useRef<HTMLDivElement>(null)
  const uid = useId().replaceAll(':', '')
  useEffect(() => {
    const element = host.current
    if (!element || typeof window.matchMedia !== 'function') return
    const preference = matchMedia(
      '(prefers-reduced-motion: no-preference) and (pointer: fine)',
    )
    let frame = 0
    const reset = () => {
      cancelAnimationFrame(frame)
      element.style.removeProperty('--glass-x')
      element.style.removeProperty('--glass-y')
    }
    const move = (event: PointerEvent) => {
      if (!preference.matches) return
      cancelAnimationFrame(frame)
      const rect = element.getBoundingClientRect()
      const x = Math.max(
        -1,
        Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2),
      )
      const y = Math.max(
        -1,
        Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2),
      )
      frame = requestAnimationFrame(() => {
        element.style.setProperty('--glass-x', `${x * 7}deg`)
        element.style.setProperty('--glass-y', `${-y * 6}deg`)
      })
    }
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', reset)
    preference.addEventListener('change', reset)
    return () => {
      reset()
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', reset)
      preference.removeEventListener('change', reset)
    }
  }, [])
  return (
    <div ref={host} className={styles.art} aria-hidden="true" data-glass-emblem>
      <div className={styles.halo} />
      <div className={styles.ground} />
      <div className={styles.assembly}>
        <div className={`${styles.sheet} ${styles.sheetBack}`} />
        <div className={`${styles.sheet} ${styles.sheetMiddle}`} />
        <div className={`${styles.sheet} ${styles.sheetFront}`}>
          <div className={styles.sheetEdge} />
          <svg viewBox="0 0 64 68" className={styles.emblem} focusable="false">
            <defs>
              <linearGradient id={`${uid}-wing`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--glass-mark-light)" />
                <stop offset="0.38" stopColor="var(--glass-mark-mid)" />
                <stop offset="0.52" stopColor="var(--glass-mark-light)" />
                <stop offset="1" stopColor="var(--glass-mark-dark)" />
              </linearGradient>
              <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--glass-amber-light)" />
                <stop offset="0.5" stopColor="var(--glass-amber-mid)" />
                <stop offset="1" stopColor="var(--glass-amber-dark)" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#${uid}-wing)`}
              stroke="var(--glass-mark-stroke)"
              strokeWidth="0.35"
              d="M4 7L25 21L28 30L25 32L4 17ZM4 22L23 35L18 38L4 29ZM60 7L39 21L36 30L39 32L60 17ZM60 22L41 35L46 38L60 29ZM32 27L34 30H30Z"
            />
            <path
              fill={`url(#${uid}-body)`}
              stroke="var(--glass-amber-mid)"
              strokeWidth="0.3"
              d="M20 41L32 33L44 41V47L32 39L20 47ZM20 50L32 42L44 50V56L32 48L20 56ZM24 57L32 51L40 57L32 64Z"
            />
          </svg>
          <span className={styles.etched}>sandbee.</span>
        </div>
      </div>
      <span className={styles.artCaption}>
        Many possibilities. One Sandbee.
      </span>
    </div>
  )
}
