import type { Metadata } from 'next'

import { PageScaffold } from '@/components/site'

// Legal placeholder (ADR-0005, Q8): published only when the user supplies entity data
// and source text — NEVER fabricated legal copy. noindex until then.
export const metadata: Metadata = {
  title: 'Privacy',
  robots: { index: false, follow: false },
}

export default function PrivacyPage() {
  return (
    <PageScaffold
      experience="legal"
      kicker="Legal information"
      title="Privacy"
      lede="The privacy policy has not been published yet. For privacy questions, contact sandbee.team@gmail.com."
    />
  )
}
