import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import TechnologyOfferingPage from '@/app/(marketing)/technology/[technology]/page'

const renderPackage = async (technology: string) =>
  render(
    await TechnologyOfferingPage({
      params: Promise.resolve({ technology }),
      searchParams: Promise.resolve({}),
    }),
  )

/*
 * Contract-fidelity checks against the 05b decks (.memory/content/technology-*.md).
 * Expected strings copy-pasted from the decks + grep-verified (06c validation).
 */
describe('package pages (RTL, contract fidelity)', () => {
  it('electron-tracking: first screen carries the open-list hedge + origin verbatim', async () => {
    await renderPackage('electron-tracking')
    expect(screen.getAllByRole('heading', { level: 1 })[0].textContent).toBe(
      'Electron tracking',
    )
    expect(
      screen.getByText(
        'A complete desktop tracking technology covering areas such as keyboard, mouse, application and web tracking, with cross-operating-system/native components.',
      ),
    ).toBeDefined()
    expect(
      screen.getByText(
        /Existing solutions handled keyboard\/mouse functionality but did not provide the required application and web tracking functionality, so Sandbee built the missing native\/cross-platform components manually\./,
      ),
    ).toBeDefined()
    expect(
      screen.getByText(
        'The resulting technology is intended to become a reusable package/service for other developers who need similar functionality.',
      ),
    ).toBeDefined()
    expect(
      screen
        .getByRole('link', { name: 'Read the origin story' })
        .getAttribute('href'),
    ).toBe('/stories/electron-tracking-origin')
  })

  it('OCR states local execution, supported runtime, licensing and separate hosted demo', async () => {
    await renderPackage('aadhaar-pan-ocr')
    expect(screen.getAllByRole('heading', { level: 1 })[0].textContent).toBe(
      'Extract the text. Keep the document.',
    )
    expect(
      screen.getByText(
        'Install the Sandbee OCR package in your Node.js backend. Extract document data locally, with access managed through your Sandbee key.',
      ),
    ).toBeDefined()
    expect(
      screen.getByText(
        /Node.js 22 or newer on Windows x64 or Linux x64 with glibc/,
      ),
    ).toBeDefined()
    expect(
      screen.getByText(
        /hosted Store demo is separate and processes files you explicitly upload/,
      ),
    ).toBeDefined()
    expect(
      screen.getByText(/startup verification and periodic access renewal/),
    ).toBeDefined()
    for (const link of screen.getAllByRole('link', { name: /Get the package/ }))
      expect(link.getAttribute('href')).toBe(
        'https://store.sandbee.in/developers',
      )
  })

  it('face-scan-mobile: setup framing verbatim, honest platform answer', async () => {
    await renderPackage('face-scan-mobile')
    expect(screen.getAllByRole('heading', { level: 1 })[0].textContent).toBe(
      'Face scan/mobile setup',
    )
    expect(
      screen.getByText(
        'A more complete mobile face-scan setup intended to provide the required technology stack/setup rather than forcing another team to build the entire capability from scratch.',
      ),
    ).toBeDefined()
    expect(
      screen.getByText(
        'Platform targets are discussed per engagement — no public platform list exists, and we will not invent one.',
      ),
    ).toBeDefined()
  })

  it('every package page: Q20 minimum-credible variant + JSON-LD clean', async () => {
    for (const technology of [
      'electron-tracking',
      'aadhaar-pan-ocr',
      'face-scan-mobile',
    ]) {
      const { container, unmount } = await renderPackage(technology)
      if (technology !== 'aadhaar-pan-ocr') {
        // Q20: no snippet, no docs/changelog links; honest docs FAQ answer instead.
        expect(container.querySelector('pre, code')).toBeNull()
        expect(
          Array.from(container.querySelectorAll('a')).some((a) =>
            /docs|documentation|changelog|status page/i.test(
              a.textContent ?? '',
            ),
          ),
        ).toBe(false)
        expect(container.textContent).toContain(
          'Not yet public. Ask for access and current integration material through the contact page.',
        )
        // Access-model block: source code is not delivered (§3.3/§4).
        expect(container.textContent).toContain(
          'Customers do not receive Sandbee’s source code.',
        )
        // CTA matches the access model.
        const cta = Array.from(container.querySelectorAll('a')).find(
          (a) => a.textContent === 'Request access',
        )
        expect(cta?.getAttribute('href')).toBe('/contact')
        // No status badge, no prices.
        expect(container.querySelector('.status-badge')).toBeNull()
        expect(container.textContent).not.toMatch(/₹|\$\s?\d|INR|USD/)
      }
      // JSON-LD: BreadcrumbList + SoftwareApplication, never offers/aggregateRating.
      const scripts = Array.from(
        container.querySelectorAll('script[type="application/ld+json"]'),
      ).map((node) => node.innerHTML)
      expect(scripts.length).toBe(2)
      const parsed = scripts.map((raw) => JSON.parse(raw))
      const types = parsed.map((data) => data['@type'])
      expect(types).toContain('BreadcrumbList')
      expect(types).toContain('SoftwareApplication')
      for (const raw of scripts) {
        expect(raw).not.toContain('offers')
        expect(raw).not.toContain('aggregateRating')
      }
      // The structured-data description must be a claim the page itself makes
      // visibly (06c qa finding: the drifted oneLiner contradicted the first screen).
      const app = parsed.find((data) => data['@type'] === 'SoftwareApplication')
      expect(container.textContent).toContain(app.description)
      unmount()
    }
  })
})
