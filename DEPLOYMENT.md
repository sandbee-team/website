# Deploy Sandbee

For the new EC2/Docker option use [EC2 deployment](docs/EC2-DEPLOYMENT.md). The Vercel instructions below remain supported. Choose one production host for sandbee.in.

## 1. Extract and verify on your PC

Extract the ZIP. Open the **sandbee-website** folder containing `package.json`.
Install the current Node.js **22.x** release and Git. Do not copy `node_modules` from another PC.

```sh
npm ci
npm run check
npm start
```

Open http://localhost:3000. Check `/`, `/products`, `/products/pos`, `/technology`,
`/company` and `/contact`. The ZIP's `HANDOFF-MANIFEST.json` contains per-file SHA-256 hashes;
the separate `.zip.sha256` file verifies the archive before extraction.

## 2. Push the project to your Git repository

Create an empty GitHub repository. Run these commands **inside sandbee-website**;
replace `YOUR_REPOSITORY_URL` with the real HTTPS or SSH URL from GitHub:

```sh
git init -b main
git add .
git status --short
git commit -m "Prepare Sandbee website for Vercel"
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

The staged files should include `src/`, `public/`, `scripts/`, `tests/`, configuration files,
`package.json` and `package-lock.json`. `.claude/`, `.memory/`, `plan/`, private reference docs,
`.env.local`, reports, ZIPs and build folders must remain unstaged. Do not force-add them.
Keep the original ZIP separately: ignored history will not return when you clone Git.

## 3. Import in Vercel

In Vercel choose **Add New → Project**, import the repository, then deploy with:

| Setting | Value |
| --- | --- |
| Framework | Next.js |
| Root directory | Repository root (`./`) |
| Node.js | 22.x |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | Leave the Next.js default; do not set `out` or `dist` |

`vercel.json` already sets the framework and install/build commands. No database,
Docker image, custom server or static-export setting is required. The future contact
form uses a Server Action, so keep the normal Next.js deployment.

Environment variables (Project Settings → Environment Variables):

| Name | Current setup |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://sandbee.in` (also the built-in default) |
| `CONTACT_TRANSPORT_URL` | Leave unset: API deferred by the owner |
| `CONTACT_TRANSPORT_TOKEN` | Leave unset; optional bearer token for a future API |

Never put API secrets in `NEXT_PUBLIC_*` variables. Redeploy after environment changes.
Add `sandbee.in` in Vercel's Domains settings and apply the exact DNS records Vercel displays.
If the primary domain changes, update `NEXT_PUBLIC_SITE_URL` and redeploy so canonical URLs,
sitemap links and social metadata follow the chosen domain.

## 4. Current launch content and deferred work

- Owner-confirmed identity: **Sandbee**; public email: **sandbee.team@gmail.com**.
- Contact works through an email link. It opens the visitor's email app and does not send automatically.
- No contact API is configured. When one is ready, set an HTTPS `CONTACT_TRANSPORT_URL` and redeploy.
  It receives POST JSON `{ name, email, message, submittedAt }`; a 2xx response must mean the API
  accepted delivery. An optional token is sent as `Authorization: Bearer ...`. Requests time out
  after eight seconds and do not follow redirects. Test a real enquiry and verify receipt before
  announcing form availability. The receiving API must enforce its own shared rate limit:
  the app's in-memory guard only covers one warm Vercel function instance.
- **Privacy/Terms are not approved or complete.** The routes say so and remain noindex.
  Add approved text in `src/app/(marketing)/privacy/page.tsx` and `terms/page.tsx` before treating
  those pages as final policies; then update `src/lib/seo/routes.ts` and their robots metadata.
- Three real product/developer guides are published. Unpublished fixtures remain excluded; no customer testimonials were invented.
- Existing visual performance targets remain under review; see docs/research/2026-09-28-daylight-validation.md. The clean launch ZIP excludes private agent memory and old planning files.

## Final live check

Verify HTTPS and the chosen domain, internal links, desktop/mobile layouts, the email link,
`/robots.txt`, `/sitemap.xml`, `/opengraph-image` and a missing URL returning 404.
Check Vercel build/function logs. A local build verifies the package; it does not verify your
Git account, Vercel project settings, DNS or email inbox. No deployment is performed by this ZIP.

Official references: [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs),
[Git deployments](https://vercel.com/docs/git),
[Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions),
[Environment variables](https://vercel.com/docs/environment-variables).
