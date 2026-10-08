import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  ProductDetail,
  ProductDetailSeo,
} from '@/components/catalog/product-detail'
import { OfferingDetail } from '@/components/sections/offering-detail'
import { catalogProduct } from '@/content/catalog'
import { getOffering, getOfferingParams } from '@/lib/content'
import { buildPageMetadata } from '@/lib/seo/metadata'

/*
 * Product offering pages (ADR-0005; anatomy per spec §9). POS renders the authored 06b
 * page from the 05b contract; any future product falls back to the structural
 * OfferingDetail (noindex) until it gets its own contract + build. Unknown slugs
 * resolve to notFound() (dynamicParams is rejected under cacheComponents — ADR-0011 §7).
 */
export async function generateStaticParams() {
  const params = await getOfferingParams('product')
  return params.map(({ slug }) => ({ product: slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/products/[product]'>): Promise<Metadata> {
  const { product } = await params
  const offering = await getOffering('product', product)
  if (offering && product === 'pos') {
    const current = catalogProduct('pos')
    return buildPageMetadata({
      title: 'Sandbee POS — setup in your Vercel account',
      description: current.description,
      path: current.href,
    })
  }
  return {
    title: offering?.name,
    robots: { index: false, follow: false },
  }
}

export default async function ProductPage({
  params,
}: PageProps<'/products/[product]'>) {
  const { product } = await params
  const offering = await getOffering('product', product)
  if (!offering) notFound()
  if (offering.id === 'pos') {
    const current = catalogProduct('pos')
    return (
      <>
        <ProductDetailSeo product={current} offering={offering} />
        <ProductDetail product={current} />
      </>
    )
  }
  return <OfferingDetail offering={offering} />
}
