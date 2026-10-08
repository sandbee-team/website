import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SkipLink } from './skip-link'

describe('SkipLink', () => {
  it('targets the layout main landmark and carries the hide-until-focus class', () => {
    render(<SkipLink />)
    const link = screen.getByRole('link', { name: 'Skip to content' })
    expect(link.getAttribute('href')).toBe('#main-content')
    expect(link.className).toBe('skip-link')
  })
})
