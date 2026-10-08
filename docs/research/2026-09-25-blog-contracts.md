# Blog contracts — 25 September 2026

Scope: three original, authored blog posts and their server-rendered detail routes.
This scoped record is the contract location for this work; historical contracts are
not rewritten. Current user facts override older direction-only portfolio records.

## Shared contract

- Page type: blog-post; status: implemented, local validation recorded below.
- Audience: developers and customers evaluating delivery and operational ownership.
- Author: Sandbee, resolved through the existing organisation author registry.
- Publication: 2026-09-25, the actual writing date; no invented earlier publication.
- Canonical: the route joined to the existing `SITE_URL` constant.
- Metadata: unique authored title and summary; `og:type=article`, published date,
  category, resolved author; Twitter summary-large-image.
- Social image: existing site typographic `/opengraph-image` fallback; no fabricated
  product screenshot or article hero. Article-specific social artwork is not claimed.
- Breadcrumbs: Home > Blog > visible article title, mirrored in BreadcrumbList.
- Structured data: TechArticle for engineering, BlogPosting for developer/product,
  with visible author, category, dates, summary, title and loader-computed word count.
- Inbound links: blog index, RSS, sitemap, and the related-post list of another post.
- Every post has one H1 from PageScaffold, four H2 sections, a linked contents list,
  publication date, reading time, related offering, related post and one final CTA.
- No client component, remote MDX execution, invented benchmark, price, certification,
  API method, authentication syntax or package installation command.

## Customer-hosted OCR

- Route: `/blog/customer-hosted-ocr-integration`.
- Intent: prepare an application and server for local document extraction.
- Topic: the execution, access and data-handling boundaries of Sandbee OCR.
- Title/H1: `Integrating OCR on your own server`.
- Description: `Plan a Sandbee OCR integration around server compatibility, document handling, access checks and a small, reviewable acceptance test.`
- H2 outline: Confirm the runtime before integration; Separate documents from access
  checks; Control the upload boundary; Test the whole document journey.
- Internal links: `/technology/aadhaar-pan-ocr` (Sandbee OCR SDK / OCR integration
  details); `/blog/hosted-api-or-installed-sdk` (related article, delivery comparison).
- Proof: explicit user facts on free SDK, customer Node.js 22+ server, Windows x64
  and Linux x64 with glibc verification, startup and periodic lease checks, local
  documents. Operational recommendations are visibly framed as integration work,
  not promises of SDK features or automatic privacy/compliance.

## Hosted API versus installed SDK

- Route: `/blog/hosted-api-or-installed-sdk`.
- Intent: help developers compare operating responsibilities before integration.
- Topic: delivery-model choice using the actual GST API and OCR SDK as examples.
- Title/H1: `Hosted API or installed SDK: choose the operating model`.
- Description: `Compare where code runs, who operates it and what failure handling you own, using Sandbee's free GST API and customer-hosted OCR SDK.`
- H2 outline: Start with where the work runs; Make the data boundary explicit;
  Compare failure and change ownership; Write a short integration decision.
- Internal links: `/technology/aadhaar-pan-ocr` (customer-hosted OCR SDK),
  `/blog/customer-hosted-ocr-integration` (related article), `/technology` (CTA).
- External product link: `https://gstapi.sandbee.in` (free hosted GST API).
- Proof: explicit user facts only for Sandbee delivery; comparison and checklist are
  original engineering guidance, with no invented availability or limits.

## POS handover

- Route: `/blog/pos-deployment-handover-checklist`.
- Intent: give customer and implementer a useful deployment acceptance checklist.
- Topic: ownership and verification when POS is set up in the customer's Vercel account.
- Title/H1: `A practical POS deployment handover checklist`.
- Description: `Prepare a POS handover that covers the customer's Vercel account, configuration, acceptance checks and the boundary between setup and ongoing costs.`
- H2 outline: Record account and access ownership; Separate test and live
  configuration; Agree the acceptance checks; Leave an operating record.
- Internal links: `/products/pos` (Sandbee POS / POS deployment details),
  `/blog/hosted-api-or-installed-sdk` (related article).
- Proof: explicit user facts on one-time setup and deployment in customer Vercel
  account. No infrastructure-free guarantee, price or unverified POS capability.

## Primary-source review

Checked 2026-09-25:

- https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html:
  file allowlists, file-type validation, size limits, generated filenames and storage
  outside webroot. Supports only the upload-control section; advice is not a claim
  that Sandbee automatically implements the customer's upload controls.
- https://vercel.com/docs/deployments/environments:
  Local, Preview and Production are separate environments. This article does not
  infer that a Preview automatically has an isolated database.
- https://vercel.com/docs/environment-variables:
  changes apply to new deployments, not previous deployments.
- https://developers.google.com/search/docs/appearance/structured-data/article:
  reviewed article metadata guidance; schema parity is locally checked, no rich-result
  eligibility or external validator result is claimed.
- Installed Next.js docs: `generate-static-params.md`, `generate-metadata.md`,
  `15-route-handlers.md`, `mdx.md`. Uses Promise params and static local MDX imports.

## Verification record

- `npm run typecheck`: exit 0; generated route types and TypeScript passed.
- `npx eslint` on both new routes and both updated blog test files: exit 0.
- `npx vitest run src/lib/content/blog.test.ts src/test/blog.test.tsx`: exit 0,
  2 files / 15 tests. Covers actual public collection, draft exclusion, hostile and
  missing slugs, static params, metadata, canonical/alternate, article schema,
  related POS route, Markdown content and response headers.
- Real dev server on port 3110: all three HTML routes and Markdown routes return
  200. Raw response checks strip scripts and still find body headings and one H1;
  these are server-rendered content checks, not hydration-only DOM assertions.
- All three articles appear in actual RSS and sitemap responses. Draft fixture
  appears in neither. Draft, missing and `constructor` slugs return 404 from HTML
  and Markdown routes.
- Playwright, Chromium, 390 × 844, reduced motion: all three pages have exactly one
  H1, matching title/canonical/Markdown alternate, valid JSON-LD, no missing TOC
  targets and no page-width overflow. Axe checks scoped to `.blog-article`: zero
  violations on all three. Full-site contrast and manual keyboard review remain
  with the parent's shared-layout verification.
- Source review: four plain-text H2s per article; no executable MDX expressions;
  company facts checked against the current user instructions. OWASP guidance is
  attributed in place; Vercel configuration statements link their primary sources.
  Literal hedge scans ran separately against prose and metadata. Recommendations
  retain conditional language; no metadata implies a guaranteed outcome.
- Measured body counts (same whitespace basis as loader): OCR 504, API/SDK 527,
  POS 540. Title lengths: 34 / 55 / 45; summary lengths: 133 / 133 / 148.
- Full build and complete test suite belong to the parent integration gate to avoid
  competing writes to `.next`. No external structured-data validator result claimed.

Feed and sitemap already consume the public post loader; no additional route
registration change was needed for the articles. Markdown alternates use the
explicit child path `/blog/[slug]/article.md` authorised for this task instead of
the older ADR's illustrative `/blog/<slug>.md` form. Their canonical response
header and `noindex, follow` avoid advertising duplicate indexable pages.
