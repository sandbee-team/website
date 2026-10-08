import type { Metadata } from 'next'

import { PageScaffold } from '@/components/site'

// Legal placeholder (ADR-0005, Q8): published only when the user supplies entity data
// and source text — NEVER fabricated legal copy. noindex until then.
export const metadata: Metadata = {
  title: 'Terms',
  robots: { index: false, follow: false },
}

export default function TermsPage() {
  return (
    <PageScaffold
      experience="legal"
      kicker="Legal information"
      title="Terms"
      lede="The terms of service have not been published yet. For questions about a product or service, contact sandbee.team@gmail.com."
    />
  )
}
