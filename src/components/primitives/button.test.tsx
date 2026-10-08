import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button, ButtonLink } from './button'

describe('Button', () => {
  it('renders a real <button> with an accessible name', () => {
    render(<Button>Contact Sandbee</Button>)
    expect(
      screen.getByRole('button', { name: 'Contact Sandbee' }),
    ).toBeDefined()
  })

  it('primary variant carries the solid primary treatment', () => {
    render(<Button>Go</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('btn')
    expect(button.className).toContain('btn-primary')
  })

  it('secondary variant is the outlined action', () => {
    render(<Button variant="secondary">Alt</Button>)
    expect(screen.getByRole('button').className).toContain('btn-secondary')
  })

  it('quiet variant is the clear text action (underlined by its class)', () => {
    render(<Button variant="quiet">Secondary</Button>)
    expect(screen.getByRole('button').className).toContain('btn-quiet')
  })

  it('large size adds the hero sizing class', () => {
    render(<Button size="lg">Big</Button>)
    expect(screen.getByRole('button').className).toContain('btn-lg')
  })

  it('disabled buttons stay real disabled buttons', () => {
    render(<Button disabled>Off</Button>)
    expect(screen.getByRole('button').hasAttribute('disabled')).toBe(true)
  })
})

describe('ButtonLink', () => {
  it('renders a real <a href> for navigation', () => {
    render(<ButtonLink href="/">Home</ButtonLink>)
    const link = screen.getByRole('link', { name: 'Home' })
    expect(link.getAttribute('href')).toBe('/')
    expect(link.className).toContain('btn-primary')
  })
})
