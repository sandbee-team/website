# Bounded final review: public catalog, shell and enquiries

Review completed 2026-09-26; filename retained from the assigned review task. Read-only implementation review: this report is the only file changed.

## Result

No critical defect found in the reviewed current, email-composer configuration. The visible site presents one Sandbee catalog with GSTIN, Document OCR, Sandbee Messaging and Sandbee POS. The design uses a coherent warm background, graphite text, restrained yellow accents and illustrative product interfaces. Pricing distinguishes free access, prepaid balance and one-time setup without inventing paid amounts or offering an online paid checkout.

One conditional functional issue and one outstanding publication dependency remain. Neither requires redesigning the inspected pages.

## Findings in priority order

### P2 — Enabling contact transport silently drops the selected product

Evidence: `src/app/(marketing)/contact/page.tsx:55` chooses `<ContactForm />` when `CONTACT_TRANSPORT_URL` is configured. That legacy component has name, email and message fields but no product input or query-string handling, and its permalink defaults to `/contact` (`src/components/contact/contact-form.tsx:31`). The receiving server action reads only those three fields (`src/lib/forms/action.ts:32`).

Trigger: follow either the Messaging or POS pricing CTA to `/contact?product=messaging` or `/contact?product=pos` in a deployment with transport enabled. The visitor loses the selection that the current composer displays, and the delivered enquiry has no explicit product context unless the visitor repeats it manually. The no-JavaScript permalink also discards that query context.

Recommendation: preserve the allowlisted product identifier and visible selection across both form variants, their validation/submission data and progressive-enhancement permalink. Alternatively retain the current composer until the transport-backed flow supports the same product context. This is a source-confirmed conditional issue; the server-transport variant was not enabled or submitted during this review.

### P3 — Privacy and terms destinations remain publication dependencies

Evidence: the public footer links to `/privacy` and `/terms` (`src/components/site/footer.tsx:73`). Both destinations explicitly state that the corresponding document has not been published (`src/app/(marketing)/privacy/page.tsx:18`, `src/app/(marketing)/terms/page.tsx:18`). These are honest placeholders, not broken links or fabricated policies.

Impact: visitors can find the contact address, but cannot yet read an explanation of how an emailed enquiry is retained/handled or the applicable website terms. This matters more when the transport-backed form is activated. The current composer correctly explains that it only prepares an email and does not claim a message was already sent.

Recommendation: keep this recorded as an owner-supplied content dependency before public launch or server-side enquiry collection. Do not invent legal text, retention periods or business details. This finding describes incomplete public content, not a legal-compliance conclusion.

## Checks completed and strengths retained

- Read the current home, pricing and contact routes; header/footer and header styling; catalog data and directory; workspace demo and product previews; both contact form variants and composer styling; responsive marketing rules. Inspected the server action only to trace the missing product field, and the two linked legal pages only to verify the footer destinations.
- Viewed `test-results/reference/sandbee-home-new.png`, `sandbee-mobile-new.png`, `-pricing-desktop.png` and `-contact-product-pos-desktop.png`. The full-height mobile capture was resized by the image viewer; used it to assess structure and stacking, not to claim precise contrast or small-text legibility.
- Current source includes the later disabled-before-hydration composer fieldset and no-JavaScript email fallback. Old captures are not evidence that those protections are absent. Likewise, did not report old preview contrast as a current defect after the supplied source correction.
- Used Chromium against `http://localhost:3110/` at viewport widths 320, 390 and 901 pixels. `document.documentElement.scrollWidth > innerWidth` was false at all three sampled sizes. This is a horizontal-overflow check, not a full responsive certification.
- At `/contact?product=pos` with a 390-pixel viewport, the POS radio was selected, the hydrated submit button was enabled, and the page had no horizontal overflow. Entered synthetic review-only details and selected **Prepare my enquiry**. The generated link was a `mailto:` URL whose decoded content included Sandbee POS. Did not click the email link or transmit an enquiry.
- The composer builds subject/body using URI encoding; user text is rendered through React rather than inserted as HTML. No apparent client-side injection issue found in that inspected path. This is not a penetration test.
- Store links are external, while Messaging/POS CTAs route to the enquiry with the appropriate product parameter. The homepage Store section explicitly distinguishes GSTIN/OCR access from guided Messaging/POS setup. The pricing page states customer infrastructure costs separately and has no paid checkout.
- Product previews visibly say **Illustrative preview** and use sample content, rather than claiming real customer activity. The full catalog is server-rendered before filtering. Header navigation uses native disclosures with Escape/outside-click handling; workspace tabs have explicit roles and keyboard navigation in source.

## Untested limits and handoff

No implementation or test files changed. No external Store sign-in, app activation, account permissions, keys, package downloads, GST lookups, messaging, POS runtime, payments or email delivery were tested. No private data or environment values were read. Source-reported product capabilities were taken from the current parent-owned catalog; this review does not independently re-audit those product repositories.

The server transport branch, no-JavaScript browser behavior, assistive technology, full contrast ratios, every navigation breakpoint, production build and performance are outside this bounded review. Parent integration validation owns those checks. Cashfree's crawler/browser differences were not re-investigated here; this review assesses the supplied Sandbee implementation and captures, not pixel fidelity to a reference site.

## P2 follow-up: narrowly reviewed correction

Status: **partially resolved in source; one original progressive-enhancement edge remains**. Re-read only the contact route, `src/components/contact/transport-enquiry.tsx`, `src/components/contact/contact-form.tsx` and `src/lib/forms/action.ts` after the parent change.

Resolved: the transport branch now renders `TransportEnquiry` inside Suspense; it matches the query product against the catalog and passes the known ID to `ContactForm`. The form includes a hidden product field and visible product name. The server action independently checks the submitted identifier against the catalog, rejects unsupported submitted values and prefixes the delivered message with the recognized product name. General enquiries retain their former message shape.

Remaining: `TransportEnquiry` does not pass a product-specific permalink, while `ContactForm` still gives `useActionState` the default `/contact`. A no-JavaScript validation/error navigation therefore drops the original query context, and a subsequent retry can lack the product field. Pass `/contact?product=<allowlisted-id>` as the permalink for a product enquiry and `/contact` for a general enquiry, or derive that default inside the form.

This follow-up is source-only; no transport was configured, no messages were delivered and no additional test results are claimed. P3 remains the same owner-supplied policy-content dependency. No new review scope or findings were added.
