import type { ComponentProps, ReactNode } from 'react'

/*
 * Figure primitive: semantic <figure> + <figcaption>. The caption is real visible text
 * (13px caption, ink-muted — 5.72:1 on canvas), so diagrams and images always carry a
 * machine-readable explanation (spec §16). Content (img/svg/diagram) comes as children;
 * informative images keep their own alt text.
 */
export function Figure({
  caption,
  className,
  children,
  ...props
}: ComponentProps<'figure'> & { caption: string; children: ReactNode }) {
  return (
    <figure {...props} className={className}>
      {children}
      <figcaption className="type-caption mt-3 text-ink-muted">
        {caption}
      </figcaption>
    </figure>
  )
}
