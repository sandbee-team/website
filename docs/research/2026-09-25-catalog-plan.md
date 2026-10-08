# Sandbee catalog integration plan

Research date: 2026-09-25. Scope: public marketing content and repository structure only. No environment values, customer records, credentials, or private admin content inspected. This is a content and route plan, not a claim that product functionality was tested.

## Authority and current commercial facts

The user's latest explicit instructions supersede older company-reference and website language for these offerings. Preserve the protected company reference; record the override in implementation decisions and page contracts.

| Offering | Approved current description | Delivery / price model | Destination |
|---|---|---|---|
| GST API | Free GST API | Free; limits, authentication and exact response contract remain unconfirmed | `https://gstapi.sandbee.in` |
| Aadhaar/PAN OCR | Free OCR package for a customer's Node.js server | Package runs on the customer's server; license obtained through the account hub | `https://store.sandbee.in` |
| WhatsApp | Connect WhatsApp by QR; send through an API or panel | Messaging charges deducted from a prepaid account balance | Account hub; exact service panel URL unconfirmed |
| POS | POS setup in the customer's own Vercel account | One-time paid Sandbee setup; provider costs must be stated separately | `/products/pos`, then inquiry through `/contact` |
| Sandbee account hub | Separate account experience | Intended home for access, licenses and balances; do not implement it inside this marketing site | `https://store.sandbee.in`; user says it will be live separately |

Do not infer an official Meta partnership, WhatsApp Business Platform implementation, unlimited messages, government affiliation, OCR identity verification, or a source-code transfer from these descriptions. Do not present the store as already live merely because its URL is known.

## Information architecture recommendation

Keep Sandbee as the company and catalog. The main homepage should answer “What can I use or build with Sandbee?” with all four current offerings, their delivery models and their next actions visible. POS is one card and one product page, not the umbrella identity.

| Route | Reader question and content | Primary action | Integration |
|---|---|---|---|
| `/` | What does Sandbee offer? Four concise offering cards, delivery differences, pricing-model summary, useful articles | Explore an offering | Reuse current marketing shell and offering records |
| `/products` | Which complete software applications are offered? POS card with one-time setup and customer-account delivery | See POS | Update old universal Sandbee-infrastructure wording |
| `/products/pos` | What does POS do and how is it delivered? Counter/kitchen/table/customer/report groups, QR order flow, deployment ownership, setup pricing, support boundaries | Discuss POS setup | Keep existing specialized `PosPage` and route |
| `/services` | What hosted capabilities can I use? Prioritize current WhatsApp service; distinguish other portfolio directions | See WhatsApp service | Preserve existing collection and stable identifiers |
| `/services/whatsapp-sms-automation` | How do I connect and pay? QR connection → API or panel → messaging from prepaid balance | Account hub, with honest launch state | Preserve existing URL initially; change visible name to WhatsApp API and panel. Do not imply SMS is included in this current offer |
| `/technology` | Which APIs and packages can I integrate? GST API, customer-hosted OCR; other technologies remain direction examples | Open the relevant technology | Add GST record; retain OCR ID |
| `/technology/gst-api` | What is the free GST API and where do I use it? Approved free model and external entry point; no invented endpoint examples | Open GST API | New `src/content/technology/gst-api.mdx` plus authored detail rendering |
| `/technology/aadhaar-pan-ocr` | Where does OCR run and how do I get access? Customer Node.js server, free package, license through store | Get OCR license, reflecting store launch state | Replace usage/credits and hosted-API implications |
| `/pricing` | What is free, prepaid or a one-time setup? A four-offering comparison; provider charges separate from Sandbee fees | Offering-specific next action | Useful new shared route, not duplicated POS pricing; register explicitly |
| `/blog` and `/blog/[slug]` | How should I evaluate and integrate these models? Three original practical articles below | Read guide, then relevant offering | Existing loader; add missing article route |
| `/company`, `/contact` | Who is Sandbee and how do I discuss work? Company breadth and specific inquiry contexts | Contact | Correct contradicted deployment claims without rewriting unrelated history |

Navigation recommendation: retain Products, Services, Technology and Company, make Pricing and Blog discoverable, and provide a clearly named external Account link. Current header contains only the original four navigation links plus `/contact`; new reachability must be implemented, not assumed. Avoid making a copied POS-specific `/features` or `/qr-menu` a top-level company page. Keep those sections within POS until separate depth warrants child routes.

## Existing implementation fit

