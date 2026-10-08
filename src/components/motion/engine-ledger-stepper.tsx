'use client'

import { useEffect, useState } from 'react'

import { LazyMotion, MotionConfig, m } from 'motion/react'

import { LEDGER } from '@/components/sections/home/engine'

/*
 * Engine ledger — Level-2 step interaction (07d task 3). Job (graft 2): stepping lets
 * a visitor replay how one client problem became reusable technology at their own
 * pace — the marker and the artifact line carry the Electron thread between stages.
 * Mechanism per ADR-0007 §6 VERBATIM: Motion `m` + `LazyMotion strict` +
 * `MotionConfig reducedMotion="user"`, in a lazy ssr:false island. Real <button>
 * controls only — NOTHING here is scroll-driven (spec §20). The server-rendered static
 * ledger (all five stages, marker on 02) stays the no-JS/reduced state: this component
 * hides it only after it has rendered the enhanced ledger, and restores it on unmount.
 * All five rows stay visible while stepping (adds-only). Active row = surface wash +
 * primary rule + full-ink numeral, matching the static frame's three signals.
 */

const loadFeatures = () =>
  import('./motion-features').then((mod) => mod.default)

export default function EngineLedgerStepper() {
  // Matches the static frame's marker (row 02) so enhancement starts where the
  // server frame rests.
  const [active, setActive] = useState(
    Math.max(
      LEDGER.findIndex((row) => row.active),
      0,
    ),
  )

  // Hide-only-after-ready: the static list disappears once THIS enhanced ledger is
  // in the DOM; unmount (reduce flip, navigation) restores it.
  useEffect(() => {
    const staticList = document.querySelector<HTMLElement>(
      '[data-engine-static]',
    )
    if (!staticList) return
    staticList.hidden = true
    return () => {
      staticList.hidden = false
    }
  }, [])

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <div data-engine-stepper>
          <div
            role="group"
            aria-label="Engine stages"
            className="flex flex-wrap gap-2"
          >
            {LEDGER.map((row, index) => (
              <button
                key={row.n}
                type="button"
                aria-current={index === active ? 'step' : undefined}
                onClick={() => setActive(index)}
                className={[
                  'type-ui min-h-11 cursor-pointer rounded-control border px-3.5',
                  index === active
                    ? 'border-primary bg-primary text-surface'
                    : 'border-line-strong bg-surface text-ink hover:bg-sky-mist',
                ].join(' ')}
              >
                {row.n} {row.stage}
              </button>
            ))}
          </div>
          <p aria-live="polite" aria-atomic="true" className="sr-only">
            Stage {LEDGER[active].n} of 05 — {LEDGER[active].stage}
          </p>
          <ol className="mt-6 border-t border-line-strong">
            {LEDGER.map((row, index) => (
              <li
                key={row.n}
                className={[
                  'grid grid-cols-[3rem_1fr] gap-x-4 gap-y-2 border-b border-line-strong py-5 pr-3 sm:grid-cols-[3rem_8rem_1fr] lg:grid-cols-[3rem_8rem_1fr_16rem] lg:items-baseline',
                  index === active
                    ? 'rounded-r-control border-l-2 border-l-primary bg-surface pl-3'
                    : 'border-l-2 border-l-transparent pl-3',
                ].join(' ')}
              >
                <span
                  className={[
                    'type-code tabular-nums',
                    index === active ? 'text-ink' : 'text-ink-muted',
                  ].join(' ')}
                >
                  {row.n}
                </span>
                <span className="type-ui font-semibold text-ink">
                  {row.stage}
                </span>
                <span className="type-body col-span-full max-w-none sm:col-span-1 sm:col-start-3">
                  {row.body}
                </span>
                {index === active ? (
                  // The artifact thread: revealed for the ACTIVE stage on every
                  // viewport (statically it renders at lg+ only). key remounts the
                  // element per stage so the entrance replays. 0.2s = the
                  // --duration-short token's designed first consumer; ease mirrors
                  // --ease-out-brand (CSS vars are unreadable in animation props).
                  <m.span
                    key={row.n}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                    className="type-caption col-span-full text-ink-muted sm:col-span-1 sm:col-start-3 lg:col-start-4"
                  >
                    {row.artifact}
                  </m.span>
                ) : (
                  <span className="type-caption hidden text-ink-muted lg:block">
                    {row.artifact}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}
