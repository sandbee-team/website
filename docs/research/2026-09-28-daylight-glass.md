# Daylight glass — website design update

Date: 28 September 2026. Scope: public Sandbee website only.

## Direction and references

The user requested Pinterest research, background imagery, glass treatments and a distinctive light website. This supersedes the older restriction against glass in the local design rules, only for the named new surfaces. Existing content, commercial models and Store URLs remain authoritative.

- [Pinterest glass collection](https://in.pinterest.com/aryandoodles/gradient-and-glass-morphism/) and [glass UI reference](https://in.pinterest.com/pin/glassmorphism-ui-template--1141451468036465799/): translucent edges and foreground/background separation. Search image previews were available; direct Pinterest pages could return 403. Reference images are not redistributed.
- [Cashfree](https://www.cashfree.com/): product-led discovery and routes from a broad portfolio to specific use cases.
- [Mercury](https://mercury.com/): editorial pacing, photography and restrained typography.
- [Ramp](https://ramp.com/): one platform narrative with clear product entry points.
- [Linear](https://linear.app/): detailed product demonstrations as the visual subject, rather than unrelated decorative metrics.

These are design references, not templates to copy. No competitor artwork, trademarks, claims or numbers are used in Sandbee's interface.

## Implementation plan

1. Preserve Next.js server-rendered content, metadata and existing product interactions.
2. Introduce central daylight palette and material tokens: cool off-white, ink blue, cobalt actions, pale blue and warm accents. Retain locally hosted Manrope with an Instrument Serif headline accent.
3. Build a photographic hero with an opaque reading region and a frosted, keyboard-operable product explorer. Glass is restricted to navigation and short product display surfaces.
4. Update catalog, product details, pricing, Store section, resource cards and footer as one family. Use meaningful links and real offering information throughout.
5. Add finite entrance motion and small hover transitions; preserve reduced motion, no-JavaScript discovery and solid-color fallback when backdrop filtering is unavailable.
6. Check lint, token contrast, unit tests, production build, responsive overflow, keyboard navigation, accessibility and screenshots. Record actual outcomes after running.

## Image provenance

Hero photograph: [The white architectural structure against a blue sky](https://unsplash.com/photos/the-white-architectural-structure-against-a-blue-sky-nTDvhXAl9Cg), Shiva Mardahi, published 19 July 2025. Photo page explicitly marks it free under the Unsplash License. Download source: `https://images.unsplash.com/photo-1752965595931-e3480510297e?fit=crop&w=1800&q=82&fm=webp`.

[Unsplash usage guidance](https://help.unsplash.com/en/articles/2612315-can-i-use-unsplash-images-for-personal-or-commercial-projects) and [license](https://unsplash.com/fr/licence) checked on the date above. Image is an architectural background, not a claim about Sandbee's office, clients or affiliations. Optimized WebP is served locally; no visitor request is sent to Unsplash or Pinterest.

## Boundaries

GSTIN and OCR remain free offerings. Messaging uses prepaid balance; POS is one-time setup with no invented amount. Product previews remain illustrative. The public website does not generate keys, process documents, accept payments or provision accounts; it links to Store or the existing contact route.

## Computed solid-surface contrast

WCAG relative-luminance calculation; transparent photographic surfaces additionally need rendered checks.

| Foreground | Background | Contrast |
|---|---|---|
| ink | canvas | 14.64:1 |
| ink | surface | 15.16:1 |
| ink | sky-mist | 13.37:1 |
| ink | sky | 13.59:1 |
| ink-muted | canvas | 6.05:1 |
| ink-muted | surface | 6.27:1 |
| ink-muted | sky-mist | 5.53:1 |
| primary | canvas | 6.43:1 |
| surface | primary | 6.65:1 |
| primary | sky | 5.97:1 |
| honey-ink | canvas | 7.46:1 |
| honey-ink | sky-mist | 6.81:1 |
| honey | night | 9.30:1 |
| night | honey | 9.30:1 |
| inverse | night | 14.67:1 |
| inverse-muted | night | 9.55:1 |
| honey | night-panel | 6.26:1 |
| line-strong | canvas | 3.33:1 |
| honey-dark | sky | 8.87:1 |
| honey-dark | canvas | 9.56:1 |
| error | canvas | 7.27:1 |
| success | canvas | 6.57:1 |
