# Sandbee website

Launch review: [29 September 2026 glass landing and deployment evidence](docs/LAUNCH-REVIEW-2026-09-29.md).


Next.js website for Sandbee. Start with [DEPLOYMENT.md](DEPLOYMENT.md) for the
ZIP → your PC → GitHub → Vercel workflow.

## Run locally

Install Node.js **22.x**, then open this folder in a terminal:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. To check the production build:

```sh
npm run check
npm start
```

## Where to edit

- Pages: `src/app/(marketing)/`.
- Current products, names, pricing models and Store URL: `src/content/catalog.ts`.
- Homepage, product previews and reusable catalog UI: `src/components/catalog/`.
- Latest light/glass design: [direction and image sources](docs/research/2026-09-28-daylight-glass.md), [validation](docs/research/2026-09-28-daylight-validation.md).
- Research and integration boundaries: [website review](docs/research/2026-09-25-website-direction.md).
- Offering and story metadata: `src/content/`.
- Contact/legal identity: `src/config/site-identity.ts`.
- Colours and typography tokens: `src/app/globals.css`.
- Shared page styling: `src/components/site/experience.module.css`.
- Fonts, images and licences: `public/`.
- Contact API integration: `src/lib/forms/deliver.ts` and `.env.example`.

## Verification

`npm run check` runs lint, design rules, Linux filename-case checks, unit tests and build.
Browser checks require `npx playwright install chromium`, then `npx playwright test`.
The public contact page prepares an email with the selected product and validated fields. It
does not report delivery until a configured transport actually delivers a message. Without
JavaScript, direct email links remain available; the composer cannot submit personal data in a URL.
Use Chrome DevTools Lighthouse for optional performance checks. The old Lighthouse CI dependency
was removed from the application package because its unused tooling dependencies had advisories.

## Handoff history

The ZIP includes `.claude/`, `.memory/`, `plan/` and the original reference documents.
They are local working material and are ignored by Git and Vercel. Claude's hooks need Bash
(Git for Windows supplies it); none of those tools is needed to build or deploy the website.
Real environment files, personal Claude settings, credentials, dependencies, build output
and temporary reports are excluded from the ZIP. Original asset/font licences are retained.

On Windows, `npm run package:handoff` creates a ZIP and SHA-256 checksum in `handoff/`.
It refuses to overwrite an existing archive; pass a new name with
`powershell -File scripts/package-handoff.ps1 -OutputName another-handoff.zip`.
