import { SignalField } from './signal-field'
import styles from './idea.module.css'

/*
 * Homepage section 2 (plan §6): a short transition from the sky into Sandbee's operating
 * idea — one concise explanation and one composed illustration (the interactive operating
 * model). Job: say what the company actually does with a requirement, in two sentences,
 * and let the visitor explore the four stages at their own pace. Copy: reference
 * §1/§4/§13 in the deck's wording; no metrics, no claims.
 */
export function FlightStory() {
  return (
    <section className={`section ${styles.idea}`} id="the-story">
      <div className={`container-site ${styles.grid}`}>
        <div className={styles.copy} data-reveal>
          <p className="type-kicker text-ink-muted">
            01 / It starts with a question
          </p>
          <h2 className="type-hero mt-3">
            From an idea to <span className="type-serif">useful software.</span>
          </h2>
          <p className="type-lede mt-5 text-ink-muted">
            A business has a problem. A developer needs a missing piece. That is
            where the work begins.
          </p>
          <p className="type-body mt-4">
            We turn real requirements into working systems, then package them in
            the form that fits: a managed product, a hosted service, or a tool
            another developer can build with. One company behind all of it.
          </p>
          <p className="type-caption mt-6 text-ink-muted">
            Explore the model: pick a stage, or bring the layers together.
          </p>
        </div>
        <div className={styles.figure} data-reveal>
          <SignalField />
        </div>
      </div>
    </section>
  )
}
