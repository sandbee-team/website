import type { CSSProperties } from 'react'
import styles from './experience.module.css'
import { Sculpture } from '../sections/home/sculpture'

export type Experience =
  | 'products'
  | 'services'
  | 'technology'
  | 'company'
  | 'stories'
  | 'contact'
  | 'custom'
  | 'journal'
  | 'legal'

const MODELS: Record<
  Experience,
  { name: string; labels: string[]; caption: string; detail: string }
> = {
  products: {
    name: 'Separate by design',
    labels: ['Deployment', 'Database', 'Customer data'],
    caption: 'One customer. Their own environment.',
    detail:
      'Managed products keep deployments, databases and customer data separate. The illustration is a conceptual model, not a product screenshot.',
  },
  services: {
    name: 'A connected flow',
    labels: ['Request', 'Service', 'Integration'],
    caption: 'Capability, delivered where it is needed.',
    detail:
      'Hosted systems, APIs and integrations connect a requirement to an ongoing capability. Delivery depends on the service.',
  },
  technology: {
    name: 'Built to be built with',
    labels: ['Build', 'Access', 'Integrate'],
    caption: 'Reusable technology. A place in your system.',
    detail:
      'Developer technology is provided as a build, API or integration with controlled access, depending on the package. Never source code.',
  },
  company: {
    name: 'One company, many forms',
    labels: ['Products', 'Services', 'Technology'],
    caption: 'Different forms. The same company behind them.',
    detail:
      'Products, hosted services and developer technology are different ways Sandbee packages and delivers its work.',
  },
  custom: {
    name: 'Find the missing piece',
    labels: ['Requirement', 'Engineering', 'Useful outcome'],
    caption: 'Start with what your problem needs.',
    detail:
      'Custom requirements can lead to technical solutions and reusable technology. Not every project becomes a product.',
  },
  stories: {
    name: 'Inside the work',
    labels: ['Problem', 'Decision', 'Outcome'],
    caption: 'The thinking behind the technology.',
    detail:
      'Explore the real problem, the engineering decisions and the resulting technology in the story below.',
  },
  journal: {
    name: 'Room for the next thought',
    labels: ['Observe', 'Explore', 'Share'],
    caption: 'Notes from building useful things.',
    detail:
      'The journal will carry real articles when they are ready. No fictional posts or publication dates are shown.',
  },
  contact: {
    name: 'A brief becomes a beginning',
    labels: ['The need', 'The context', 'The possibility'],
    caption: 'Your next idea starts with a conversation.',
    detail:
      'Tell us what you need, the context around it and what it should do. Use the contact form below to describe the requirement.',
  },
  legal: {
    name: 'Clear by design',
    labels: ['Clarity', 'Context', 'Trust'],
    caption: 'The details deserve clear language.',
    detail:
      'Read the current information below. Pending legal content remains explicitly identified.',
  },
}

// The native study remains available without JavaScript or a WebGL context.
export function ExperienceArt({ kind }: { kind: Experience }) {
  const model = MODELS[kind]
  return (
    <figure className={styles.visual} data-experience-art={kind}>
      <div className={styles.visualTop}>
        <span className="type-kicker">{model.name}</span>
        <span className="type-caption">Scroll to discover</span>
      </div>
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.stageGrid} />
        <Sculpture kind={kind} className={styles.canvas} />
        <div className={styles.model}>
          {model.labels.map((label, index) => (
            <div
              key={label}
              className={styles.piece}
              style={{ '--piece': index } as CSSProperties}
            >
              <div className={styles.face}>
                <span className={styles.glyph}>
                  {kind === 'technology'
                    ? ['{', '/', '}'][index]
                    : String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.engraving}>{label}</span>
                <span className={styles.lines}>
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <div className={styles.edge} />
            </div>
          ))}
        </div>
      </div>
      <figcaption className={styles.artCaption}>{model.caption}</figcaption>
      <details className={styles.disclosure}>
        <summary>
          <span className={styles.whenClosed}>Unfold the idea</span>
          <span className={styles.whenOpen}>Bring it together</span>
          <span aria-hidden="true">↗</span>
        </summary>
        <p className="type-caption">{model.detail}</p>
      </details>
    </figure>
  )
}
