import type { ComponentProps, ReactNode } from 'react'

/*
 * Form field primitives: every control has a programmatically associated <label>; hint
 * and error text are tied in via aria-describedby; errors are announced (role="alert"),
 * written in text with an explicit "Error —" prefix, and reinforced by a 2px error
 * border — never colour-only. Controls use the 8px control radius (plan §5) and clear
 * the 44px target size. Visual states (hover, focus, invalid, disabled) live in
 * globals.css (.field-control) so every form shares them.
 *
 * CALLER CONTRACT (03a review finding): role="alert" announces only when the error text
 * is INSERTED into a live DOM (e.g. after a useActionState submit) — statically
 * server-rendered errors do not fire live regions. A full-page-reload form must also move
 * focus to the first invalid control (or an error summary) on load; that behaviour
 * belongs to the form that composes these fields (contact-form.tsx), not to this primitive.
 */

type FieldShellProps = {
  id: string
  label: string
  hint?: string
  error?: string
  children: (describedBy: string | undefined, invalid: boolean) => ReactNode
}

function FieldShell({ id, label, hint, error, children }: FieldShellProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="type-caption text-ink-muted">
          {hint}
        </p>
      ) : null}
      {children(describedBy, Boolean(error))}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="type-caption field-error font-medium"
        >
          Error — {error}
        </p>
      ) : null}
    </div>
  )
}

type TextFieldProps = Omit<
  ComponentProps<'input'>,
  'id' | 'aria-describedby' | 'aria-invalid'
> & {
  id: string
  label: string
  hint?: string
  error?: string
}

export function TextField({
  id,
  label,
  hint,
  error,
  className,
  ...props
}: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      {(describedBy, invalid) => (
        <input
          {...props}
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={['field-control', className].filter(Boolean).join(' ')}
        />
      )}
    </FieldShell>
  )
}

type TextAreaFieldProps = Omit<
  ComponentProps<'textarea'>,
  'id' | 'aria-describedby' | 'aria-invalid'
> & {
  id: string
  label: string
  hint?: string
  error?: string
}

export function TextAreaField({
  id,
  label,
  hint,
  error,
  className,
  ...props
}: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      {(describedBy, invalid) => (
        <textarea
          {...props}
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={['field-control min-h-32', className]
            .filter(Boolean)
            .join(' ')}
        />
      )}
    </FieldShell>
  )
}
