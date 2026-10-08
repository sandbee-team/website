import type { Route } from 'next'
import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

/*
 * Action primitives. `<Button>` is a real <button> for actions; `<ButtonLink>` is a real
 * <a> (next/link) for navigation styled as a call to action — never a div with a handler.
 * Variants (plan §5): primary = solid Primary, secondary = outlined, quiet = clear text
 * link. Hover, focus, pressed and disabled states are designed together in globals.css
 * (.btn-*), and invert on `[data-surface='night']` (primary becomes the honey brand
 * moment). Min target 44×44px (above the ADR-0009 24px floor); `size="lg"` = 52px for
 * the hero's primary action.
 */

type Variant = 'primary' | 'secondary' | 'quiet'
type Size = 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  quiet: 'btn btn-quiet',
}

function classes(variant: Variant, size: Size, className?: string) {
  return [variants[variant], size === 'lg' ? 'btn-lg' : '', className]
    .filter(Boolean)
    .join(' ')
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ComponentProps<'button'> & { variant?: Variant; size?: Size }) {
  return <button {...props} className={classes(variant, size, className)} />
}

// Generic over the href so typedRoutes keeps validating dynamic hrefs through the
// wrapper (Next docs pattern — ComponentProps<typeof Link> alone erases the route type).
export function ButtonLink<T extends string>({
  variant = 'primary',
  size = 'md',
  className,
  children,
  href,
  ...props
}: Omit<ComponentProps<typeof Link>, 'href'> & {
  href: Route<T>
  variant?: Variant
  size?: Size
  children: ReactNode
}) {
  return (
    <Link {...props} href={href} className={classes(variant, size, className)}>
      {children}
    </Link>
  )
}
