import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PageScaffold } from './page-scaffold'

describe('PageScaffold', () => {
  it('renders kicker, one h1 (type-hero) and the lede', () => {
    render(
      <PageScaffold kicker="Kicker" title="Page title" lede="A lede line.">
        <p>Body</p>
      </PageScaffold>,
    )
    const h1 = screen.getByRole('heading', { level: 1, name: 'Page title' })
    expect(h1.className).toContain('type-hero')
    expect(screen.getByText('Kicker').className).toContain('type-kicker')
    expect(screen.getByText('A lede line.')).toBeDefined()
    expect(screen.getByText('Body')).toBeDefined()
  })

  it('omits optional slots cleanly and never renders its own main', () => {
    const { container } = render(<PageScaffold title="Only title" />)
    expect(container.querySelector('main')).toBeNull()
    expect(container.querySelectorAll('h1')).toHaveLength(1)
  })
})
