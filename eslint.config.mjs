// ESLint flat config (ADR-0007 §9 targeted ESLint 10; pinned to 9.x because
// eslint-plugin-react 7.37.5 caps at eslint ^9.7 — see plan/phase-01-foundation/05-review.md
// finding 2). `next lint` was removed in Next 16 — the `lint` script calls the ESLint CLI
// directly against this file.
import { defineConfig, globalIgnores } from 'eslint/config'
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

export default defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'coverage/**',
    'node_modules/**',
    'playwright-report/**',
    'test-results/**',
    '.lighthouseci/**',
    'next-env.d.ts',
    'handoff/**',
    '.claude/**',
    '.memory/**',
  ]),
  coreWebVitals,
  typescript,
  prettier,
])
