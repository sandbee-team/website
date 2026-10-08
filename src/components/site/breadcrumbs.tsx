import type { Route } from 'next'

import { TextLink } from '@/components/primitives'
import type { Breadcrumb } from '@/types/content'

/*
 * Visible breadcrumb trail for nested pages (spec §15 / contract rule: breadcrumbs on
 * all nested pages, mirrored in BreadcrumbList JSON-LD — the page composes both from
 * the same buildBreadcrumbs() trail). The last crumb is the current page: plain text
 * with aria-current, never a self-link. Trail hrefs are runtime strings from the
 * breadcrumbs helper, so the one Route cast lives here, inside the wrapper
 * (typedRoutes discipline: casts at the boundary, never scattered in pages).
 */
export function Breadcrumbs({ trail }: { trail: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="type-caption flex flex-wrap items-center gap-2 text-ink-muted">
        {trail.map((crumb, index) => {
          const isCurrent = index === trail.length - 1
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">›</span> : null}
              {isCurrent ? (
                <span aria-current="page" className="text-ink">
                  {crumb.name}
                </span>
              ) : (
                <TextLink href={crumb.href as Route}>{crumb.name}</TextLink>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
