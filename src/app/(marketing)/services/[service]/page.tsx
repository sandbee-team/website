import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  ProductDetail,
  ProductDetailSeo,
} from '@/components/catalog/product-detail'
import { catalogProduct } from '@/content/catalog'
import { SERVICE_COPY } from '@/components/services/service-copy'
import { ServicePage } from '@/components/services/service-page'
import { OfferingDetail } from '@/components/sections/offering-detail'
import { getOffering, getOfferingParams, getOfferings } from '@/lib/content'
import { buildPageMetadata } from '@/lib/seo/metadata'

/*
 * Service offering pages (ADR-0005; anatomy per spec §10, built 06b from the 05b
 * contracts). A service with deck copy in SERVICE_COPY renders the authored page,
 * indexable with contract metadata; a future service without a contract falls back to
 * the structural OfferingDetail (noindex). Unknown slugs resolve to notFound()
 * (dynamicParams is rejected under cacheComponents — ADR-0011 §7).
 */
export async function generateStaticParams() {
  const params = await getOfferingParams('service')
  return params.map(({ slug }) => ({ service: slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/services/[service]'>): Promise<Metadata> {
  const { service } = await params
  const offering = await getOffering('service', service)
  const current =
    service === 'gst-api'
      ? catalogProduct('gst')
      : service === 'whatsapp-sms-automation'
        ? catalogProduct('messaging')
        : undefined
  if (offering && current) {
    return buildPageMetadata({
      title:
        current.id === 'gst'
          ? 'Free GSTIN lookup API'
          : 'WhatsApp messaging API and panel',
      description: current.description,
      path: current.href,
    })
  }
  const copy = SERVICE_COPY[service]
  if (offering && copy) {
    return buildPageMetadata({
      title: copy.title,
      description: copy.description,
      path: `/services/${service}`,
    })
  }
  return {
    title: offering?.name,
    robots: { index: false, follow: false },
  }
}

export default async function ServiceOfferingPage({
  params,
}: PageProps<'/services/[service]'>) {
  const { service } = await params
  const offering = await getOffering('service', service)
  if (!offering) notFound()
  const current =
    service === 'gst-api'
      ? catalogProduct('gst')
      : service === 'whatsapp-sms-automation'
        ? catalogProduct('messaging')
        : undefined
  if (current)
    return (
      <>
        <ProductDetailSeo product={current} offering={offering} />
        <ProductDetail product={current} />
      </>
    )
  const copy = SERVICE_COPY[service]
  if (!copy) return <OfferingDetail offering={offering} />
  const siblings = (await getOfferings('service')).filter(
    (entry) => entry.id !== offering.id,
  )
  return <ServicePage offering={offering} copy={copy} siblings={siblings} />
}
