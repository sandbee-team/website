import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const pathname = vi.hoisted(() => ({ value: '/' }))
vi.mock('next/navigation', () => ({
  usePathname: () => pathname.value,
}))

import { NavLink } from './nav-link'

describe('NavLink', () => {
  it('marks the current route with aria-current="page"', () => {
    pathname.value = '/products'
    render(<NavLink href="/products">Products</NavLink>)
    expect(
      screen
        .getByRole('link', { name: 'Products' })
        .getAttribute('aria-current'),
    ).toBe('page')
  })

  it('leaves other routes unmarked', () => {
    pathname.value = '/company'
    render(<NavLink href="/products">Products</NavLink>)
    expect(
      screen
        .getByRole('link', { name: 'Products' })
        .getAttribute('aria-current'),
    ).toBeNull()
  })
})
