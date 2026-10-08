import {
  ProductDetail,
  ProductDetailSeo,
} from '@/components/catalog/product-detail'
import { catalogProduct } from '@/content/catalog'
import type { Offering } from '@/types/content'

/** Compatibility entry point; the current catalog owns POS copy and delivery facts. */
export function PosPage({ offering }: { offering: Offering }) {
  const product = catalogProduct('pos')
  return (
    <>
      <ProductDetailSeo product={product} offering={offering} />
      <ProductDetail product={product} />
    </>
  )
}
