import styles from './delivery-chain.module.css'

const STEPS = [
  ['Your requirements', 'Discuss your menu, counters and order workflow.'],
  ['Agreed setup', 'Confirm the one-time implementation fee and scope.'],
  ['Your Vercel account', 'Sandbee configures the deployment in your account.'],
  ['Provider costs', 'Agree hosting, database and operating responsibilities.'],
  [
    'Review & handover',
    'Check the workflows and confirm support arrangements.',
  ],
] as const

export function DeliveryChain() {
  return (
    <figure
      className={styles.chain}
      aria-label="The Sandbee POS setup and handover process"
    >
      <figcaption className={styles.caption}>
        From your requirements to a POS in your account
      </figcaption>
      <ol className={styles.steps}>
        {STEPS.map(([title, description], index) => (
          <li key={title} className={styles.step}>
            <span className={styles.marker} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.description}>{description}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  )
}
