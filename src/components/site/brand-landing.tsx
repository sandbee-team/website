// Client leaf: one measured, compositor-driven arrival; no animation loop in JS.
'use client'

import { useEffect, useRef } from 'react'

import { Bee } from '@/components/sections/home/bee'

import styles from './header.module.css'

const SEEN = 'sandbee-arrival-v1'

/*
 * The header bee (plan §7): once per tab session, on the homepage, after fonts are ready,
 * a 3000ms curved approach from off-canvas onto the wordmark's final `e`; wings settle on
 * landing, then the CSS ink pass runs over b/e/e. Geometry is sampled once from the
 * landed position, so the flight ends exactly on the letter whatever the font size.
 * Gates: reduced motion, a repeat visit in the session, another route, early scroll,
 * resize → the perched state immediately. The pause control pauses the flight; a hidden
 * tab pauses it too. Nothing here delays hero content.
 */
export function BrandLanding() {
  const bee = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const node = bee.current
    const word = node?.closest<HTMLElement>('[data-brand-name]')
    if (!node || !word || typeof matchMedia === 'undefined') return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)')
    let motion: Animation | undefined
    let disposed = false
    let userPaused = false
    let landed = false

    function settle(remember = true) {
      if (disposed || landed || !word || !node) return
      landed = true
      motion?.cancel()
      word.dataset.arrival = 'landed'
      node.style.willChange = ''
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (remember) {
        try {
          sessionStorage.setItem(SEEN, '1')
        } catch {
          /* storage is optional */
        }
      }
    }
    function onPreference() {
      if (reduce.matches) settle()
    }
    function onScroll() {
      if (window.scrollY > 64) settle()
    }
    function onResize() {
      settle()
    }
    function onVisibility() {
      if (!motion || landed) return
      if (document.hidden || userPaused) motion.pause()
      else motion.play()
    }
    function onPause(event: Event) {
      userPaused = Boolean(
        (event as CustomEvent<{ paused: boolean }>).detail?.paused,
      )
      onVisibility()
    }

    let seen = false
    try {
      seen = sessionStorage.getItem(SEEN) === '1'
    } catch {
      /* no storage */
    }
    if (reduce.matches || seen || location.pathname !== '/' || !node.animate) {
      settle(false)
      return
    }

    // Fonts settle before geometry is sampled. Hero content never waits for this.
    void document.fonts.ready.then(() => {
      if (disposed || landed) return
      if (reduce.matches || window.scrollY > 64) {
        settle()
        return
      }
      const box = node.getBoundingClientRect()
      const dx = Math.min(innerWidth - box.left + 45, 1200)
      const dy = Math.min(innerHeight * 0.29, 230)
      const style = getComputedStyle(node)
      // CSS minifiers may serialize 3000ms as 3s; WAAPI expects milliseconds.
      const time = style.getPropertyValue('--duration-bee-arrival').trim()
      const milliseconds = parseFloat(time) * (time.endsWith('ms') ? 1 : 1000)
      const duration =
        Number.isFinite(milliseconds) && milliseconds > 0 ? milliseconds : 3000
      const easing =
        style.getPropertyValue('--ease-bee-arrival').trim() || 'ease-out'
      // Sample a curved approach once. The browser interpolates transforms itself.
      const frames = Array.from({ length: 61 }, (_, i) => {
        const t = i / 60
        const u = 1 - t
        const x =
          u * u * u * dx + 3 * u * u * t * (dx * 0.62) + 3 * u * t * t * 54
        const y =
          u * u * u * dy + 3 * u * u * t * (dy + 30) + 3 * u * t * t * -30
        const angle = -10 + Math.sin(t * Math.PI) * 18
        return {
          offset: t,
          transform: `translate3d(${x}px,${y}px,0) rotate(${angle}deg)`,
          opacity: Math.min(1, t * 12),
        }
      })
      node.style.willChange = 'transform'
      word.dataset.arrival = 'flying'
      motion = node.animate(frames, { duration, easing, fill: 'both' })
      onVisibility()
      void motion.finished.then(() => settle()).catch(() => {})
    })

    reduce.addEventListener('change', onPreference)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('sandbee:motion', onPause)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      disposed = true
      motion?.cancel()
      reduce.removeEventListener('change', onPreference)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('sandbee:motion', onPause)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])
  return (
    <span
      ref={bee}
      className={styles.perch}
      aria-hidden="true"
      data-brand-perch
    >
      <Bee />
    </span>
  )
}
