import Link from 'next/link'
import { PortfolioArt } from './portfolio-art'
import styles from './portfolio.module.css'

/*
 * Homepage section 3 (plan §6): Products, Services and Developer technology as three
 * distinct editorial entries with working destinations. Not a card grid — three ruled
 * columns with an index, a title that IS the link, one line of the deck's copy
 * (.memory/content/home.md — reference §3.1/§3.2/§3.3) and the destination named in
 * words. Job: each reader finds their lane in one glance.
 */
const CATEGORIES = [
  {
    index: '01',
    name: 'Products',
    line: 'Complete applications, deployed privately for each customer and managed by Sandbee.',
    href: '/products',
    destination: 'See the products',
  },
  {
    index: '02',
    name: 'Services',
    line: 'Ongoing capabilities delivered through hosted systems, APIs and integrations.',
    href: '/services',
    destination: 'See the services',
  },
  {
    index: '03',
    name: 'Developer technology',
    line: 'Reusable developer technology for the problems you would rather not build from scratch.',
    href: '/technology',
    destination: 'Browse the packages',
  },
] as const

export function HomeWhatWeBuild() {
  return (
    <section className="section divider" id="what-sandbee-builds">
      <div className="container-site">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="type-kicker text-ink-muted">
              02 / An idea finds its form
            </p>
            <h2 className="type-hero mt-3">What Sandbee builds</h2>
          </div>
          <p className="type-lede text-ink-muted lg:col-span-6 lg:col-start-7 lg:self-end">
            Three forms of one company. Each offering is built, managed and sold
            in the form that fits it — sometimes on its own subdomain, always as
            Sandbee.
          </p>
        </div>
        <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {CATEGORIES.map((category) => (
            <li
              key={category.href}
              className={`flex flex-col border-t border-line-strong pt-6 ${styles.entry}`}
              data-reveal
            >
              <PortfolioArt kind={category.name} />
              <p className="type-caption tabular-nums text-ink-muted">
                {category.index}
              </p>
              <h3 className="type-section mt-4">
                <Link
                  href={category.href}
                  className="hover:underline hover:decoration-2 hover:underline-offset-4"
                >
                  {category.name}
                </Link>
              </h3>
              <p className="type-body mt-4 flex-1 text-ink-muted">
                {category.line}
              </p>
              <p className="type-ui mt-6">
                <Link href={category.href} className="link">
                  {category.destination}
                  <span aria-hidden="true"> →</span>
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