- `src/types/content.ts` and `src/lib/content/offerings.ts` define one offering schema for `products`, `services` and `technology`. Preserve stable IDs, category matching, order, draft filtering and existing relationship IDs.
- Current frontmatter exposes name, one-liner, delivery, commercial direction, access, delivery model, summary and optional status. Updating only an MDX body has no visible effect: this loader returns frontmatter, and `OfferingDetail` renders those fields without the body.
- Extend that shared model only for reusable information such as pricing label, external destination and feature groups; update TypeScript and Zod together. Avoid a separate homepage catalog that can contradict the offering pages.
- `managed-deployment` can describe who performs setup without meaning Sandbee owns the infrastructure. Its visible label and Atlas explanation need review wherever ownership is implied. GST is a developer API; use an appropriate existing delivery classification or document a deliberate extension rather than silently classifying it as a downloadable package.
- `/products/[product]` has a special `PosPage`; update both it and the route's metadata, currently describing Sandbee-managed servers and databases. Audit `DeliveryChain`, product index, company/home copy and connected SEO fields for the same conflict.
- `src/lib/content/blog.ts` already validates authors, categories, ISO timestamps, related post IDs and summaries up to 160 characters. Reading time is computed. Use existing `sandbee` organization author; never invent named authors or backdate the reference site's dates.
- Add `/blog/[slug]` together with real articles. Render article bodies server-side through the existing content/rendering conventions. Keep the fixture draft. Three posts spread across categories do not warrant category pages: loader requires three published posts in an individual category.
- `src/lib/seo/routes.ts` derives offering and blog paths automatically. Add `/pricing` to static routes; ensure newly authored detail routes no longer inherit structural noindex behavior. `/blog` becomes indexable automatically when posts exist. Provide metadata, canonical, breadcrumbs, visible-content-matched JSON-LD and social image for each authored route.
- These recommendations fit the current App Router/content architecture; they require no copied admin APIs, database connections, account implementation or client-side language provider from `products-web`.

## POS evidence ledger

“Observed” below means found in the public reference site's source. It is not a runtime verification of the actual POS, which was outside this read-only marketing research.

| Public-copy evidence | Source in `D:/kd/products-web` | Safe editorial handling |
|---|---|---|
| Product grid; modifiers and sizes; flat/percentage order discounts; cash/online/due/split records; running/reopened orders; bill numbering | `components/features-groups-copy.ts` | Candidate feature list. Say billing grid, not “3-second” performance |
| Separate kitchen tickets and bills; print configuration; 58/80mm formats; KOT numbering | Same | Describe supported workflow; avoid universal printer compatibility or certification |
| Floor plan, table capacities/charges, reservations and advance-payment records, event bookings | Same | Candidate feature group; do not promise reduced queues or increased turnover |
| Customer ledger and payment history, visits/spend, mobile-number search, WhatsApp receipt link | Same | Receipt sharing is not evidence of automated WhatsApp API integration |
| Dashboard, hourly sales, date/item/payment reports, end-of-day summary, staff roles, void history, CSV menu import, photos, availability toggle, archive/restore | Same | Avoid “full inventory management”: stock toggle is narrower than stock accounting |
| Per-table QR → browser menu → order request → staff acceptance → kitchen ticket; payment remains at counter | `app/qr-menu/qr-menu-copy.ts` | Preserve the staff acceptance gate. Do not say QR orders auto-fire or QR checkout collects payment |
| One-time setup in customer account | Latest user instruction; public pricing copy agrees on customer account | Publish current user fact; use Vercel-specific ownership wording |

Unsupported or conflicting claims to remove from migration: TezPOS branding and `tezpos.example`; placeholder email/phone; first-100-cafes discount; three-second billing; offline operation; zero wrong orders; no revenue leakage; guaranteed turnover uplift; universal GST/FSSAI compliance; competitor annual price ranges; perpetual zero infrastructure cost; unlimited capacity; source-code ownership. A claim appearing in marketing copy is not proof of performance or compliance.

The reference also promises three months of free support, staff training, on-site/on-call launch support and a particular setup checklist. These are unconfirmed commercial commitments. Retain only the current user-approved one-time setup model; make support scope part of the written quote until explicitly settled.

## Pricing and ownership wording

Suggested POS wording: “One-time POS setup in your Vercel account. Hosting and other provider charges depend on your plan and usage. Request a setup quote.” This does not invent a setup amount, support duration or infrastructure entitlement.

Vercel's official Hobby documentation limits Hobby to personal, non-commercial use. A commercial POS must not be advertised as eligible for free Hobby hosting just because its traffic is small. Customer ownership and Sandbee's one-time setup fee are separate from the provider's commercial plan and usage charges. [Vercel Hobby plan](https://vercel.com/docs/plans/hobby)

