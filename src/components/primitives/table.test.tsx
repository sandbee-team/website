import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { IndexRow, Table, Td, Th } from './table'

describe('Table', () => {
  it('renders a semantic table with an accessible caption', () => {
    render(
      <Table caption="Offerings index">
        <thead>
          <tr>
            <Th>Nº</Th>
            <Th>Offering</Th>
          </tr>
        </thead>
        <tbody>
          <IndexRow index="01">
            <Td>First entry</Td>
          </IndexRow>
        </tbody>
      </Table>,
    )
    const table = screen.getByRole('table', { name: 'Offerings index' })
    expect(table).toBeDefined()
    expect(screen.getAllByRole('columnheader')).toHaveLength(2)
    expect(screen.getByText('01').className).toContain('type-code')
  })

  it('rules horizontally only — no vertical borders on cells', () => {
    render(
      <Table caption="Rules check">
        <tbody>
          <tr>
            <Td>Cell</Td>
          </tr>
        </tbody>
      </Table>,
    )
    const cell = screen.getByRole('cell')
    expect(cell.className).toContain('border-b')
    // No left/right border utilities (border-line is the colour token, not a side).
    expect(cell.className).not.toMatch(/\bborder-[lr](?:-\d+)?(?=\s|$)/)
  })
})
