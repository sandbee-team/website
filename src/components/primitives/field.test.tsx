import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TextAreaField, TextField } from './field'

describe('TextField', () => {
  it('associates the label with the control', () => {
    render(<TextField id="email" label="Email" type="email" />)
    const input = screen.getByLabelText('Email')
    expect(input.tagName).toBe('INPUT')
  })

  it('ties hint text in via aria-describedby', () => {
    render(<TextField id="name" label="Name" hint="As it should appear." />)
    const input = screen.getByLabelText('Name')
    expect(input.getAttribute('aria-describedby')).toBe('name-hint')
    expect(screen.getByText('As it should appear.').id).toBe('name-hint')
  })

  it('announces errors in text, never colour-only', () => {
    render(
      <TextField id="email" label="Email" error="Enter an email address." />,
    )
    const input = screen.getByLabelText('Email')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe('email-error')
    const alert = screen.getByRole('alert')
    expect(alert.textContent).toBe('Error — Enter an email address.')
  })
})

describe('TextAreaField', () => {
  it('associates the label and error with the textarea', () => {
    render(
      <TextAreaField id="message" label="Message" error="Say something." />,
    )
    const textarea = screen.getByLabelText('Message')
    expect(textarea.tagName).toBe('TEXTAREA')
    expect(textarea.getAttribute('aria-invalid')).toBe('true')
    expect(textarea.getAttribute('aria-describedby')).toBe('message-error')
  })
})
