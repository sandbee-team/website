import Link from 'next/link'
import { Arrow } from '@/components/catalog/product-icon'
import { GlassEmblem } from './glass-emblem'
import styles from './landing.module.css'

export function LandingHero() {
  return (
    <>
      <section
        className={styles.hero}
        aria-labelledby="landing-title"
        data-landing-hero
      >
        <div className={`container-site ${styles.heroGrid}`}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>
              <i /> Independent thinking. Useful technology.
            </span>
            <h1 id="landing-title">
              Ideas, made
              <br />
              <em>beautifully</em>
              <br />
              useful.
            </h1>
            <p>
              For the business you run.
              <br />
              For the thing you haven’t built yet.
              <br />
              <strong>We make software for what comes next.</strong>
            </p>
            <div className={styles.actions}>
              <Link href="/contact" className={styles.primary}>
                Let’s build something <Arrow diagonal />
              </Link>
              <a href="#what-we-do" className={styles.secondary}>
                Meet Sandbee <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <GlassEmblem />
        </div>
        <div className={`container-site ${styles.heroFoot}`}>
          <span>A technology company. Built around real work.</span>
          <a href="#what-we-do">
            A little more about us <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>
      <section
        id="what-we-do"
        className={`container-site ${styles.introduction}`}
        aria-labelledby="intro-title"
      >
        <div className={styles.introHeading}>
          <span className={styles.eyebrow}>A different way to build.</span>
          <h2 id="intro-title">
            Good technology
            <br />
            gets out of your way.
          </h2>
          <p>
            Sometimes you need the right tool. Sometimes you need a starting
            point. And sometimes, something that doesn’t exist yet.
          </p>
        </div>
        <div className={styles.paths}>
          <Link href="/products">
            <span className={styles.number}>01</span>
            <div>
              <h3>Something ready.</h3>
              <p>Thoughtful software for the work you do every day.</p>
            </div>
            <Arrow diagonal />
          </Link>
          <Link href="/packages">
            <span className={styles.number}>02</span>
            <div>
              <h3>Something to build with.</h3>
              <p>APIs and packages that fit into your own application.</p>
            </div>
            <Arrow diagonal />
          </Link>
          <Link href="/custom-technology">
            <span className={styles.number}>03</span>
            <div>
              <h3>Something of your own.</h3>
              <p>A custom workflow, built around your business.</p>
            </div>
            <Arrow diagonal />
          </Link>
        </div>
      </section>
    </>
  )
}
