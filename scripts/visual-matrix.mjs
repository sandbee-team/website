#!/usr/bin/env node
/*
 * Visual/responsive matrix (visual-qa skill, added 06b): device emulation (viewport
 * set on the context, not window-resize — mistake 2026-08-31-viewport-resize), an
 * innerWidth probe per tier, horizontal-overflow check, console/network error counts,
 * honey census from the RENDER (honey groups intersecting the initial viewport must be
 * <= 2 — approved colour record budget), and full-page screenshots.
 *
 * Usage (server must already be running on :3100 — check for orphans first). Pass
 * routes WITHOUT the leading slash (Git Bash/MSYS rewrites /foo into a Windows path):
 *   node scripts/visual-matrix.mjs <outDirUnderSpecimens> <route> [<route> ...]
 * Example:
 *   node scripts/visual-matrix.mjs 2026-09-01-06b-portfolio products products/pos home
 * ("home" = the root route.)
 */
import { mkdirSync } from 'node:fs'

import { chromium } from '@playwright/test'

const [outName, ...rawPages] = process.argv.slice(2)
const pages = rawPages.map((p) =>
  p === 'home' ? '/' : '/' + p.replace(/^\/+/, ''),
)
if (!outName || pages.length === 0) {
  console.error(
    'usage: node scripts/visual-matrix.mjs <outDirUnderSpecimens> <route-without-leading-slash> [...]',
  )
  process.exit(2)
}
const OUT = `.memory/visual-direction/specimens/${outName}`
mkdirSync(OUT, { recursive: true })

const TIERS = [
  { name: '320', width: 320, height: 700 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
]

const browser = await chromium.launch()
let failures = 0
for (const tier of TIERS) {
  const context = await browser.newContext({
    viewport: { width: tier.width, height: tier.height },
    deviceScaleFactor: 1,
    isMobile: tier.width < 768,
    hasTouch: tier.width < 768,
  })
  for (const path of pages) {
    const page = await context.newPage()
    const errors = []
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    page.on('requestfailed', (r) => errors.push('reqfail ' + r.url()))
    page.on(
      'response',
      (r) =>
        r.status() >= 400 && errors.push('HTTP ' + r.status() + ' ' + r.url()),
    )
    await page.goto(
      (process.env.SANDBEE_PREVIEW_URL || 'http://localhost:3100') + path,
      {
        waitUntil: 'networkidle',
      },
    )
    const probe = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    const honey = await page.evaluate(() => {
      // Census: a honey GROUP = an svg containing honey-classed marks (one diagram
      // moment), a bare honey element (a rule), a night-surface primary button, or —
      // counted ONCE per page — the bees (brand detail, one atmospheric group per the
      // 2026-09-11 record). Slide a viewport-height window down the FULL page
      // (half-viewport steps) and report the MAX groups co-visible.
      const groups = []
      const seen = new Set()
      for (const el of document.querySelectorAll(
        '.fill-honey-ink, .stroke-honey-ink, .fill-honey, .stroke-honey, .bg-honey, .text-honey',
      )) {
        const group = el.closest('svg') ?? el
        if (seen.has(group)) continue
        seen.add(group)
        const rect = group.getBoundingClientRect()
        groups.push([rect.top + window.scrollY, rect.bottom + window.scrollY])
      }
      for (const el of document.querySelectorAll(
        '[data-surface="night"] .btn-primary',
      )) {
        const rect = el.getBoundingClientRect()
        groups.push([rect.top + window.scrollY, rect.bottom + window.scrollY])
      }
      const bees = Array.from(document.querySelectorAll('[data-bee]'))
      if (bees.length > 0) {
        const tops = bees.map(
          (b) => b.getBoundingClientRect().top + window.scrollY,
        )
        const bottoms = bees.map(
          (b) => b.getBoundingClientRect().bottom + window.scrollY,
        )
        groups.push([Math.min(...tops), Math.max(...bottoms)])
      }
      const docHeight = document.documentElement.scrollHeight
      const vh = window.innerHeight
      let max = 0
      for (let top = 0; top <= docHeight - 1; top += vh / 2) {
        const bottom = top + vh
        const visible = groups.filter(([g0, g1]) => g0 < bottom && g1 > top)
        if (visible.length > max) max = visible.length
      }
      return max
    })
    // SVG label legibility (06b qa finding): CSS font-size on SVG <text> scales
    // with the viewBox transform — screenshots alone hid 4-5px labels. Probe the
    // real rendered height of every SVG text node; floor 9.5px (12px label with
    // rounding headroom).
    const minSvgText = await page.evaluate(() => {
      let min = Infinity
      for (const el of document.querySelectorAll('svg text')) {
        const h = el.getBoundingClientRect().height
        if (h > 0 && h < min) min = h
      }
      return min === Infinity ? null : Math.round(min * 10) / 10
    })
    const problems = []
    if (probe.innerWidth !== tier.width)
      problems.push(`innerWidth ${probe.innerWidth} != ${tier.width}`)
    if (minSvgText !== null && minSvgText < 9.5)
      problems.push(`svg label ${minSvgText}px < 9.5px floor`)
    if (probe.scrollWidth > probe.clientWidth)
      problems.push(
        `H-OVERFLOW scrollWidth ${probe.scrollWidth} > clientWidth ${probe.clientWidth}`,
      )
    if (errors.length) problems.push(`console/network: ${errors.join(' | ')}`)
    if (honey > 2)
      problems.push(`honey census ${honey} > 2 in initial viewport`)
    const slug = path === '/' ? 'home' : path.slice(1).replace(/\//g, '-')
    await page.screenshot({
      path: `${OUT}/${slug}-${tier.name}.png`,
      fullPage: true,
    })
    const status = problems.length ? 'FAIL' : 'ok'
    if (problems.length) failures++
    console.log(
      `${status} ${tier.name.padStart(4)} ${path.padEnd(40)} honey@top=${honey} svgText>=${minSvgText ?? '-'} ${problems.join('; ')}`,
    )
    await page.close()
  }
  await context.close()
}
await browser.close()
console.log(
  failures
    ? `MATRIX FAIL: ${failures}`
    : `MATRIX OK: ${pages.length} pages x ${TIERS.length} tiers clean`,
)
process.exit(failures ? 1 : 0)
