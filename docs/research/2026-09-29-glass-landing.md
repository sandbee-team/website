# Glass landing — 29 September 2026

The user's latest direction supersedes the product-explorer hero: the first screen introduces Sandbee as a technology brand, without four product tabs/cards. Products remain discoverable farther down the page. Existing typography and core palette are retained; this is a composition/material change, not a new font selection.

## References reviewed

- [Pinterest glass landing collection](https://in.pinterest.com/littlemonsters1503/blur-glass-morphism/): layered foreground, generous negative space and a single focal object. Search image previews also informed the review. A second Pinterest board returned 403; no claim of full access is made. No Pinterest assets are copied.
- [Apple — Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/): clear edges and depth separation, responsive material, and restrained use of translucency. Adapt the principles to web CSS, not an assertion that this implements Apple's native renderer.
- [Apple — Motion](https://developer.apple.com/design/human-interface-guidelines/motion): interaction should have a clear purpose and honor reduced motion.

## Compositions compared

1. Centered headline with a macOS-style window underneath: spacious, but still reads like a product demo and repeats the previous hero.
2. Editorial headline with a large sculptural glass Sandbee emblem: selected. Establishes the company identity before introducing offerings. A short bridge explains ready-made software, developer tools and custom work before the product catalog.

The new material is an original DOM/SVG rendering of the existing Sandbee mark. Three glass layers assemble into one focal composition: multiple technologies under one company. Text stays flat, sharp and opaque. The glass illustration is decorative and does not contain claims, metrics or essential controls. No competitor logo or artwork is used.

## Motion and accessibility

CSS entrance under 1.5 seconds reveals the layers once. A small pointer response explains their depth; it is disabled for coarse pointers and reduced motion. No infinite render loop, video, canvas, WebGL or additional library. The server-rendered headline, links and final visual work without JavaScript. Static solid surfaces remain available when blur is unsupported, transparency is reduced or forced colors are enabled.

## Implementation boundaries

- New reusable landing hero and glass emblem components; landing CSS remains local, material values are central tokens.
- Remove the four-product strip and move the existing keyboard-operable product explorer into the lower Store section.
- Retain product pages, blog, contact, Store links and commercial terms.
- Update tests for the new headline and explicitly check that the product explorer follows the hero. Preserve keyboard and no-JS tests.
- Rebuild/test the website, refresh Docker preview, then regenerate the final launch bundle for all three projects. Earlier ZIPs are not the final website release.

## Skill interpretation

Applied web-creative-direction and motion-interaction. The user explicitly requested implementation of this glass direction; no additional approval gate is introduced. The material treatment and brand illustration are deliberate exceptions to older anti-glass/diagram-only preferences. The unchanged font stack has already been selected in the existing approved direction. No invented proof, artificial charts or floating product windows are added to the first screen.
