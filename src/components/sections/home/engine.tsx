import { EngineLedgerIsland } from '@/components/motion/engine-ledger-island'

import styles from './engine.module.css'

/*
 * Homepage section 4 (plan §6): how the work becomes technology — the five-stage engine
 * (Problem → Build → Deploy → Manage → Reuse) walked with the one real worked example.
 * Static frame: all five rows visible, marker on row 02 — the no-JS/reduced state; the
 * button stepper island (Level 2, explicit controls) enhances it when motion is allowed.
 * Row copy: reference §3.3/§9 wording ("intended to become" kept; manage per §6).
 * Active row = sky-mist wash + primary rule + full-ink numeral (three co-located signals).
 */
export const LEDGER = [
  {
    n: '01',
    stage: 'Problem',
    body: 'A client needed application and web tracking inside an Electron app — existing solutions covered only keyboard and mouse.',
    artifact: 'artifact: requirement · electron',
    active: false,
  },
  {
    n: '02',
    stage: 'Build',
    body: 'Sandbee built the missing native, cross-operating-system components manually.',
    artifact: 'artifact: native components',
    active: true,
  },
  {
    n: '03',
    stage: 'Deploy',
    body: "Delivered against the client's real requirement — private, managed, no source-code handover.",
    artifact: 'artifact: working delivery',
    active: false,
  },
  {
    n: '04',
    stage: 'Manage',
    body: "Managed environments keep every customer's deployment, database and configuration separate.",
    artifact: 'artifact: isolated environment',
    active: false,
  },
  {
    n: '05',
    stage: 'Reuse',
    body: 'The tracking engine is intended to become a reusable package other developers reach through controlled access.',
    artifact: 'artifact: package · api key',
    active: false,
  },
]

export function HomeEngine() {
  return (
    <section className={`section ${styles.engine}`} id="the-engine">
      <div className="container-site">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="type-kicker text-ink-muted">03 / Made with care</p>
            <h2 className="type-hero mt-3">How the work becomes technology</h2>
          </div>
          <p className="type-lede text-ink-muted lg:col-span-5 lg:col-start-8 lg:self-end">
            A real client problem becomes a technical solution; the solution
            becomes reusable technology; the technology becomes a package,
            service or product for multiple customers.
          </p>
        </div>
        <ol className={styles.ledger} data-engine-static>
          {LEDGER.map((row) => (
            <li
              key={row.n}
              className={`${styles.row} ${row.active ? styles.rowActive : ''}`}
            >
              <span className={`type-code ${styles.numeral}`}>{row.n}</span>
              <span className={`type-ui ${styles.stage}`}>{row.stage}</span>
              <span className={`type-body ${styles.body}`}>{row.body}</span>
              <span className={`type-caption ${styles.artifact}`}>
                {row.artifact}
              </span>
            </li>
          ))}
        </ol>
        {/* Level-2 stepper enhances (never replaces) the static frame — it hides the
            list above only after rendering its own, and only when motion is allowed
            (see engine-ledger-island.tsx gates). */}
        <div className="mt-8">
          <EngineLedgerIsland />
        </div>
      </div>
    </section>
  )
}
