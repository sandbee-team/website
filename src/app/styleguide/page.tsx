import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { Metadata } from 'next'

import Fixture from '@/content/fixtures/sample-entry.mdx'
import { ContactForm } from '@/components/contact/contact-form'

import {
  Button,
  ButtonLink,
  Callout,
  CodeBlock,
  Figure,
  IndexRow,
  Notice,
  Rule,
  StatusBadge,
  Table,
  Td,
  TextAreaField,
  TextField,
  TextLink,
  Th,
} from '@/components/primitives'
import { experienceFont } from '@/components/site/experience-font'
import experienceStyles from '@/components/site/experience.module.css'

/*
 * Internal design-system reference (plan §8): typography, colours (with contrast computed
 * from the token file at build time — never hand-typed), components in every state on both
 * surfaces, and the motion behaviours. The axe/a11y gate and visual QA run against this page
 * (tests/a11y/styleguide.spec.ts). Not part of the §8 IA: noindex, never in the sitemap,
 * never linked from site chrome. Copy is generic UI text by design — zero company facts.
 */
export const metadata: Metadata = {
  title: 'Styleguide',
  robots: { index: false, follow: false },
}

function tokens(): Record<string, string> {
  const css = readFileSync(
    join(process.cwd(), 'src', 'app', 'globals.css'),
    'utf8',
  )
  const out: Record<string, string> = {}
  for (const match of css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{6})/g)) {
    out[match[1]] = match[2].toUpperCase()
  }
  return out
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): string {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return ((hi + 0.05) / (lo + 0.05)).toFixed(2)
}

const SWATCHES = [
  ['canvas', 'Main page background'],
  ['surface', 'Forms, panels, readable content'],
  ['sky', 'Hero atmosphere'],
  ['sky-mist', 'Distant sky, soft transitions, wells'],
  ['ink', 'Main text'],
  ['ink-muted', 'Supporting text on light surfaces'],
  ['primary', 'Primary actions, active states'],
  ['honey', 'Bee detail, occasional accent fill'],
  ['honey-ink', 'Accent text on light surfaces'],
  ['line', 'Decorative separators'],
  ['line-strong', 'Interactive boundaries'],
  ['night', 'Developer section and footer'],
  ['inverse', 'Text on night'],
] as const

const PAIRS = [
  ['ink', 'canvas'],
  ['ink-muted', 'canvas'],
  ['ink', 'sky'],
  ['primary', 'canvas'],
  ['surface', 'primary'],
  ['honey-ink', 'canvas'],
  ['honey', 'night'],
  ['inverse', 'night'],
  ['inverse-muted', 'night'],
  ['line-strong', 'canvas'],
  ['error', 'canvas'],
  ['success', 'canvas'],
] as const

const TYPE_STEPS = [
  ['type-display', 'Display', 'We build'],
  ['type-hero', 'Page title', 'Products for real requirements'],
  ['type-section', 'Section title', 'How a service is delivered'],
  ['type-title-sm', 'Entry title', 'Private managed deployment'],
  [
    'type-lede',
    'Lede',
    'A short introduction that sets up the page in one or two sentences.',
  ],
  [
    'type-body',
    'Body',
    'Reading text stays at sixteen to eighteen pixels with a generous line height and a measure of about sixty-four characters so long explanations remain comfortable.',
  ],
  ['type-ui', 'Interface', 'Navigation · Button'],
  ['type-caption', 'Caption', 'Supporting label or meta line'],
  ['type-kicker', 'Kicker', 'Section marker'],
  ['type-code', 'Code', 'npm install example-package'],
] as const

