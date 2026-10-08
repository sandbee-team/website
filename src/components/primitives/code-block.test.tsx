import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CodeBlock } from './code-block'

describe('CodeBlock', () => {
  it('is a labelled, keyboard-focusable scrollable region on the night surface', () => {
    render(<CodeBlock code="npm install" label="Install command" />)
    const region = screen.getByRole('region', { name: 'Install command' })
    expect(region.getAttribute('tabindex')).toBe('0')
    expect(region.dataset.surface).toBe('night')
    expect(region.className).toContain('overflow-x-auto')
  })

  it('renders the code inside <pre><code>', () => {
    render(<CodeBlock code="npm install" label="Install command" />)
    const code = screen.getByText('npm install')
    expect(code.tagName).toBe('CODE')
    expect(code.parentElement?.tagName).toBe('PRE')
  })
})
