import type { ProductId } from '@/content/catalog'

export function ProductIcon({
  id,
  className,
}: {
  id: ProductId
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {id === 'gst' ? (
        <>
          <path d="M8 4h11l6 6v18H8zM19 4v7h6M12 16h9M12 21h5" />
          <path d="m4 13 3 3 5-5" />
        </>
      ) : null}
      {id === 'ocr' ? (
        <>
          <path d="M4 11V5h6M22 5h6v6M28 22v6h-6M10 28H4v-6M10 10h12M10 15h9M10 21h12M2 18h28" />
        </>
      ) : null}
      {id === 'messaging' ? (
        <>
          <path d="M27 14c0 7-5 11-12 11l-9 3 2-7c-2-2-3-4-3-7C5 8 9 4 16 4s11 4 11 10Z" />
          <path d="M11 12h10M11 17h7" />
        </>
      ) : null}
      {id === 'pos' ? (
        <>
          <rect x="3" y="5" width="26" height="18" rx="3" />
          <path d="M12 23v5M20 23v5M8 28h16M8 10h7M8 14h4M20 10h4M20 15h4M20 19h4" />
        </>
      ) : null}
    </svg>
  )
}

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} />
    </svg>
  )
}
