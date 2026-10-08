import { describe, expect, it } from 'vitest'

import { getLaunchRoutes } from './routes'
import { getPosts } from '@/lib/content'

// The acceptance diff (04b A5): registry == the ADR-0005 launch list. Deliberate
// exclusions (documented in routes.ts): /styleguide (internal), /privacy + /terms
// (never advertised while placeholder — Q8), /blog/[slug] (deferred, ADR-0011 §7).
describe('launch route registry', () => {
  it('matches the ADR-0005 launch list exactly', async () => {
    const routes = await getLaunchRoutes()
    expect(routes.map((r) => r.path).sort()).toEqual(
      [
        '/',
        '/products',
        '/products/pos',
        '/packages',
        '/pricing',
        '/services',
        '/services/gst-api',
        '/services/whatsapp-sms-automation',
        '/services/instagram-automation',
        '/services/desktop-notification',
        '/technology',
        '/technology/electron-tracking',
        '/technology/aadhaar-pan-ocr',
        '/technology/face-scan-mobile',
        '/custom-technology',
        '/company',
        '/stories',
        '/stories/electron-tracking-origin',
        '/blog',
        '/blog/customer-hosted-ocr-integration',
        '/blog/hosted-api-or-installed-sdk',
        '/blog/pos-deployment-handover-checklist',
        // /blog re-enters with the first real post (06f F14: thin while zero
        // posts -> noindex + out of the sitemap; the 06e first-post checklist
        // flips it back).
        '/contact',
      ].sort(),
    )
  })

  it('sets lastModified only where a real content date exists', async () => {
    const routes = await getLaunchRoutes()
    const dated = routes.filter((r) => r.lastModified)
    expect(dated).toEqual([
      { path: '/stories/electron-tracking-origin', lastModified: '2026-09-01' },
      ...(await getPosts()).map((post) => ({
        path: `/blog/${post.slug}`,
        lastModified: post.updatedAt ?? post.publishedAt,
      })),
    ])
  })

  it('excludes draft, internal, unapproved policy and markdown alternate URLs', async () => {
    const paths = (await getLaunchRoutes()).map((route) => route.path)
    for (const path of [
      '/styleguide',
      '/privacy',
      '/terms',
      '/blog/loader-fixture',
    ])
      expect(paths).not.toContain(path)
    expect(paths.some((path) => path.endsWith('.md'))).toBe(false)
    expect(new Set(paths).size).toBe(paths.length)
  })
})
