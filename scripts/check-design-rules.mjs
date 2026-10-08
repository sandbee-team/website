#!/usr/bin/env node
/*
 * Design rule-set check (ADR-0004 graft 7; re-encoded for the 2026-09-11 system by
 * ADR-0017): the live visual rules as mechanical greps, not conventions. Record:
 * .memory/visual-direction/2026-09-11-ui-rebuild-system.md. Run: `npm run check:rules`.
 *
 * R1  No raw colours outside src/app/globals.css (hex, rgb/hsl/oklch literals).
 * R2  Radius only via tokens: no `rounded-[...]` arbitrary values; `border-radius:`
 *     in component CSS must reference var(--radius-*).
 * R3  No rotated text / diagonal decoration: rotation exists only in the bee and cloud
 *     files (wings beat, clouds flip) — those files are allowlisted deliberately.
 * R4  Honey has one job (the bee + rare accents): honey tokens appear only in
 *     globals.css and deliberately allowlisted files.
 * R5  Type discipline: the serif accent and display sizes are reachable only through
 *     the composite type utilities (never bare font-serif / text-display / text-hero /
 *     text-section classes).
 * R6  Case rule: uppercase exists only inside type-kicker (globals.css).
 * R7  Material effects are restricted to explicitly allowlisted compositions: the original sky
 *     (globals.css + the hero module); nothing else may use gradient/blur/shadow utilities.
 * R8  Content MDX imports nothing (allowlist components only — ADR-0011 §8).
 * R9  Width system: no raw Tailwind max-w scale values in src — widths trace to the
 *     tokened utilities (content-block/form-block/measure/container/grid). POSITIVE
 *     presence counts: the shared utilities are actually in use.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const ROOT = process.cwd()
const SRC = join(ROOT, 'src')
const TOKEN_FILE = ['src', 'app', 'globals.css'].join('/')

// Files allowed to reference honey tokens (deliberate design decisions — extending
// this list is named in the phase's 05-review).
const HONEY_ALLOWLIST = [
  TOKEN_FILE,
  // The bee (header arrival + hero atmosphere) — honey is its body colour.
  'src/components/sections/home/bee.tsx',
  'src/components/sections/home/bee.module.css',
  'src/components/sections/home/hero.module.css',
  'src/components/site/brand-mark.tsx',
  'src/components/site/header.module.css',
  // Diagram grammar: each diagram carries exactly ONE honey group (rule 3).
  'src/components/product/delivery-chain.tsx',
  'src/components/services/service-flow.tsx',
  // Homepage: the idea model's chip (one honey element) and the developer band's
  // single honey rule.
  'src/components/sections/home/idea.module.css',
  'src/components/sections/home/teasers.tsx',
  'src/components/sections/home/developer.module.css',
  // Styleguide swatches render every token by name.
  'src/app/styleguide/page.tsx',
  'src/app/opengraph-image.tsx',
]
// Wing geometry and cloud flips rotate; text never does.
const ROTATE_ALLOWLIST = [
  // Requested glass brand emblem; decorative geometry, not reading text.
  'src/components/landing/landing.module.css',
  // Content-specific CSS 3D studies; labels have an untransformed text equivalent.
  'src/components/site/experience.module.css',
  // September 14: decorative 3D fallback geometry, never rotated text.
  'src/components/sections/home/sculpture.tsx',
  'src/components/sections/home/sculpture-stage.tsx',
  TOKEN_FILE,
  'src/components/sections/home/bee.tsx',
  'src/components/sections/home/bee.module.css',
  'src/components/sections/home/hero.module.css',
  'src/components/site/brand-landing.tsx',
  'src/components/site/header.module.css',
]
// The sky gradient is atmosphere, not decoration (plan §4/§7): hero module only.
// User-requested daylight glass, 28 September: bounded material surfaces only.
const GRADIENT_ALLOWLIST = [
  // September 29: one bounded brand-glass illustration, not repeated glass cards.
  'src/components/landing/landing.module.css',
  'src/components/catalog/marketing.module.css',
  'src/components/catalog/workspace-demo.module.css',
  'src/components/site/header.module.css',
  // Grounding shadow underneath the live page sculpture.
  'src/components/site/experience.module.css',
  'src/components/sections/home/sculpture-stage.tsx',
  // September 14: material shading and the sculpture ground shadow.
  'src/components/sections/home/sculpture.tsx',
  'src/components/sections/home/sculpture.module.css',
  TOKEN_FILE,
  'src/components/sections/home/hero.module.css',
]

const rules = [
  {
    id: 'R1',
    what: 'raw colour literal outside globals.css',
    pattern:
      /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|(?:\brgba?|\bhsla?|\boklch)\(/,
    allow: (file) => file === TOKEN_FILE,
  },
  {
    id: 'R2',
    what: 'ad-hoc border radius (radius comes only from --radius-control / --radius-panel / --radius-pill)',
    // A border-radius value may only be composed of 0 and --radius-* tokens.
    pattern:
      /rounded-\[|border-radius\s*:(?!\s*(?:0|var\(--radius-[a-z]+\))(?:\s+(?:0|var\(--radius-[a-z]+\)))*\s*;)/,
    allow: (file) => file === TOKEN_FILE,
  },
  {
    id: 'R3',
    what: 'rotation outside the bee/cloud files',
    pattern: /\brotate-|-rotate-|\brotate\s*\(|transform\s*:\s*[^;]*rotate/,
    allow: (file) => ROTATE_ALLOWLIST.includes(file),
  },
  {
    id: 'R4',
    what: 'honey token outside globals.css / allowlisted files',
    pattern:
      /(?:bg|text|border|decoration|outline|fill|stroke|ring|from|via|to)-honey|var\(--color-honey/,
    allow: (file) => HONEY_ALLOWLIST.includes(file),
  },
  {
    id: 'R5',
    what: 'serif/display face used outside the composite type utilities',
    pattern:
      /(?<![-\w])font-serif(?![-\w])|(?<![-\w])font-display(?![-\w])|(?<![-\w])text-display(?![-\w])|(?<![-\w])text-hero(?![-\w])|(?<![-\w])text-section(?![-\w])/,
    allow: (file) => file === TOKEN_FILE,
  },
  {
    id: 'R6',
    what: 'bare uppercase (case rule: uppercase only via type-kicker)',
    pattern: /\buppercase\b/,
    allow: (file) => file === TOKEN_FILE,
  },
  {
    id: 'R7',
    what: 'gradient / glass / shadow outside deliberate material surfaces',
    pattern:
      /bg-gradient|linear-gradient|radial-gradient|conic-gradient|backdrop-blur|backdrop-filter|(?<![\w-])shadow-(?!none\b)/,
    allow: (file) => GRADIENT_ALLOWLIST.includes(file),
  },
  {
    id: 'R8',
    what: 'import/export in content MDX (allowlist components only — ADR-0011 §8)',
    pattern: /^(import|export)\s/,
    allow: (file) => !file.startsWith('src/content/') || !file.endsWith('.mdx'),
  },
  {
    id: 'R9',
    what: 'raw Tailwind max-w scale value (width system: content-block/form-block/measure/grid only)',
    pattern: /max-w-(xs|sm|md|lg|xl|\dxl)\b/,
    allow: (file) => file === TOKEN_FILE,
  },
]

// R9 positive presence (counting, not allowlisting): the shared system is in use.
const PRESENCE = [
  {
    id: 'R9-W',
    what: 'tokened content-block widths in use',
    pattern: /content-block/g,
    scope: 'src/',
    min: 10,
  },
  {
    id: 'R9-C',
    what: 'container-site in use across routes and sections',
    pattern: /container-site/g,
    scope: 'src/',
    min: 12,
  },
  {
    id: 'R9-S',
    what: 'section rhythm utility in use on the homepage',
    pattern: /["'`]section[ "'`]/g,
    scope: 'src/components/sections/home/',
    min: 5,
  },
]

const EXTENSIONS = new Set(['.ts', '.tsx', '.css', '.mdx'])

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      yield* walk(full)
    } else if (EXTENSIONS.has(full.slice(full.lastIndexOf('.')))) {
      yield full
    }
  }
}

// Rules target real usage, not prose: blank out comment bodies (preserving line
// numbers) before matching. Handles /* */ blocks and whitespace-led // line tails.
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|\s)\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, ' '))
}

