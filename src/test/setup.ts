import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// next/font is transformed by Next at build time; JSDOM exercises semantic markup.
vi.mock('next/font/local', () => ({
  default: () => ({ variable: 'test-font', className: 'test-font' }),
}))

// Vitest runs without `globals: true`, so Testing Library's automatic cleanup never
// registers itself — without this, renders accumulate across tests in the same file.
afterEach(cleanup)