export default function StyleguidePage() {
  const colour = tokens()
  // The root layout owns <main>; this page renders content only (03b shell decision).
  return (
    <div className="container-site section-sm">
      <p className="type-kicker text-ink-muted">Internal — design system</p>
      <h1 className="type-hero mt-3">Styleguide</h1>
      <p className="type-lede mt-4 text-ink-muted">
        The live visual system in one place: type, colour, components in every
        state on both surfaces, and how things move. This page exists for
        automated checks and visual QA; it is not part of the public site.
      </p>

      <section className="mt-16">
        <h2 className="type-section">Typography</h2>
        <p className="type-body mt-3 text-ink-muted">
          Barlow Condensed gives page titles their architectural display voice.
          Manrope carries body and interface text; Instrument Serif supplies the
          editorial accent.
        </p>
        <div className={experienceFont.variable}>
          <p className={`type-hero ${experienceStyles.title}`}>
            Form follows possibility.
          </p>
        </div>
        <div className="mt-8 divider">
          {TYPE_STEPS.map(([cls, name, sample]) => (
            <div
              key={cls}
              className="grid gap-2 border-b border-line py-5 md:grid-cols-[10rem_1fr] md:gap-8"
            >
              <p className="type-caption text-ink-muted">
                {name}
                <br />
                <code className="type-code">{cls}</code>
              </p>
              <p className={cls}>{sample}</p>
            </div>
          ))}
          <div className="grid gap-2 border-b border-line py-5 md:grid-cols-[10rem_1fr] md:gap-8">
            <p className="type-caption text-ink-muted">
              Serif accent
              <br />
              <code className="type-code">type-serif</code>
            </p>
            <p className="type-display">
              We build <span className="type-serif">technology.</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="type-section">Colour</h2>
        <p className="type-body mt-3 text-ink-muted">
          Semantic tokens from the token file. Contrast is computed at build
          time from the same file, so the numbers below cannot drift from the
          code.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SWATCHES.map(([name, role]) => (
            <li key={name} className="panel overflow-hidden">
              <div
                className="h-16 border-b border-line"
                style={{ backgroundColor: `var(--color-${name})` }}
                aria-hidden="true"
              />
              <div className="p-4">
                <p className="type-label">
                  {name}{' '}
                  <span className="type-code text-ink-muted">
                    {colour[name]}
                  </span>
                </p>
                <p className="type-caption mt-1 text-ink-muted">{role}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Table caption="Contrast ratios of the recorded foreground/background pairs (WCAG 2.x, computed)">
            <thead>
              <tr>
                <Th>Foreground</Th>
                <Th>Background</Th>
                <Th>Ratio</Th>
              </tr>
            </thead>
            <tbody>
              {PAIRS.map(([fg, bg]) => (
                <tr key={`${fg}-${bg}`}>
                  <Td>{fg}</Td>
                  <Td>{bg}</Td>
                  <Td className="type-code">
                    {contrast(colour[fg], colour[bg])}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="type-section">Actions</h2>
        <p className="type-body mt-3 text-ink-muted">
          Solid primary, outlined secondary, clear text action. Hover lifts by
          one pixel, focus shows the ring, pressed drops by one pixel, disabled
          halves opacity and blocks the pointer.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary action</Button>
          <Button variant="quiet">Quiet action</Button>
          <Button disabled>Disabled</Button>
          <Button size="lg">Large primary</Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <ButtonLink href="/">Primary link</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Secondary link
          </ButtonLink>
          <ButtonLink href="/" variant="quiet">
            Quiet link
          </ButtonLink>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="type-section">Text link</h2>
        <p className="type-body mt-4">
          Links inside copy are always underlined —{' '}
          <TextLink href="/">like this one</TextLink> — so the affordance never
          depends on colour.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="type-section">Rule</h2>
        <Rule className="mt-4" />
      </section>

      <section className="mt-16">
        <h2 className="type-section">Form fields</h2>
        <p className="type-body mt-3 text-ink-muted">
          Idle, with hint, invalid, and disabled. Errors are text with an
          explicit prefix plus a heavier border — never colour alone.
        </p>
        <div className="mt-6 flex form-block flex-col gap-6">
          <TextField
            id="sg-name"
            label="Example name"
            hint="As it should appear in correspondence."
            autoComplete="name"
          />
          <TextField
            id="sg-email"
            label="Example email"
            type="email"
            error="Example validation message."
            autoComplete="email"
          />
          <TextField id="sg-disabled" label="Disabled field" disabled />
          <TextAreaField id="sg-message" label="Message" rows={4} />
          <Notice kind="success" role="status">
            Received. This is what a successful submission looks like.
          </Notice>
          <Notice kind="error" role="alert">
            Error — this is what a form-level failure looks like.
          </Notice>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="type-section">Index table</h2>
        <div className="mt-4">
          <Table caption="Example index — generic placeholder rows">
            <thead>
              <tr>
                <Th>Nº</Th>
                <Th>Entry</Th>
                <Th>Kind</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              <IndexRow index="01">
                <Td>First example entry</Td>
                <Td>Example kind</Td>
                <Td>
                  <StatusBadge>Label</StatusBadge>
                </Td>
              </IndexRow>
              <IndexRow index="02">
                <Td>Second example entry</Td>
                <Td>Example kind</Td>
                <Td>
                  <StatusBadge>Label</StatusBadge>
                </Td>
              </IndexRow>
            </tbody>
          </Table>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="type-section">Callout · Figure · Code</h2>
        <Callout label="Worth knowing">
          A callout is a sky-mist well with a supporting label. It carries
          asides and caveats inside long-form content.
        </Callout>
        <Figure
          caption="A captioned figure slot — diagrams and images render here."
          className="mt-6"
        >
          <div className="well h-32" aria-hidden="true" />
        </Figure>
        <div className="mt-6">
          <CodeBlock
            code="npm install example-package"
            label="Example install command"
          />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="type-section">Night surface</h2>
        <section
          data-surface="night"
          className="surface-night mt-4 rounded-panel p-6 md:p-8"
          aria-label="Night surface context"
        >
          <p className="type-kicker text-inverse-muted">Inverse surface</p>
          <p className="type-body mt-2">
            Text on night uses the inverse token; supporting text uses
            inverse-muted; the focus ring switches to honey; the primary action
            becomes the honey brand moment.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Button>Primary on night</Button>
            <Button variant="secondary">Secondary on night</Button>
            <Button variant="quiet">Quiet on night</Button>
          </div>
          <div className="panel-night mt-6 p-4">
            <p className="type-caption text-inverse-muted">
              A raised panel on night (night-panel), used by the code block and
              the developer directory.
            </p>
          </div>
        </section>
      </section>

      <section className="mt-16">
        <h2 className="type-section">Motion</h2>
        <ul className="type-body mt-4 list-disc pl-5">
          <li className="mt-1.5">
            Controls use clear focus states, underlines and restrained hover
            movement.
          </li>
          <li className="mt-1.5">
            The homepage sculpture separates and reconnects through three scroll
            chapters. Inner-page studies unfold with a native disclosure and use
            a shared 3D camera.
          </li>
          <li className="mt-1.5">
            The homepage pause control stops its motion. GPU work settles to
            idle and suspends in hidden tabs or offscreen scenes. Reduced motion
            uses static visuals.
          </li>
        </ul>
      </section>

      {!process.env.VERCEL && (
        <section id="contact-form-preview" className="mt-16">
          <h2 className="type-section">Contact form preview</h2>
          <p className="type-caption mt-2 mb-6 text-ink-muted">
            Local component preview. Use fictional details; no message is
            delivered without a configured API.
          </p>
          <ContactForm permalink="/styleguide" />
        </section>
      )}
      <section className="mt-16">
        <h2 className="type-section">MDX pipeline fixture</h2>
        <p className="type-caption mt-2 text-ink-muted">
          Build fixture proving the MDX pipeline compiles. Not site content.
        </p>
        <section aria-label="MDX pipeline fixture render" className="mt-4">
          <Fixture />
        </section>
      </section>
    </div>
  )
}
