// Preserve the product selected in a public CTA when the optional transport is configured.
'use client'
import { useSearchParams } from 'next/navigation'
import { CATALOG } from '@/content/catalog'
import { ContactForm } from './contact-form'

export function TransportEnquiry() {
  const requested = useSearchParams().get('product')
  const product = CATALOG.find(entry => entry.id === requested)
  return <ContactForm product={product?.id}/>
}
