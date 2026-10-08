import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatusBadge } from './status-badge'

describe('StatusBadge', () => {
  it('renders the compact pill tag — no honey', () => {
    render(<StatusBadge>Status label</StatusBadge>)
    const badge = screen.getByText('Status label')
    expect(badge.tagName).toBe('SPAN')
    expect(badge.className).toContain('badge')
    expect(badge.className).toContain('status-badge')
    expect(badge.className).not.toContain('honey')
  })
})
