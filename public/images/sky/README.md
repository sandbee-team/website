# Open-source cloud artwork

Original: Cumulus Cloud, zeimusu, 25 October 2011.
Source: https://openclipart.org/detail/164761/cumulus-cloud
Download: https://openclipart.org/download/164761
License: CC0 1.0 / public domain; https://openclipart.org/share
Verified 2026-09-11.

Files:

- `cumulus.svg` — the source artwork with its blue background rectangle removed and the
  viewBox tightened (2026-09-11 morning session). Kept as the provenance copy.
- `clouds.svg` — the served asset (2026-09-11 rebuild). The original soft "puff" (three
  radial-gradient ellipses at 37% opacity) is reused to compose three silhouettes:
  `#cloud-cumulus` (the original composition), `#cloud-distant` (a flattened horizontal
  band) and `#cloud-soft` (a larger foreground mass). Generated deterministically by a
  script from `cumulus.svg`; CSS places and scales the symbols into depth layers via
  `<svg><use href="/images/sky/clouds.svg#cloud-…"/></svg>`.

No raster content, external resource references, scripts or animated SVG filters.
