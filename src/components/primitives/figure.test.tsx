import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Figure } from './figure'

describe('Figure', () => {
  it('renders <figure> with a visible <figcaption>', () => {
    render(
      <Figure caption="How the pieces connect.">
        <svg role="img" aria-label="Example diagram" />
      </Figure>,
    )
    const figure = screen.getByRole('figure')
    expect(figure.tagName).toBe('FIGURE')
    const caption = screen.getByText('How the pieces connect.')
    expect(caption.tagName).toBe('FIGCAPTION')
  })
})
