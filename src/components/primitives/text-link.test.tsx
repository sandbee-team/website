import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TextLink } from './text-link'

describe('TextLink', () => {
  it('renders a crawlable <a href> with the underlined link class', () => {
    render(<TextLink href="/">Read the story</TextLink>)
    const link = screen.getByRole('link', { name: 'Read the story' })
    expect(link.getAttribute('href')).toBe('/')
    expect(link.className).toContain('link')
  })
})
