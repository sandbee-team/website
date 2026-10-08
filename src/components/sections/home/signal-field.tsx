// Client leaf: visitors select a stage and assemble the conceptual operating model.
'use client'

import { useState } from 'react'

import styles from './idea.module.css'

const STAGES = [
  {
    name: 'Signals',
    detail: 'A real requirement. The starting point for something useful.',
  },
  {
    name: 'Systems',
    detail: 'The engineering that turns a requirement into working software.',
  },
  {
    name: 'Technology',
    detail:
      'Working systems, packaged as products, services and developer tools.',
  },
  {
    name: 'Outcomes',
    detail: 'Useful technology, delivered and managed in the form that fits.',
  },
]

/**
 * The operating model as a conceptual diagram (Signals → Systems → Technology →
 * Outcomes), not a product screenshot. Explicit controls only: a stage selector and an
 * assemble/explore toggle; nothing is scroll-driven. Motion job: moving the layers shows
 * that the four stages are one stack. Static and no-JS: the exploded stack with stage 03
 * highlighted. Fully keyboard-operable (real buttons, aria-pressed, live caption).
 */
export function SignalField() {
  const [active, setActive] = useState(2)
  const [expanded, setExpanded] = useState(true)
  return (
    <div
      className={`panel ${styles.lab}`}
      data-signal-lab
      data-expanded={expanded}
      data-stage={active}
    >
      <div className={`type-caption ${styles.topline}`}>
        <span>The operating model</span>
        <span aria-hidden="true">Fig. 01</span>
      </div>
      <div className={styles.scene}>
        <svg
          viewBox="0 0 520 440"
          role="img"
          aria-labelledby="field-title field-desc"
        >
          <title id="field-title">
            Signals become systems, technology and useful outcomes
          </title>
          <desc id="field-desc">
            Four connected isometric layers represent the Sandbee operating
            model. Select a stage below to explore its purpose, or assemble the
            layers.
          </desc>
          <g className={styles.construction} fill="none">
            <path d="M260 15V422M32 220H488M58 112L462 346M58 346L462 112" />
            <path
              d="M260 34L476 159V309L260 433L44 309V159Z"
              strokeDasharray="3 7"
            />
            <ellipse cx="260" cy="344" rx="198" ry="75" />
            <ellipse cx="260" cy="344" rx="170" ry="60" />
          </g>
          <g className={styles.layer} data-layer="3">
            <path
              className={styles.side}
              d="M95 288L260 383L425 288V304L260 400L95 304Z"
            />
            <path
              className={styles.plate}
              d="M260 193L425 288L260 383L95 288Z"
            />
            <g className={styles.trace} fill="none">
              <path d="M147 288L260 353L374 288L260 223Z" />
              <path d="M260 223V353M147 288H374" />
            </g>
            <path
              className={styles.cell}
              d="M200 276l24 -14l24 14l-24 14ZM235 296l24 -14l24 14l-24 14ZM270 316l24 -14l24 14l-24 14Z"
            />
          </g>
          <g className={styles.layer} data-layer="2">
            <path
              className={styles.side}
              d="M112 226L260 311L408 226V242L260 327L112 242Z"
            />
            <path
              className={styles.plate}
              d="M260 141L408 226L260 311L112 226Z"
            />
            <path
              className={styles.trace}
              fill="none"
              d="M260 157L380 226L260 295L140 226Z M174 206L208 226L174 246M346 206L312 226L346 246"
            />
            <path
              className={styles.chipSide}
              d="M214 210L260 237L306 210V238L260 265L214 238Z"
            />
            <path
              className={styles.chip}
              d="M260 183L306 210L260 237L214 210Z"
            />
            <path
              className={styles.chipMark}
              d="M241 210L253 217L279 202"
              fill="none"
            />
          </g>
          <g className={styles.layer} data-layer="1">
            <path
              className={styles.side}
              d="M132 166L260 240L388 166V178L260 252L132 178Z"
            />
            <path
              className={styles.plate}
              d="M260 92L388 166L260 240L132 166Z"
            />
            <g className={styles.trace} fill="none">
              <path d="M166 166L260 220L354 166L260 112Z" />
              <path d="M210 159L260 188L310 159M210 177L260 206L310 177" />
            </g>
            <path
              className={styles.detail}
              d="M232 147L260 163L288 147L260 131Z"
            />
          </g>
          <g className={styles.layer} data-layer="0">
            <path
              className={styles.side}
              d="M151 107L260 170L369 107V118L260 181L151 118Z"
            />
            <path
              className={styles.plate}
              d="M260 44L369 107L260 170L151 107Z"
            />
            <g className={styles.signal} fill="none">
              <path d="M209 100L235 85M237 116L263 101M265 132L291 117" />
            </g>
            <g className={styles.trace} fill="none">
              <path d="M178 107L260 60L342 107M178 107L260 154L342 107" />
            </g>
          </g>
          <g className={styles.registration} fill="none">
            <path d="M25 32H41M33 24V40M479 32H495M487 24V40M25 408H41M33 400V416M479 408H495M487 400V416" />
          </g>
        </svg>
        <button
          type="button"
          className={`type-caption ${styles.assemble}`}
          onClick={() => setExpanded(!expanded)}
          aria-pressed={!expanded}
        >
          <span aria-hidden="true">{expanded ? '↘' : '↗'}</span>{' '}
          {expanded ? 'Assemble layers' : 'Explore layers'}
        </button>
      </div>
      <div
        className={styles.stages}
        role="group"
        aria-label="Explore the operating model"
      >
        {STAGES.map((stage, i) => (
          <button
            key={stage.name}
            type="button"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            <span className="type-caption">0{i + 1}</span>
            <span>{stage.name}</span>
          </button>
        ))}
      </div>
      <p
        className={`type-caption ${styles.caption}`}
        aria-live="polite"
        aria-atomic="true"
        data-lab-caption
      >
        {STAGES[active].detail}
      </p>
    </div>
  )
}
