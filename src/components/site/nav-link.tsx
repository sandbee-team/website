'use client'
// Client leaf by necessity: aria-current="page" needs the live pathname, which a
// persistent (server) layout cannot know. The only client component in the site shell
// besides the header bee. Visual states (colour, current underline) live in the header
// module keyed on [aria-current]; this component owns semantics and the target size.

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'

export function NavLink({
  href,
  className,
  ...props
}: ComponentProps<typeof Link>) {
  const pathname = usePathname()
  const current =
    pathname === href ||
    (typeof href === 'string' &&
      href !== '/' &&
      pathname.startsWith(`${href}/`))
  return (
    <Link
      {...props}
      href={href}
      aria-current={current ? 'page' : undefined}
      className={['type-ui inline-flex min-h-11 items-center', className]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
