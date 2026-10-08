import type { ComponentProps } from 'react'

/*
 * Structural divider: a real <hr> (separator semantics), a 1px line-colour hairline.
 */
export function Rule({ className, ...props }: ComponentProps<'hr'>) {
  return (
    <hr
      {...props}
      className={['border-t border-line', className].filter(Boolean).join(' ')}
    />
  )
}
