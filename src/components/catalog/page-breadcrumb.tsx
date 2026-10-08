import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { buildBreadcrumbs } from '@/lib/seo/breadcrumbs'
import { breadcrumbListJsonLd, jsonLd } from '@/lib/seo/json-ld'

export function PageBreadcrumb({ name, href }: { name: string; href: string }) {
  const items = buildBreadcrumbs([{ name, href }])
  return (
    <div className="catalog-breadcrumb">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(breadcrumbListJsonLd(items)),
        }}
      />
      <Breadcrumbs trail={items} />
    </div>
  )
}
