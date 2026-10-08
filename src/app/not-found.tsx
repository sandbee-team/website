import { TextLink } from '@/components/primitives'
import { PageScaffold } from '@/components/site'

// Root 404 (spec §8 shell scope). Renders inside the site shell like every page.
// Known limitation (03b review): the tab title stays the layout default — not-found.tsx
// supports no metadata export (only the experimental global-not-found does, per the
// Next 16 docs), and a React-hoisted <title> loses to the metadata-rendered one
// (verified empirically). Revisit when global-not-found stabilises.
export default function NotFound() {
  return (
    <PageScaffold
      experience="legal"
      kicker="404"
      title="Page not found"
      lede="The address does not match any page on this site."
    >
      <p className="type-body mt-6">
        <TextLink href="/">Go to the homepage</TextLink>
      </p>
    </PageScaffold>
  )
}
