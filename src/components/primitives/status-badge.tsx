import type { ComponentProps } from 'react'

/*
 * Status badge for offering status labels (ADR-0005; exact label vocabulary lands with
 * Q6). The system's one pill (plan §5: pills only for compact tags): 12px semibold,
 * line-strong hairline, surface fill. Status is information, not a signal, so it never
 * uses honey. Non-interactive, so no target-size rules.
 */
export function StatusBadge({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      {...props}
      className={['badge status-badge', className].filter(Boolean).join(' ')}
    />
  )
}
