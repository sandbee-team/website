import { ButtonLink, TextLink } from '@/components/primitives'

import styles from './story.module.css'

/*
 * Homepage section 6 (plan §6): the real Electron-tracking engineering story — strong
 * typography and one meaningful visual. The visual is a coverage figure drawn from the
 * reference's own facts (§3.3): existing solutions covered keyboard and mouse; the
 * client needed application and web tracking; Sandbee built those missing native,
 * cross-platform components. HTML, not SVG text, so labels never fall below legibility
 * at 320px. Copy: 05a deck (verbatim-close to §3.3; no OS-coverage claim beyond it).
 */
const COVERAGE = [
  { label: 'Keyboard tracking', state: 'existed', note: 'existing solutions' },
  { label: 'Mouse tracking', state: 'existed', note: 'existing solutions' },
  { label: 'Application tracking', state: 'built', note: 'built by Sandbee' },
  { label: 'Web tracking', state: 'built', note: 'built by Sandbee' },
] as const

export function HomeStories() {
  return (
    <section className={`section ${styles.story}`} id="engineering-stories">
      <div className={`container-site ${styles.grid}`}>
        <div className={styles.copy} data-reveal>
          <p className="type-kicker text-ink-muted">
            04 / Every build has a story
          </p>
          <h2 className="type-hero mt-3">
            Built for one. <span className="type-serif">Useful to many.</span>
          </h2>
          <p className="type-body mt-5">
            Existing solutions covered keyboard and mouse. The client needed
            application and web tracking too — so Sandbee built the missing
            native, cross-platform components manually.
          </p>
          <p className="type-body mt-4 text-ink-muted">
            The resulting technology is intended to become a reusable package
            for other developers who need similar functionality.
          </p>
          <p className="type-ui mt-6">
            <TextLink href="/stories/electron-tracking-origin">
              Read the story<span aria-hidden="true"> →</span>
            </TextLink>
          </p>
        </div>
        <figure className={`panel ${styles.figure}`}>
          <ul
            className={styles.coverage}
            aria-label="Desktop tracking coverage"
          >
            {COVERAGE.map((item) => (
              <li
                key={item.label}
                className={`${styles.cellItem} ${item.state === 'built' ? styles.cellBuilt : ''}`}
              >
                <span className={`type-ui ${styles.cellLabel}`}>
                  {item.label}
                </span>
                <span className={`type-caption ${styles.cellNote}`}>
                  {item.note}
                </span>
              </li>
            ))}
          </ul>
          <figcaption className={`type-caption ${styles.figcaption}`}>
            Desktop tracking coverage: what existing solutions handled, and the
            two areas Sandbee engineered — now one cross-platform technology.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

/*
 * Homepage section 7 (plan §6): a spacious closing action with a light warm accent and
 * the direct contact route. The statement is the reference's own common-thread line
 * (§13, quoted). Heading text stays "Let's build" — the shell CTA continues the promise.
 */
export function HomeBrandMoment() {
  return (
    <section
      className={`section ${styles.closing}`}
      id="lets-build"
      data-closing
    >
      <div className={`container-site ${styles.closingGrid}`}>
        <div>
          <p className="type-kicker text-ink-muted">
            05 / The next story could be yours
          </p>
          <h2 className="type-display mt-4">
            Let&rsquo;s <span className="type-serif">build</span>
          </h2>
        </div>
        <div className={styles.closingCopy}>
          <p className="type-lede">
            Build useful technology, package it intelligently, manage it
            efficiently, and sell it in the form that best fits the customer and
            the technology.
          </p>
          <p className="type-body mt-4 text-ink-muted">
            Tell us what you need — a product setup, a service, package access,
            or a custom requirement.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="/contact" size="lg">
              Start a conversation
            </ButtonLink>
            <TextLink href="/company" className="type-ui">
              How Sandbee works
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  )
}
