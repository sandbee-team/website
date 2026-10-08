import type { ReactNode } from 'react'

import { TextLink } from '@/components/primitives'
import { catalogProduct } from '@/content/catalog'

/*
 * Deck-verbatim copy for the three package pages, keyed by offering id. Source of
 * truth: .memory/content/technology-*.md (05b contracts, amended 2026-09-01) — strings
 * copy-pasted from the decks and grep-verified by the fidelity tests. Q20 default:
 * graft-5 first screen WITHOUT the snippet element (ADR-0005 minimum-credible
 * variant); maturity stated in reference prose, never an invented label chip. Hedges
 * ("may", "depending on the package", "intended", "covering areas such as", "such as")
 * are load-bearing — never compress them away.
 */
export interface PackageCopy {
  /** Contract title (the layout template appends "— Sandbee"). */
  title: string
  description: string
  /** Graft-5 first screen minus snippet: concrete nouns · access · billing type. */
  firstScreen: { nouns: string; access: string; billing: string }
  sections: Array<{ heading: string; body: ReactNode }>
  faq: Array<{ question: string; answer: string }>
}

const ocr = catalogProduct('ocr')

export const PACKAGE_COPY: Record<string, PackageCopy> = {
  'electron-tracking': {
    title: 'Electron desktop tracking package',
    description:
      'A desktop tracking technology covering areas such as keyboard, mouse, application and web tracking — intended to become a reusable package for developers.',
    firstScreen: {
      nouns:
        'A complete desktop tracking technology covering areas such as keyboard, mouse, application and web tracking, with cross-operating-system/native components.',
      access:
        'Intended delivery is a build/distributable package with controlled access. Discuss current scope and availability for your integration.',
      billing: 'Commercial direction: a package-specific model.',
    },
    sections: [
      {
        heading: 'The problem it solves',
        body: (
          <>
            <p className="type-body mt-3">
              This technology originated from a real client requirement.
              Existing solutions handled keyboard/mouse functionality but did
              not provide the required application and web tracking
              functionality, so Sandbee built the missing native/cross-platform
              components manually.
            </p>
            <p className="type-body mt-4">
              <TextLink href="/stories/electron-tracking-origin">
                Read the origin story
              </TextLink>
            </p>
          </>
        ),
      },
      {
        heading: 'What it covers',
        body: (
          <>
            <p className="type-body mt-3">
              Covering areas such as: keyboard tracking · mouse tracking ·
              application tracking · web tracking ·
              cross-operating-system/native components.
            </p>
            <p className="type-body mt-4 text-ink-muted">
              Coverage is described at the level stated above — ask us for
              current integration detail.
            </p>
          </>
        ),
      },
      {
        heading: 'How you get it',
        body: (
          <>
            <p className="type-body mt-3">
              Customers do not receive Sandbee&rsquo;s source code. Instead, the
              customer may receive a build/distributable package and use the
              technology through an API key or other controlled access
              mechanism, depending on the package.
            </p>
            <p className="type-body mt-4">
              A package can be delivered as a build/distributable component,
              with controlled access through API keys or another
              licensing/access mechanism.
            </p>
          </>
        ),
      },
      {
        heading: 'Where it is heading',
        body: (
          <p className="type-body mt-3">
            The resulting technology is intended to become a reusable
            package/service for other developers who need similar functionality.
          </p>
        ),
      },
    ],
    faq: [
      {
        question: 'Is there public documentation?',
        answer:
          'Not yet public. Ask for access and current integration material through the contact page.',
      },
      {
        question: 'Do we get the source code?',
        answer:
          'No — delivery is a build/distributable package with controlled access.',
      },
      {
        question: 'Which operating systems are covered?',
        answer:
          'The technology includes cross-operating-system/native components; ask us about your specific targets.',
      },
      {
        question: 'How is it billed?',
        answer:
          'A package-specific model, agreed in conversation — no public price list exists.',
      },
    ],
  },
  'aadhaar-pan-ocr': {
    title: 'Free Document OCR package for Node.js',
    description: ocr.description,
    firstScreen: {
      nouns: ocr.description,
      access:
        'Install the package on your Node.js server. Manage the access key through Sandbee Store.',
      billing: ocr.pricingDetail,
    },
    sections: [
      {
        heading: 'Run extraction on your server',
        body: (
          <p className="type-body mt-3">
            Documents used by the installed package stay on your infrastructure.
            Review important extracted fields before saving them.
          </p>
        ),
      },
      {
        heading: 'License verification and runtime',
        body: (
          <p className="type-body mt-3">
            The current package supports Node.js 22 or newer on Windows x64 or
            Linux x64 with glibc. Internet access is needed for startup
            verification and periodic access renewal.
          </p>
        ),
      },
      {
        heading: 'Get the package',
        body: (
          <p className="type-body mt-3">
            Enable Document OCR in Sandbee Store, generate a key and download
            the authenticated package. The hosted Store demo is separate from
            processing with the installed package.
          </p>
        ),
      },
    ],
    faq: ocr.faqs.map(([question, answer]) => ({ question, answer })),
  },
  'face-scan-mobile': {
    title: 'Face scan / mobile setup',
    description:
      'A more complete mobile face-scan setup — the required technology stack delivered as a controlled-access integration rather than built from scratch.',
    firstScreen: {
      nouns:
        'A more complete mobile face-scan setup intended to provide the required technology stack/setup rather than forcing another team to build the entire capability from scratch.',
      access:
        'Intended delivery is a complete mobile integration/setup with controlled access. Discuss current scope and availability for your project.',
      billing: 'Commercial direction: an offering-specific model.',
    },
    sections: [
      {
        heading: 'The problem it solves',
        body: (
          <p className="type-body mt-3">
            Packages can solve difficult technical problems so another developer
            does not need to build the same capability from scratch — this setup
            covers mobile face-scan so your team does not have to.
          </p>
        ),
      },
      {
        heading: 'What “setup” means here',
        body: (
          <>
            <p className="type-body mt-3">
              This is a setup — the required technology stack for mobile
              face-scan — rather than a single drop-in function. Delivery is
              shaped as a complete mobile integration.
            </p>
            <p className="type-body mt-4 text-ink-muted">
              Platform targets and scan characteristics are shared during an
              access conversation; no public spec exists yet.
            </p>
          </>
        ),
      },
      {
        heading: 'How you get it',
        body: (
          <>
            <p className="type-body mt-3">
              Customers do not receive Sandbee&rsquo;s source code. Instead, the
              customer may receive a build/distributable package and use the
              technology through an API key or other controlled access
              mechanism, depending on the package.
            </p>
            <p className="type-body mt-4">
              Access route: complete mobile integration/setup with controlled
              access.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: 'Is there public documentation?',
        answer:
          'Not yet public. Ask for access and current integration material through the contact page.',
      },
      {
        question: 'Which mobile platforms are covered?',
        answer:
          'Platform targets are discussed per engagement — no public platform list exists, and we will not invent one.',
      },
      {
        question: 'Is this just a face-detection model?',
        answer:
          'It is described as a more complete setup — the required technology stack — rather than a single component.',
      },
      {
        question: 'How is it billed?',
        answer: 'An offering-specific model, agreed in conversation.',
      },
    ],
  },
}
