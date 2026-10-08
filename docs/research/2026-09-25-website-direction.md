# Cashfree review and Sandbee implementation

Reviewed 25 September 2026. This is design research, not a comparison of provider reliability or prices.

## What was actually reviewed

The live [Cashfree homepage](https://www.cashfree.com/) was opened in Chromium at 1440 × 1000. Its browser-rendered campaign headline was different from the search/text extraction. The rendered website is the visual authority. Local research screenshots are generated in ignored `test-results/reference/`, not shipped as Sandbee website assets.

Observed: restrained white navigation, grouped Products/Developers/Resources entry points, an explicit pricing destination, bold black typography, lime offer creative, glass-like connected product illustrations, product-specific walkthrough sections, and repeated sign-up/contact choices. These are observations of the reviewed version, which can change.

## Translation to Sandbee

- Keep clear hierarchy and product grouping; use Sandbee's existing mark and licensed Manrope font.
- Replace payment campaign imagery with a working product-selection illustration: one Store workspace, four selectable product previews, distinct delivery models.
- Use warm white, graphite, forest actions and honey selection. No Cashfree image, logo, celebrity likeness, commercial claim or custom artwork is copied.
- Show current products with their actual commercial model: GSTIN and OCR free, Sandbee Messaging prepaid, Sandbee POS one-time setup. The owner explicitly confirmed the two new names and models in this session.
- Make motion explain selection and document processing: keyboard-operable tab transitions and short finite connector/scan sequences. Reduced-motion removes animation. No scroll interception or WebGL is needed by the new primary pages.
- Put useful content before acquisition: product instructions, differences between hosted APIs and installed packages, pricing responsibilities, product FAQs and original articles.

The homepage, category pages, details and blog use shared tokens, previews and catalog data. `src/content/catalog.ts` is the current marketing catalog. Existing MDX IDs preserve route/history compatibility and feed schema validation.

## Integration boundary

This website does not collect passwords, hold balances, debit message credits, run OCR or make GST requests. It links to Store for free-product access and developer guides. Paid-product requests compose a real email or use the existing configured contact transport. A composed email is not a delivered request.

Before central paid-product provisioning, implement the Store models and product APIs together: product entitlements, auditable wallet ledger, idempotent credits/debits, payment webhooks, invitations and operator permissions, plus POS setup milestones. That work is intentionally subsequent to this website phase, matching the owner's requested rollout order.

## Deployment facts

The main website keeps its existing Next.js/Vercel deployment setup. POS is a separate customer deployment in the customer's Vercel account, as explicitly instructed. Vercel's [Hobby plan documentation](https://vercel.com/docs/plans/hobby) limits Hobby to non-commercial personal use; do not market commercial POS hosting as automatically free. Applicable hosting/database plans and costs belong in the quote.

No production website, Store source, existing product source or private customer data was modified by the redesign. The separate POS marketing repository was read only as product reference.
