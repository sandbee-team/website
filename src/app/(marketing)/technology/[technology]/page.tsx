import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  ProductDetail,
  ProductDetailSeo,
} from '@/components/catalog/product-detail'
import { catalogProduct } from '@/content/catalog'
import { OfferingDetail } from '@/components/sections/offering-detail'
import { PACKAGE_COPY } from '@/components/technology/package-copy'
import { PackagePage } from '@/components/technology/package-page'
import { getOffering, getOfferingParams, getOfferings } from '@/lib/content'
import { buildPageMetadata } from '@/lib/seo/metadata'

/*
 * Package/SDK/API offering pages (ADR-0005; anatomy per spec §11, built 06c from the
 * 05b contracts). A package with deck copy in PACKAGE_COPY renders the authored page,
 * indexable with contract metadata; a future package without a contract falls back to
 * the structural OfferingDetail (noindex). Unknown slugs resolve to notFound()
 * (dynamicParams is rejected under cacheComponents — ADR-0011 §7).
 */
export async function generateStaticParams() {
  const params = await getOfferingParams('package')
  return params.map(({ slug }) => ({ technology: slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/technology/[technology]'>): Promise<Metadata> {
  const { technology } = await params
  const offering = await getOffering('package', technology)
  if (offering && technology === 'aadhaar-pan-ocr') {
    const current = catalogProduct('ocr')
    return buildPageMetadata({
      title: 'Free document OCR package for Node.js',
      description: current.description,
      path: current.href,
    })
  }
  const copy = PACKAGE_COPY[technology]
  if (offering && copy) {
    return buildPageMetadata({
      title: copy.title,
      description: copy.description,
      path: `/technology/${technology}`,
    })
  }
  return {
    title: offering?.name,
    robots: { index: false, follow: false },
  }
}

export default async function TechnologyOfferingPage({
  params,
}: PageProps<'/technology/[technology]'>) {
  const { technology } = await params
  const offering = await getOffering('package', technology)
  if (!offering) notFound()
  if (technology === 'aadhaar-pan-ocr') {
    const current = catalogProduct('ocr')
    return (
      <>
        <ProductDetailSeo product={current} offering={offering} />
        <ProductDetail product={current} />
      </>
    )
  }
  const copy = PACKAGE_COPY[technology]
  if (!copy) return <OfferingDetail offering={offering} />
  const siblings = (await getOfferings('package')).filter(
    (entry) => entry.id !== offering.id,
  )
  return <PackagePage offering={offering} copy={copy} siblings={siblings} />
}
