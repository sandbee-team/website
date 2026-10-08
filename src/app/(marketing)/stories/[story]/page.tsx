import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'

import ElectronTrackingOriginBody from '@/content/stories/electron-tracking-origin.mdx'
import { ButtonLink, TextLink } from '@/components/primitives'
import { Breadcrumbs, PageScaffold } from '@/components/site'
import { getStory, getStoryParams } from '@/lib/content'
import { buildBreadcrumbs } from '@/lib/seo/breadcrumbs'
import { breadcrumbListJsonLd, jsonLd, storyJsonLd } from '@/lib/seo/json-ld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { SITE_URL } from '@/lib/seo/site'

/*
 * Story pages (ADR-0005, spec §13) — built 06d from the 05c contract
 * (.memory/content/stories-electron-tracking-origin.md). The §13 body (problem →
 * existed → missing → engineered → reusable) lives in the story MDX and renders via
 * static import (04b pipeline); the §13 sections the reference cannot fill
 * (constraint · deployment/use · result/lesson) are ABSENT by Q9 default, never
 * invented. JSON-LD: BreadcrumbList only — Article/TechArticle stays scoped to blog
 * posts (ADR-0006 R5; contract note). A story without a body map entry keeps the
 * structural render, noindex. Unknown slugs resolve to notFound().
 */
const STORY_BODIES: Record<string, ComponentType> = {
  'electron-tracking-origin': ElectronTrackingOriginBody,
}

// Contract metadata per story (deck Title/Meta description, copy-pasted).
const STORY_META: Record<string, { title: string; description: string }> = {
  'electron-tracking-origin': {
    title: 'Building the missing pieces of desktop tracking',
    description:
      'A client needed application and web tracking that existing tools lacked. Sandbee built the missing cross-platform pieces — now becoming a reusable package.',
  },
}

export async function generateStaticParams() {
  return getStoryParams()
}

export async function generateMetadata({
  params,
}: PageProps<'/stories/[story]'>): Promise<Metadata> {
  const { story } = await params
  const entry = await getStory(story)
  const meta = STORY_META[story]
  if (entry && meta) {
    const base = buildPageMetadata({
      title: meta.title,
      description: meta.description,
      path: `/stories/${story}`,
      ogType: 'article',
      article: {
        publishedTime: entry.publishedAt,
        authors: ['Sandbee'],
      },
    })
    return base
  }
  return {
    title: entry?.title,
    robots: { index: false, follow: false },
  }
}

export default async function StoryPage({
  params,
}: PageProps<'/stories/[story]'>) {
  const { story } = await params
  const entry = await getStory(story)
  if (!entry) notFound()
  const Body = STORY_BODIES[story]
  const breadcrumbs = buildBreadcrumbs([
    { name: 'Stories', href: '/stories' },
    { name: entry.title, href: `/stories/${story}` },
  ])
  if (!Body) {
    // Future story without a wired body: structural render, noindex (metadata above).
    return (
      <div className="container-site section-sm">
        <Breadcrumbs trail={breadcrumbs} />
        <h1 className="type-hero mt-6">{entry.title}</h1>
        <p className="type-body mt-5 content-block">{entry.summary}</p>
      </div>
    )
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(breadcrumbListJsonLd(breadcrumbs)),
        }}
      />
      {/* TechArticle (06f F12 — the deferred story-type decision, org author Q18). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            storyJsonLd(
              entry,
              new URL(`/stories/${story}`, SITE_URL).toString(),
            ),
          ),
        }}
      />
      <PageScaffold
        experience="stories"
        kicker="Engineering story"
        title={entry.title}
        lede={entry.summary}
        breadcrumbs={<Breadcrumbs trail={breadcrumbs} />}
      >
        <p className="type-caption mt-3 text-ink-muted">
          {/* <time> per 06f F11 — machine-readable date, consistent with /blog. */}
          <time dateTime={entry.publishedAt}>{entry.publishedAt}</time>
        </p>
        {/* Grid break B4 (approved grid record, applied 07a/06f F3): body holds
            cols 3–9 on desktop; the artefact thread extends cols 10–12 as an aside.
            Below lg both stack full-width. */}
        <div className="grid-page mt-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-3">
            {/* §13 body from the MDX (h2 sections; allowlist styles the prose). */}
            <Body />
          </div>
          <aside
            aria-label="Related to this story"
            className="col-span-4 border-t border-line pt-6 md:col-span-8 lg:col-span-3 lg:col-start-10 lg:border-t-0 lg:pt-0"
          >
            {/* The artefact thread (graft 4): what this story produced. */}
            <p className="type-label text-ink-muted">What this produced</p>
            <ul className="type-body mt-3">
              <li className="mt-1">
                <TextLink href="/technology/electron-tracking">
                  See the package this became
                </TextLink>
              </li>
              <li className="mt-2">
                <TextLink href="/custom-technology">
                  How custom work becomes reusable technology
                </TextLink>
              </li>
            </ul>
            <div className="mt-6">
              <ButtonLink href="/contact">Describe the requirement</ButtonLink>
            </div>
          </aside>
        </div>
      </PageScaffold>
    </>
  )
}
