/*
 * SEO/discoverability audit (phase-08, standing tool). Crawls the LOCAL prod server
 * exactly as a crawler sees it (JS disabled) and reports, per page: status, title,
 * meta description, canonical, robots meta, Open Graph/Twitter tags, H1–H3 outline,
 * parsed JSON-LD types + forbidden-key check, breadcrumb presence, and the internal
 * link graph (dead links, orphans vs the sitemap, weak anchor text).
 *
 * Usage (server must already be running on :3100 — check for orphans first):
 *   node scripts/seo-audit.mjs [outFile.json]
 * Exit code 1 when any hard check fails; the JSON report carries the details.
 */
import { writeFileSync } from 'node:fs'

import { chromium } from 'playwright'

const BASE = process.env.SANDBEE_PREVIEW_URL || 'http://localhost:3100'
const WEAK_ANCHORS = new Set([
  'click here',
  'here',
  'learn more',
  'read more',
  'more',
  'link',
])
const FORBIDDEN_LD_KEYS = ['offers', 'aggregateRating']

const outFile = process.argv[2]

async function main() {
  const sitemapRes = await fetch(`${BASE}/sitemap.xml`)
  const sitemapXml = await sitemapRes.text()
  const sitemapPaths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname,
  )

  const browser = await chromium.launch()
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()

  const queue = ['/']
  const seen = new Set(queue)
  const pages = new Map()
  const deadLinks = []
  const weakAnchors = []

  while (queue.length > 0) {
    const path = queue.shift()
    const response = await page.goto(BASE + path, { waitUntil: 'load' })
    const status = response?.status() ?? 0
    if (status >= 400) {
      pages.set(path, { status })
      continue
    }
    const facts = await page.evaluate(() => {
      const meta = (name, attr = 'name') =>
        document.querySelector(`meta[${attr}='${name}']`)?.content ?? null
      const lds = Array.from(
        document.querySelectorAll("script[type='application/ld+json']"),
      ).map((el) => el.textContent ?? '')
      const anchors = Array.from(document.querySelectorAll('a[href]')).map(
        (a) => ({
          href: a.getAttribute('href') ?? '',
          text: (a.textContent ?? '').trim().toLowerCase(),
          label: a.getAttribute('aria-label') ?? '',
        }),
      )
      return {
        title: document.title,
        description: meta('description'),
        robots: meta('robots'),
        canonical:
          document.querySelector("link[rel='canonical']")?.href ?? null,
        ogTitle: meta('og:title', 'property'),
        ogDescription: meta('og:description', 'property'),
        ogImage: meta('og:image', 'property'),
        ogType: meta('og:type', 'property'),
        ogUrl: meta('og:url', 'property'),
        twitterImage: meta('twitter:image'),
        h1: Array.from(document.querySelectorAll('h1')).map((h) =>
          (h.textContent ?? '').trim(),
        ),
        h2: Array.from(document.querySelectorAll('h2')).map((h) =>
          (h.textContent ?? '').trim(),
        ),
        lds,
        anchors,
      }
    })
    const ldParsed = []
    for (const raw of facts.lds) {
      try {
        const json = JSON.parse(raw)
        const types = [json]
          .flat()
          .map((node) => node['@type'])
          .flat()
        const forbidden = FORBIDDEN_LD_KEYS.filter((key) => raw.includes(key))
        ldParsed.push({ types, forbidden, ok: forbidden.length === 0 })
      } catch {
        ldParsed.push({ types: [], forbidden: [], ok: false, parseError: true })
      }
    }
    const internal = facts.anchors.filter(
      (a) =>
        a.href.startsWith('/') &&
        !a.href.startsWith('//') &&
        !a.href.includes('.xml') &&
        !a.href.includes('#'),
    )
    for (const a of internal) {
      const target = a.href.split('?')[0]
      if (!seen.has(target)) {
        seen.add(target)
        queue.push(target)
      }
      if (WEAK_ANCHORS.has(a.text) && !a.label) {
        weakAnchors.push({ page: path, href: a.href, text: a.text })
      }
    }
    pages.set(path, {
      status,
      ...facts,
      lds: undefined,
      anchors: undefined,
      ldParsed,
      internalLinks: internal.map((a) => a.href.split('?')[0]),
    })
  }

  // Dead-link check: every discovered target got fetched above; collect failures.
  for (const [path, data] of pages) {
    if (data.status >= 400) {
      deadLinks.push({ target: path, status: data.status })
    }
  }

  const crawled = new Set(
    [...pages.entries()].filter(([, d]) => d.status < 400).map(([p]) => p),
  )
  const orphans = sitemapPaths.filter((p) => !crawled.has(p))
  const sitemapNoindex = sitemapPaths.filter((p) =>
    pages.get(p)?.robots?.includes('noindex'),
  )

  const report = {
    generated: new Date().toISOString(),
    sitemapPaths,
    pageCount: pages.size,
    pages: Object.fromEntries(pages),
    deadLinks,
    orphans,
    sitemapNoindex,
    weakAnchors,
  }
  if (outFile) writeFileSync(outFile, JSON.stringify(report, null, 2))

  let failed = false
  const fail = (label, items) => {
    if (items.length > 0) {
      failed = true
      console.log(`FAIL ${label}:`, JSON.stringify(items))
    } else {
      console.log(`ok   ${label}`)
    }
  }
  fail('dead internal links', deadLinks)
  fail('sitemap orphans (not reachable by crawl)', orphans)
  fail('sitemap URLs carrying noindex', sitemapNoindex)
  fail('weak anchor texts', weakAnchors)
  const ldProblems = [...pages.entries()].flatMap(([p, d]) =>
    (d.ldParsed ?? []).filter((ld) => !ld.ok).map((ld) => ({ page: p, ...ld })),
  )
  fail('JSON-LD parse/forbidden-key problems', ldProblems)
  const canonicalProblems = [...pages.entries()]
    .filter(
      ([p, d]) =>
        d.status < 400 &&
        !d.robots?.includes('noindex') &&
        d.canonical !== null &&
        new URL(d.canonical).pathname !== p,
    )
    .map(([p, d]) => ({ page: p, canonical: d.canonical }))
  fail('canonical/path mismatches (indexable pages)', canonicalProblems)
  const h1Problems = [...pages.entries()]
    .filter(([, d]) => d.status < 400 && (d.h1 ?? []).length !== 1)
    .map(([p, d]) => ({ page: p, h1Count: (d.h1 ?? []).length }))
  fail('pages without exactly one h1', h1Problems)
  // Length bounds (08 qa finding 2: the /company description shipped at 174 chars
  // against a hand-typed "(158)" annotation and nothing checked it). Description
  // 50–160 chars, title ≤65 — display-budget guidelines, enforced as hard bounds so
  // annotation drift can never ship silently again.
  const lengthProblems = [...pages.entries()]
    .filter(([, d]) => d.status < 400)
    .flatMap(([p, d]) => {
      const problems = []
      const descLen = d.description ? Array.from(d.description).length : 0
      const titleLen = d.title ? Array.from(d.title).length : 0
      if (descLen < 50 || descLen > 160)
        problems.push({ page: p, field: 'description', length: descLen })
      if (titleLen > 65)
        problems.push({ page: p, field: 'title', length: titleLen })
      return problems
    })
  fail(
    'title/description length bounds (desc 50–160, title ≤65)',
    lengthProblems,
  )
  const ogProblems = [...pages.entries()]
    .filter(
      ([, d]) =>
        d.status < 400 &&
        (!d.ogImage ||
          !d.ogImage.startsWith('http') ||
          !d.twitterImage ||
          !d.description),
    )
    .map(([p]) => p)
  fail('pages missing og:image/twitter:image/description', ogProblems)

  console.log(
    `crawled ${pages.size} pages; sitemap lists ${sitemapPaths.length}; ` +
      `indexable (crawled, no noindex): ${
        [...pages.entries()].filter(
          ([, d]) => d.status < 400 && !d.robots?.includes('noindex'),
        ).length
      }`,
  )
  await browser.close()
  process.exit(failed ? 1 : 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
