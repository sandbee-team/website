import type { ComponentProps, ReactNode } from 'react'

/*
 * Notice: form-level feedback (plan §8 /contact: clear submission feedback). Three kinds
 * share one shape — a surface panel with a 4px leading rule — and the kind is carried by
 * TEXT (the caller's copy) plus the rule colour, never colour alone. The role is chosen by
 * the caller: `status` for success (polite), `alert` for errors (assertive).
 */
export function Notice({
  kind = 'info',
  className,
  children,
  ...props
}: ComponentProps<'p'> & {
  kind?: 'info' | 'success' | 'error'
  children: ReactNode
}) {
  return (
    <p
      {...props}
      className={[
        'notice type-body',
        kind === 'success' ? 'notice-success' : '',
        kind === 'error' ? 'notice-error' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </p>
  )
}
