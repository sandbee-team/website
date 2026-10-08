// Client boundary for the homepage's ambient motion: one pause control for every
// ambient animation (clouds, hero bees, the header bee's arrival and ink pass) and
// offscreen suspension of scenes. State is published two ways: `data-in-view` on each
// [data-scene] element (IntersectionObserver) and `data-motion` on <html>, so CSS
// modules anywhere — including the header outside this tree — can key on it. The
// header's WAAPI arrival listens for the `sandbee:motion` event.
'use client'

import { useEffect, useState, type ReactNode, type CSSProperties } from 'react'
import styles from './journey.module.css'

const CHAPTERS = [
  ['hero-title', 'The spark'],
  ['form-parts', 'The pieces'],
  ['form-system', 'The connection'],
  ['the-story', 'The idea'],
  ['what-sandbee-builds', 'The possibilities'],
  ['the-engine', 'The craft'],
  ['engineering-stories', 'The story'],
  ['lets-build', 'Your next idea'],
] as const

export function FlightWorld({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(true)
  const [chapter, setChapter] = useState(0)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const scenes = document.querySelectorAll<HTMLElement>(
      '[data-scene], main .section',
    )
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ;(entry.target as HTMLElement).dataset.inView = String(
            entry.isIntersecting,
          )
          if (entry.isIntersecting)
            (entry.target as HTMLElement).dataset.entered = 'true'
        }
      },
      { rootMargin: '80px' },
    )
    scenes.forEach((scene) => observer.observe(scene))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const targets = CHAPTERS.map(([id]) =>
      document.getElementById(id)?.closest('section'),
    )
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = targets.indexOf(entry.target as HTMLElement)
            if (index >= 0) setChapter(index)
          }
        }
      },
      { rootMargin: '-25% 0px -60% 0px' },
    )
    targets.forEach((target) => target && observer.observe(target))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.documentElement.dataset.motion = playing ? 'playing' : 'paused'
    return () => {
      delete document.documentElement.dataset.motion
    }
  }, [playing])

  return (
    <>
      <nav
        aria-label="Story chapters"
        className={styles.journey}
        data-story-nav
      >
        <span
          className={styles.guide}
          aria-hidden="true"
          style={{ '--chapter': chapter } as CSSProperties}
        >
          <span className={styles.chapterNumber}>
            {String(chapter + 1).padStart(2, '0')}
          </span>
        </span>
        {CHAPTERS.map(([id, label], index) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={chapter === index ? 'step' : undefined}
            aria-label={label}
          >
            <span aria-hidden="true" className={styles.dot} />
            <span className={styles.label}>{label}</span>
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="motion-toggle"
        aria-pressed={!playing}
        onClick={() => {
          const paused = playing
          setPlaying(!playing)
          window.dispatchEvent(
            new CustomEvent('sandbee:motion', { detail: { paused } }),
          )
        }}
      >
        <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span>
        {playing ? 'Pause motion' : 'Play motion'}
      </button>
      {children}
    </>
  )
}
