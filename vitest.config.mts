import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: [
      // Vitest runs outside React Server Components; the real 'server-only' module throws on import.
      {
        find: 'server-only',
        replacement: fileURLToPath(
          new URL('./src/test/stubs/server-only.ts', import.meta.url),
        ),
      },
      // MDX is compiled by @next/mdx in the app build; unit tests stub any .mdx import.
      {
        find: /^.*\.mdx$/,
        replacement: fileURLToPath(
          new URL('./src/test/stubs/mdx-component.tsx', import.meta.url),
        ),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
  },
})
