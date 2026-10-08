import { ButtonLink } from '@/components/primitives'
import { SculptureStage } from './sculpture-stage'
import styles from './hero.module.css'

export function HomeHero() {
  return (
    <div className={styles.story} data-sculpture-story>
      <SculptureStage />
      <section
        className={styles.hero}
        data-hero
        data-scene
        aria-labelledby="hero-title"
      >
        <div className={`container-site ${styles.content}`}>
          <div className={styles.copy}>
            <p className={`type-kicker ${styles.overline}`}>
              Independent thinking. Useful technology.
            </p>
            <h1 id="hero-title" className={`type-display ${styles.title}`}>
              Ideas take <span className="type-serif">shape.</span>
            </h1>
            <p className={`type-lede ${styles.intro}`}>
              We build technology. Products, services and developer tools that
              turn a real need into something useful.
            </p>
            <div className={styles.actions} data-hero-actions>
              <ButtonLink href="/contact" size="lg">
                Let&rsquo;s build
              </ButtonLink>
              <a href="#form-parts" className={`type-ui ${styles.anchor}`}>
                Explore the story <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className={`type-caption ${styles.chapter}`}>
              01 / The possibility
            </p>
          </div>
        </div>
      </section>
      <section
        className={styles.chapterSection}
        id="form-parts"
        aria-labelledby="parts-title"
      >
        <div className={`container-site ${styles.content}`}>
          <div className={styles.copy}>
            <p className={`type-kicker ${styles.overline}`}>
              02 / Find the right pieces
            </p>
            <h2 id="parts-title" className={`type-hero ${styles.chapterTitle}`}>
              Complexity, <span className="type-serif">taken apart.</span>
            </h2>
            <p className={`type-lede ${styles.intro}`}>
              A business has a problem. A developer needs a missing piece. We
              look closely, connect the requirements and build what belongs.
            </p>
            <a href="#form-system" className={`type-ui ${styles.anchor}`}>
              Bring it together <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>
      <section
        className={styles.chapterSection}
        id="form-system"
        aria-labelledby="system-title"
      >
        <div className={`container-site ${styles.content}`}>
          <div className={styles.copy}>
            <p className={`type-kicker ${styles.overline}`}>
              03 / Make it work as one
            </p>
            <h2
              id="system-title"
              className={`type-hero ${styles.chapterTitle}`}
            >
              Many parts. <span className="type-serif">One purpose.</span>
            </h2>
            <p className={`type-lede ${styles.intro}`}>
              A managed product. A hosted service. A tool another developer can
              build with. Different forms, one company behind them.
            </p>
            <a
              href="#what-sandbee-builds"
              className={`type-ui ${styles.anchor}`}
            >
              Discover what we build <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
      <nav className={styles.chapterBar} aria-label="Form chapters">
        <a href="#hero-title">01 / Imagine</a>
        <a href="#form-parts">02 / Explore</a>
        <a href="#form-system">03 / Connect</a>
      </nav>
    </div>
  )
}
