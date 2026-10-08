import { describe, expect, it } from 'vitest'

import { buildBreadcrumbs } from './breadcrumbs'

describe('buildBreadcrumbs', () => {
  it('roots every trail at Home', () => {
    expect(
      buildBreadcrumbs([
        { name: 'Products', href: '/products' },
        { name: 'POS', href: '/products/pos' },
      ]),
    ).toEqual([
      { name: 'Home', href: '/' },
      { name: 'Products', href: '/products' },
      { name: 'POS', href: '/products/pos' },
    ])
  })

  it('returns just Home for an empty trail', () => {
    expect(buildBreadcrumbs([])).toEqual([{ name: 'Home', href: '/' }])
  })
})