const violations = []
for (const full of walk(SRC)) {
  const file = relative(ROOT, full).split(sep).join('/')
  // Unit tests assert on rule strings/class names; the source rules govern components.
  if (/\.test\.(ts|tsx)$/.test(file)) continue
  const lines = stripComments(readFileSync(full, 'utf8')).split('\n')
  for (const rule of rules) {
    if (rule.allow(file)) continue
    lines.forEach((line, i) => {
      if (rule.pattern.test(line)) {
        violations.push(
          `${rule.id} ${file}:${i + 1} — ${rule.what}\n    ${line.trim()}`,
        )
      }
    })
  }
}

for (const check of PRESENCE) {
  let count = 0
  for (const full of walk(SRC)) {
    const file = relative(ROOT, full).split(sep).join('/')
    if (!file.startsWith(check.scope)) continue
    if (/\.test\.(ts|tsx)$/.test(file)) continue
    count += (readFileSync(full, 'utf8').match(check.pattern) ?? []).length
  }
  if (count < check.min) {
    violations.push(
      `${check.id} — ${check.what}: found ${count}, need >= ${check.min}`,
    )
  }
}

if (violations.length > 0) {
  console.error(`check:rules FAILED — ${violations.length} violation(s):\n`)
  for (const v of violations) console.error(v)
  process.exit(1)
}
console.log('check:rules OK — R1–R9 (incl. presence counts) clean across src/')
