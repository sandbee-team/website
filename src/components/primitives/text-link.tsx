import type { Route } from 'next'
import Link from 'next/link'
import type { ComponentProps } from 'react'

/*
 * In-copy link: always a real <a> via next/link, always underlined (the .link class —
 * 4px offset, 1px line that thickens on hover; colour never changes, so the affordance
 * survives colour-vision differences and the underline is never the only cue).
 * Generic over the href so typedRoutes keeps validating dynamic hrefs through the
 * wrapper (Next docs pattern — ComponentProps<typeof Link> alone erases the route type).
 */
export function TextLink<T extends string>({
  className,
  href,
  ...props
}: Omit<ComponentProps<typeof Link>, 'href'> & { href: Route<T> }) {
  return (
    <Link
      {...props}
      href={href}
      className={['link', className].filter(Boolean).join(' ')}
    />
  )
}
