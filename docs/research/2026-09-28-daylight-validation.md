# Daylight website validation

Completed locally on 28 September 2026. Public website only; Store, Admin and service projects were not edited or deployed.

## Delivered

- Photographic homepage with an optimized, locally hosted architectural image and a frosted product explorer.
- Central daylight palette, blue actions, light footer and Store section; locally hosted Manrope and Instrument Serif.
- Glass navigation with an opaque fallback, finite entrance animation, hover feedback and reduced-motion handling.
- Matching product catalog, pricing surfaces, product-detail previews and reusable editorial guide covers on home/blog.
- Existing product models, prices, Store links, SEO metadata and keyboard interactions preserved.
- Product-tab navigation now derives its wraparound from catalog length.
- Contact fallback explains how to enquire when JavaScript is unavailable.

## Checks actually run

| Check | Result |
|---|---|
| ESLint | Passed |
| Design rules R1–R9 | Passed; glass allowlist explicitly updated for the user-requested surfaces |
| Portable import paths | 343 imports resolve with exact filename casing |
| Unit suite | 186 tests passed across 39 files |
| Final affected unit tests | 23 passed after the contact fallback change |
| Next.js production build / TypeScript | Passed; 41 generated static pages |
| Browser suite, first complete pass | 113 passed, 4 findings |
| Browser recheck after fixes | All 36 affected checks passed, including the four original findings |
| Layout coverage | 11 catalog/contact/product routes at 320, 390, 768, 1440 and 1920px |
| Accessibility | Automated Axe checks on home, shell routes, product states, contact, menu and primitives; keyboard focus checked |
| Behavior | Product tabs, filters, menu dismissal, FAQ, contact validation, no-JS discovery, reduced motion, internal links and SEO checks |

The four browser findings were: old green/gold focus-color expectations in two suites, intrinsic guide-cover width causing tablet overflow, and an existing streamed contact fallback omitting no-JavaScript guidance. Tests now match the daylight focus colors; the article grid uses shrinkable tracks; contact has a useful server-rendered fallback. A pre-existing Playwright type error was corrected by placing reduced-motion configuration in `contextOptions`.

## Visual review

Reviewed actual desktop homepage, catalog, OCR detail and blog screenshots, plus 390px mobile and 768px tablet folds. Captures live in ignored `.playwright-mcp/daylight/`. Layout changes were checked against rendered output, not only build success.

The image source is 199,244 bytes; Next Image provides responsive local variants. No new animation or runtime dependency was added. This update does not claim a measured Lighthouse score or field Core Web Vitals result; those depend on the eventual deployment and real traffic.

## Review and deployment

Local production preview for this session: `http://localhost:3198`.

Use the existing [deployment guide](../../DEPLOYMENT.md) for GitHub/Vercel. The handoff ZIP excludes real environment files, dependencies, build output and local browser reports. Source/font/image provenance travels with the project. Production deployment has not been performed.
