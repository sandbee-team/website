'use client'

import { useEffect } from 'react'

/*
 * Hero signals→outcome assembly — the site's single Level-3 moment (ADR-0004; H2 comp,
 * G2-approved; job sentence, graft 2: "show the claim being ASSEMBLED — raw signals
 * become systems, packaged technology, and a delivered outcome — once, then rest as a
 * living frame"). Motion-first at the LADDER'S LOWEST rung that does the job: the
 * imperative `animate`/`stagger` API on the server-rendered SVG (no React motion tree,
 * no markup changes beyond data-step attributes) — `m` + LazyMotion would add the
 * React renderer for nothing; GSAP is unjustified (<3 pinned steps). The library loads
 * via dynamic import INSIDE the effect, so nothing enters the initial bundle
 * (ADR-0007 §6; motion-levels budget rules).
 *
 * Gates (motion-levels Level-3 requirements): skipped under prefers-reduced-motion
 * (checked AND watched for change — cancels mid-flight), on viewports < 768px (the
 * band scrolls horizontally there; assembling an off-screen tail is cost without
 * communication), and under Save-Data. The static frame is complete before, during
 * and after — this island is deletable without breaking layout or meaning (graft 3).
 * The ambient idle at rest is pure CSS on the static frame (globals.css — closes
 * ADR-0004 conflict 2 with a budget-safe implementation, so no-JS users get the
 * living system too).
 */
export function HeroAssembly() {
  useEffect(() => {
    // No matchMedia (jsdom, exotic embedders) => no way to honour reduce => no motion.
    if (typeof window.matchMedia !== 'function') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const saveData =
      'connection' in navigator &&
      (navigator as { connection?: { saveData?: boolean } }).connection
        ?.saveData === true
    if (reduce.matches || saveData || window.innerWidth < 768) return

    const svg = document.querySelector<SVGSVGElement>(
      'svg[aria-labelledby^="hero-band-title"]',
    )
    if (!svg || svg.dataset.assemblyState === 'played') return
    const steps = Array.from(
      svg.querySelectorAll<SVGElement>('[data-assembly]'),
    ).sort(
      (a, b) =>
        Number(a.dataset.assembly ?? 0) - Number(b.dataset.assembly ?? 0),
    )
    if (steps.length === 0) return

    let cancelled = false
    const controls: Array<{ cancel(): void; complete(): void }> = []
    // Hide only once the library is ready, so a slow load never strands a blank band.
    import('motion')
      .then(({ animate, stagger }) => {
        if (cancelled || reduce.matches) return
        for (const el of steps) el.style.opacity = '0'
        svg.dataset.assemblyState = 'playing'
        const animation = animate(
          steps,
          {
            opacity: [0, 1],
            transform: ['translateY(6px)', 'translateY(0px)'],
          },
          {
            delay: stagger(0.14),
            duration: 0.35,
            ease: [0.2, 0, 0, 1], // --ease-out-brand, mirrored (CSS vars are not readable here pre-paint)
          },
        )
        controls.push(animation)
        animation.finished.then(() => {
          if (!cancelled) svg.dataset.assemblyState = 'played'
        })
      })
      .catch(() => {
        // Library failed to load: restore and leave the static frame untouched.
        for (const el of steps) {
          el.style.removeProperty('opacity')
          el.style.removeProperty('transform')
        }
      })

    const cancel = () => {
      cancelled = true
      for (const control of controls) {
        control.complete()
      }
      for (const el of steps) {
        el.style.removeProperty('opacity')
        el.style.removeProperty('transform')
      }
      svg.dataset.assemblyState = 'played'
    }
    // Reduce toggled mid-flight: jump to the complete frame immediately.
    reduce.addEventListener('change', cancel)
    return () => {
      reduce.removeEventListener('change', cancel)
      cancelled = true
      for (const control of controls) control.cancel()
      for (const el of steps) {
        el.style.removeProperty('opacity')
        el.style.removeProperty('transform')
      }
    }
  }, [])
  return null
}
