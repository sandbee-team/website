// @ts-check
import createMDX from '@next/mdx'

// ADR-0007 §1/§9: fully static intent enforced by Cache Components; Turbopack only —
// no webpack() config anywhere in this file. .mjs because the remark/rehype ecosystem is ESM-only.
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  typedRoutes: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  // experimental.inlineCss was TRIED and REVERTED (04b, 2026-09-01): it removed the
  // render-blocking stylesheet but moved simulated LCP by <10ms — lantern's estimate is
  // dominated by the framework-script pessimistic graph, not CSS. An experimental flag
  // with no measured benefit stays out; details in the 04b 05-review.
  // Redirects policy stub (phase-04b): empty until a route actually moves. Policy —
  // renamed/retired public routes get a permanent (308) redirect here, one hop only
  // (never chains), added in the same phase that moves the route; entries cite the
  // phase/ADR that moved it. Never redirect placeholder routes that were never public.
  async redirects() {
    return []
  },
}

// ADR-0007 §2: plugins referenced as serializable strings — Turbopack cannot receive JS
// functions, so no function-valued options may ever be added here.
const withMDX = createMDX({
  options: {
    // Metadata is parsed by gray-matter + Zod in src/lib/content.
    // The compiler only needs to recognize and omit YAML frontmatter.
    remarkPlugins: ['remark-gfm', 'remark-frontmatter'],
    rehypePlugins: [
      'rehype-slug',
      'rehype-autolink-headings',
      [
        'rehype-pretty-code',
        {
          theme: { light: 'github-light', dark: 'github-dark' },
          keepBackground: false,
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)
