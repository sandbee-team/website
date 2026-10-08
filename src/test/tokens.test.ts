import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/*
 * Token-trace guard (ADR-0004 graft 7, re-encoded by ADR-0018). Parses
 * src/app/globals.css and pins every colour token to the live record
 * (docs/research/2026-09-28-daylight-glass.md) via the record's computed
 * contrast table. Deliberately contains NO hex literals: a drifted token value breaks
 * its recorded ratio, and the "zero raw hex outside globals.css" grep stays clean.
 */

const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8')

function token(name: string): string {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`))
  if (!match) throw new Error(`token --color-${name} not found in globals.css`)
  return match[1]
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

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/* Pairs from the record's computed table (2026-09-28, WCAG 2.x), with their role. */
const recordedPairs: Array<{
  fg: string
  bg: string
  recorded: number
  minimum: number
  role: string
}> = [
  { fg: 'ink', bg: 'canvas', recorded: 14.64, minimum: 4.5, role: 'body text' },
  {
    fg: 'ink',
    bg: 'surface',
    recorded: 15.16,
    minimum: 4.5,
    role: 'text on panels',
  },
  {
    fg: 'ink',
    bg: 'sky-mist',
    recorded: 13.37,
    minimum: 4.5,
    role: 'text on wells',
  },
  {
    fg: 'ink',
    bg: 'sky',
    recorded: 13.59,
    minimum: 4.5,
    role: 'hero text on the sky',
  },
  {
    fg: 'ink-muted',
    bg: 'canvas',
    recorded: 6.05,
    minimum: 4.5,
    role: 'supporting text',
  },
  {
    fg: 'ink-muted',
    bg: 'surface',
    recorded: 6.27,
    minimum: 4.5,
    role: 'supporting text on panels',
  },
  {
    fg: 'ink-muted',
    bg: 'sky-mist',
    recorded: 5.53,
    minimum: 4.5,
    role: 'supporting text on wells',
  },
  {
    fg: 'primary',
    bg: 'canvas',
    recorded: 6.43,
    minimum: 4.5,
    role: 'primary as text/active state',
  },
  {
    fg: 'surface',
    bg: 'primary',
    recorded: 6.65,
    minimum: 4.5,
    role: 'primary action label',
  },
  {
    fg: 'primary',
    bg: 'sky',
    recorded: 5.97,
    minimum: 3,
    role: 'primary action boundary on the sky',
  },
  {
    fg: 'honey-ink',
    bg: 'canvas',
    recorded: 7.46,
    minimum: 4.5,
    role: 'accent text on canvas',
  },
  {
    fg: 'honey-ink',
    bg: 'sky-mist',
    recorded: 6.81,
    minimum: 4.5,
    role: 'accent text on wells',
  },
  {
    fg: 'honey',
    bg: 'night',
    recorded: 9.3,
    minimum: 4.5,
    role: 'accent on night (text + CTA)',
  },
  {
    fg: 'night',
    bg: 'honey',
    recorded: 9.3,
    minimum: 4.5,
    role: 'night label on the honey CTA',
  },
  {
    fg: 'inverse',
    bg: 'night',
    recorded: 14.67,
    minimum: 4.5,
    role: 'text on night',
  },
  {
    fg: 'inverse-muted',
    bg: 'night',
    recorded: 9.55,
    minimum: 4.5,
    role: 'supporting text on night',
  },
  {
    fg: 'honey',
    bg: 'night-panel',
    recorded: 6.26,
    minimum: 4.5,
    role: 'accent on a raised night panel',
  },
  {
    fg: 'line-strong',
    bg: 'canvas',
    recorded: 3.33,
    minimum: 3,
    role: 'interactive boundary',
  },
  {
    fg: 'honey-dark',
    bg: 'sky',
    recorded: 8.87,
    minimum: 4.5,
    role: 'wordmark ink pass on the sky header',
  },
  {
    fg: 'honey-dark',
    bg: 'canvas',
    recorded: 9.56,
    minimum: 4.5,
    role: 'wordmark ink pass on canvas',
  },
  {
    fg: 'error',
    bg: 'canvas',
    recorded: 7.27,
    minimum: 4.5,
    role: 'form error text',
  },
  {
    fg: 'success',
    bg: 'canvas',
    recorded: 6.57,
    minimum: 4.5,
    role: 'form success text',
  },
]

describe('colour tokens trace to the live record', () => {
  it.each(recordedPairs)(
    '$fg on $bg matches the recorded $recorded:1 and meets $minimum:1 ($role)',
    ({ fg, bg, recorded, minimum }) => {
      const ratio = contrast(token(fg), token(bg))
      expect(Math.abs(ratio - recorded)).toBeLessThanOrEqual(0.05)
      expect(ratio).toBeGreaterThanOrEqual(minimum)
    },
  )

  it('keeps the pale accent restricted to fills on light surfaces', () => {
    expect(contrast(token('honey'), token('canvas'))).toBeLessThan(3)
  })

  it('defines exactly the recorded hex-valued colour tokens (aliases reference them)', () => {
    const names = [...css.matchAll(/--color-([a-z-]+):\s*#/g)].map((m) => m[1])
    expect(names.sort()).toEqual(
      [
        'canvas',
        'surface',
        'sky',
        'sky-mist',
        'ink',
        'ink-muted',
        'primary',
        'primary-hover',
        'honey',
        'honey-ink',
        'honey-dark',
        'line',
        'line-strong',
        'night',
        'night-panel',
        'inverse',
        'inverse-muted',
        'warm',
        'signal',
        'mint',
        'blue-soft',
        'error',
        'success',
        'sculpture-coral',
        'sculpture-citron',
        'sculpture-plum',
        'sculpture-shadow',
      ].sort(),
    )
  })
})

describe('shape tokens follow the plan §5 policy', () => {
  it('keeps UI radii stable and names the two decorative glass radii', () => {
    const radii = [...css.matchAll(/--radius-([a-z-]+):\s*([^;]+);/g)].map(
      (m) => [m[1], m[2].trim()],
    )
    expect(radii).toEqual([
      ['control', '8px'],
      ['panel', '16px'],
      ['pill', '9999px'],
      ['glass', '58px'],
      ['inset', '52px'],
    ])
  })

  it('defines deliberate menu and product preview elevation', () => {
    const shadows = [...css.matchAll(/--shadow-([a-z-]+):\s*[^;]+;/g)].map(
      (m) => m[1],
    )
    expect(shadows.sort()).toEqual(['menu', 'product'])
  })
})

describe('font files match the live typography record', () => {
  it('public/fonts holds exactly the two served woff2 files plus their licences', () => {
    const files = readdirSync(join(process.cwd(), 'public/fonts'))
      .filter((f) => f.endsWith('.woff2'))
      .sort()
    expect(files).toEqual([
      'barlow-condensed-600.woff2',
      'instrument-serif-400.woff2',
      'manrope-var.woff2',
    ])
    const licences = readdirSync(
      join(process.cwd(), 'public/fonts/LICENSES'),
    ).sort()
    expect(licences).toEqual([
      'barlow-condensed-OFL.txt',
      'instrument-serif-OFL.txt',
      'manrope-OFL.txt',
    ])
  })
})
