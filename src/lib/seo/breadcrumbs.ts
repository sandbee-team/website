import type { Breadcrumb } from '@/types/content'

// Breadcrumbs model (ADR-0011; consumed by the 04b BreadcrumbList JSON-LD builder and
// later page chrome). Pure function — no filesystem access, safe anywhere.

/**
 * Builds the home-rooted trail: buildBreadcrumbs([{name:'Products',href:'/products'},
 * {name:'POS',href:'/products/pos'}]) → Home › Products › POS.
 */
export function buildBreadcrumbs(
  trail: Array<{ name: string; href: string }>,
): Breadcrumb[] {
  return [{ name: 'Home', href: '/' }, ...trail]
}
