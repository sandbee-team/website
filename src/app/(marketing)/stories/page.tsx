import type { Metadata } from 'next'

import { TextLink } from '@/components/primitives'
import { PageScaffold } from '@/components/site'
import { getStories } from '@/lib/content'
import { buildBreadcrumbs } from '@/lib/seo/breadcrumbs'
import { breadcrumbListJsonLd, jsonLd } from '@/lib/seo/json-ld'
import { buildPageMetadata } from '@/lib/seo/metadata'

/*
 * Stories index — per the 05c contract (.memory/content/stories.md): lede with the
 * honesty rule as voice, loader-driven entries (one at launch — the index must read
 * complete at one entry), and the §9 pattern closer that keeps the page substantial.
 * Q9: no story may be invented; new entries come only from user-supplied facts.
 * INDEXABLE (lifted from the 04a placeholder state).
 */
export const metadata: Metadata = buildPageMetadata({
  title: 'Stories',
  description:
    'Engineering stories from Sandbee: real problems, the constraints around them, what was built, and what became reusable technology.',
  path: '/stories',
})

const breadcrumbs = buildBreadcrumbs([{ name: 'Stories', href: '/stories' }])

export default async function StoriesPage() {
  const stories = await getStories()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(breadcrumbListJsonLd(breadcrumbs)),
        }}
      />
      <PageScaffold
        experience="stories"
        kicker="Proof"
        title="Engineering stories"
        lede="Real problems, what existed, what was missing, what Sandbee engineered — and what became reusable. Stories stop where the facts stop."
      >
        <ul className="mt-10 content-block">
          {stories.map((story) => (
            <li key={story.id} className="border-b border-line py-5">
              <TextLink
                href={`/stories/${story.slug}`}
                className="type-title-sm"
              >
                {story.title}
              </TextLink>
              <p className="type-body mt-2 text-ink-muted">{story.summary}</p>
              <p className="type-caption mt-2 text-ink-muted">
                {/* <time> per 06f F11 — consistent date semantics with /blog. */}
                <time dateTime={story.publishedAt}>{story.publishedAt}</time>
              </p>
            </li>
          ))}
        </ul>
        {/* Standing closer (deck): the §9 pattern keeps the page complete at one entry. */}
        <section className="mt-12 content-block">
          <p className="type-body">
            A real client problem becomes a technical solution; the solution
            becomes reusable technology; the technology becomes a package,
            service or product.
          </p>
          <p className="type-body mt-4">
            <TextLink href="/technology">See what that produces</TextLink>
            {' · '}
            <TextLink href="/custom-technology">
              How custom work starts
            </TextLink>
          </p>
        </section>
      </PageScaffold>
    </>
  )
}