Unknowns to keep out of published numeric pricing: POS setup amount/currency/tax treatment, included implementation tasks and support duration; WhatsApp rate per chargeable unit, when a debit occurs, failed-message treatment, minimum top-up and balance expiry/refund policy; GST request limits/authentication/service expectations; OCR package/version/runtime requirements, license terms and any activation dependency. Do not invent sample API payloads or runnable install commands. These do not block a useful model-level pricing page.

## Cashfree patterns to adapt

Cashfree groups a broad portfolio by customer job and gives each product a destination. Its main site separates product exploration, pricing, resources and account entry. Adapt that separation to Sandbee's much smaller catalog; do not import Cashfree's regulatory claims, customer counts, product terminology or large mega-menu. [Cashfree homepage](https://www.cashfree.com/)

Its pricing page groups charges by service family, puts conditions near offers, and provides a sales path when exact pricing is contextual. Sandbee can likewise explain free API/package access, prepaid messaging and one-time POS setup on one page, without forcing unlike offerings into subscription tiers. Cashfree's promotional rates are not relevant Sandbee price evidence. [Cashfree pricing](https://www.cashfree.com/payment-gateway-charges/)

The product page connects capabilities, use cases, integrations and developer resources. Sandbee detail pages should similarly show the actual workflow, delivery and next step. [Cashfree payment gateway](https://www.cashfree.com/payment-gateway-india/)

Cashfree maintains a separate editorial destination. Sandbee should use its existing blog for useful explanations that link back to the catalog, rather than create another POS-only publication. [Cashfree blog](https://www.cashfree.com/blog/)

## Three original article outlines

### 1. What to check before a POS is deployed in your cloud account

- Proposed route: `/blog/pos-in-your-own-cloud-account`; category `product`; related technology ID `pos`.
- Intent: help a cafe owner understand the handover and responsibilities before paying for setup.
- Outline: what the one-time setup pays for; account ownership versus operating responsibility; hosting plan and provider bills; access and recovery responsibilities to document; menu/printer/table acceptance checklist; support and customization questions for the quote.
- Concrete artifact: a short deployment handover checklist with owner, access method and recurring-cost columns; unknown commitments remain questions, not promises.
- Link to `/products/pos`, `/pricing` and `/contact`; cite Vercel's commercial-use restriction when discussing hosting. Do not reproduce the older reference's competitor claims or free-tier thresholds.

### 2. Choosing between a hosted API and a package on your Node.js server

- Proposed route: `/blog/hosted-api-or-nodejs-package`; category `developer`; related IDs `gst-api` and `aadhaar-pan-ocr`.
- Intent: explain the operational difference using Sandbee's actual delivery models.
- Outline: request sent to a hosted service; package running in the application's server environment; licensing versus where processing happens; deployment, version and capacity questions; a decision table for the integration team; the approved GST and OCR entry points.
- Concrete artifact: a responsibility table separating application integration, hosting, package deployment and access/license management. Avoid unverified claims that documents never leave a server or that a package needs no network calls.
- Link to both technology pages and `/pricing`. No fictional SDK methods, response fields, accuracy benchmark or legal/KYC equivalence.

### 3. Planning a WhatsApp workflow around a prepaid balance

- Proposed route: `/blog/whatsapp-api-panel-prepaid-balance`; category `automation`; related ID `whatsapp-sms-automation`.
- Intent: help a business decide whether to use the panel or connect its software to the API, while understanding account balance.
- Outline: QR connection and the two sending surfaces; a manual panel workflow versus an application-triggered workflow; prepaid balance as an operating dependency; questions about debit timing, failed sends and low balance; a launch checklist for the team's approved use case.
- Concrete artifact: API-versus-panel choice table and a list of billing questions. Do not invent delivery guarantees, retries, webhooks, bulk-send limits, scheduled messages, automatic top-ups or supported message formats.
- Link to the WhatsApp service, `/pricing` and the store with accurate launch-state wording. Keep it useful without presenting unconfirmed Meta policy or partnership claims.

## Source inventory

Local sources read: `.claude/skills/seo-content/SKILL.md` and its page-contract/copy-voice guidance; `.claude/skills/nextjs-production/SKILL.md`; `docs/reference/sandbee-company-reference.md`; offering and blog types/loaders; three current offering records; product/blog routes; shared offering component; header; route registry. Public POS reference paths are listed in the evidence ledger, alongside `lib/site.ts`, `lib/blog.ts`, `app/features/content.tsx`, `app/pricing/content.tsx` and `components/pricing.tsx`.

External sources were checked on the research date and are linked next to the findings. Cashfree `/pricing/` returned 403; its homepage linked to the accessible canonical pricing page used above. No runtime product verification, numeric Sandbee pricing verification or private account inspection was performed.
