import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Rule } from './rule'

describe('Rule', () => {
  it('renders an <hr> with separator semantics and the line hairline', () => {
    render(<Rule />)
    const rule = screen.getByRole('separator')
    expect(rule.tagName).toBe('HR')
    expect(rule.className).toContain('border-line')
  })
})
