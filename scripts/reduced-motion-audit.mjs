#!/usr/bin/env node
/*
 * Reduced-motion toggle audit (07a acceptance 6; reusable for 07b–d/09a/10a).
 * For every route: emulate BOTH prefers-reduced-motion states and assert
 *   - reduce: computed transition-duration is 0s on interactive samples and no
 *     animations are running (the token block zeroes durations; the global cap
 *     force-instants the rest);
 *   - no-preference: the Level-1 tokens apply (0.12s micro on the primary action,
 *     hover-capable emulation).
 * Usage (server on :3100; routes WITHOUT leading slash, "home" = /):
 *   node scripts/reduced-motion-audit.mjs home products ...
 */
import { chromium } from '@playwright/test'

const routes = process.argv
  .slice(2)
  .map((p) => (p === 'home' ? '/' : '/' + p.replace(/^\/+/, '')))
if (routes.length === 0) {
  console.error('usage: node scripts/reduced-motion-audit.mjs <route> [...]')
  process.exit(2)
}

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
})
const page = await context.newPage()
let failures = 0

const probe = () => {
  const pick = (selector) => document.querySelector(selector)
  const durationOf = (el) =>
    el ? getComputedStyle(el).transitionDuration : null
  return {
    btn: durationOf(pick('.btn-primary')),
    link: durationOf(
      pick('a.underline') ?? pick('a[class~="hover:underline"]'),
    ),
    runningAnimations: document.getAnimations
      ? document
          .getAnimations()
          .filter(
            (a) =>
              a.playState === 'running' &&
              a.effect &&
              (a.effect.getTiming().duration ?? 0) > 50,
          ).length
      : -1,
  }
}

// A duration is "instant" when it is 0s or under the 1ms cap (the global reduce
// block sets 0.01ms = computed 1e-05s — that IS the neutralised state).
const instant = (value) => parseFloat(value) < 0.001

for (const route of routes) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(
    (process.env.SANDBEE_PREVIEW_URL || 'http://localhost:3100') + route,
    { waitUntil: 'load' },
  )
  const reduced = await page.evaluate(probe)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(
    (process.env.SANDBEE_PREVIEW_URL || 'http://localhost:3100') + route,
    { waitUntil: 'load' },
  )
  const full = await page.evaluate(probe)
  const problems = []
  // Under reduce every sampled transition must be instant.
  for (const [key, value] of Object.entries({
    btn: reduced.btn,
    link: reduced.link,
  })) {
    if (value !== null && !instant(value.split(',')[0].trim())) {
      problems.push(`reduce: ${key} transition-duration=${value}`)
    }
  }
  if (reduced.runningAnimations > 0) {
    problems.push(`reduce: ${reduced.runningAnimations} running animation(s)`)
  }
  // Under no-preference the micro token applies where the sample exists.
  if (full.btn !== null && !full.btn.split(',')[0].includes('0.12s')) {
    problems.push(`no-preference: btn duration=${full.btn} (want 0.12s)`)
  }
  const status = problems.length ? 'FAIL' : 'ok'
  if (problems.length) failures++
  console.log(
    `${status} ${route.padEnd(40)} reduce(btn=${reduced.btn} link=${reduced.link} anims=${reduced.runningAnimations}) full(btn=${full.btn})`,
  )
  for (const problem of problems) console.log('      ' + problem)
}
await browser.close()
console.log(
  failures
    ? `REDUCED-MOTION FAIL: ${failures}`
    : `REDUCED-MOTION OK: ${routes.length} routes, both states`,
)
process.exit(failures ? 1 : 0)
