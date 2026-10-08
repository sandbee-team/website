'use client'

import { Component, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import dynamic from 'next/dynamic'

/*
 * Gate + loader for the engine ledger stepper (07d). The stepper (and with it the
 * m/LazyMotion wrappers) lives in an ssr:false chunk that loads ONLY when motion is
 * allowed AND the section approaches the viewport, so the home route's initial JS
 * stays flat and the static ledger remains the complete no-JS/reduced experience
 * (07b gate pattern):
 * - no matchMedia (old engines, jsdom) → static frame stands;
 * - prefers-reduced-motion → static frame stands, and a mid-session flip to reduce
 *   unmounts the stepper (its cleanup restores the static list);
 * - NOT near the viewport → nothing loads (IntersectionObserver, 400px margin).
 *   This is the 07d lantern-LCP fix: an eagerly-hydrating below-fold island put its
 *   runtime chunks inside Lighthouse's simulated critical path (+~610ms lantern LCP,
 *   bisected 2026-09-02) — visitors who never scroll now never pay for it, and the
 *   LCP window never sees the chunks. No IntersectionObserver → load on mount
 *   (graceful, pre-2019 engines only);
 * - chunk-load failure (CDN blip, ad-blocker) → the boundary below swallows the
 *   render error so the intact static ledger stands — without it the uncaught
 *   error unmounts the ENTIRE route, no error.tsx exists sitewide (07d perf-a11y
 *   BLOCKER; probe: aborting the chunk request whitescreened the page).
 */
const EngineLedgerStepper = dynamic(() => import('./engine-ledger-stepper'), {
  ssr: false,
})

class IslandBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    // The static ledger is only hidden by the stepper AFTER it renders, so on
    // failure nothing was hidden — rendering null leaves the complete frame.
    return this.state.failed ? null : this.props.children
  }
}

export function EngineLedgerIsland() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [allowed, setAllowed] = useState(false)
  // No-IntersectionObserver engines start "near view" (load on mount, the pre-2019
  // graceful path). Lazy initializer instead of a synchronous set-in-effect
  // (react-hooks/set-state-in-effect); server/client initial DOM is identical either
  // way because `allowed` is false until the matchMedia effect runs.
  const [nearView, setNearView] = useState(
    () => typeof IntersectionObserver !== 'function',
  )

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setAllowed(!query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const host = hostRef.current
    if (!host || typeof IntersectionObserver !== 'function') return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={hostRef} data-engine-island>
      {allowed && nearView ? (
        <IslandBoundary>
          <EngineLedgerStepper />
        </IslandBoundary>
      ) : null}
    </div>
  )
}
