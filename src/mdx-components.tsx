import type { MDXComponents } from 'mdx/types'

import { Callout } from '@/components/primitives/callout'
import { CodeBlock } from '@/components/primitives/code-block'
import { Diagram } from '@/components/primitives/diagram'
import { Figure } from '@/components/primitives/figure'

/*
 * MDX component allowlist (ADR-0007 §2, ADR-0011 §8): exactly Figure, Callout, Code
 * (the CodeBlock primitive) and Diagram — each maps 1:1 to a portable rich-text block,
 * so a future CMS swap re-implements four components, not a bespoke zoo. Content files
 * must NOT import components themselves (check:rules R8); these names are injected.
 * Fenced code blocks keep the rehype-pretty-code pipeline (plain pre/code elements).
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Native <a> (MDX hrefs may be external, so the route-typed TextLink doesn't fit);
    // same underlined affordance as the TextLink primitive. External links get rel
    // hygiene — internal ones stay plain.
    a: (props) => (
      <a
        {...props}
        rel={
          /^https?:/.test(props.href ?? '') ? 'noopener noreferrer' : undefined
        }
        className="link"
      />
    ),
    // Prose element styling: Tailwind preflight strips default heading/list styles, so
    // unmapped elements would render as bare body text. Type ramp per the live record.
    h2: (props) => <h2 {...props} className="type-section mt-12" />,
    h3: (props) => <h3 {...props} className="type-title-sm mt-8" />,
    p: (props) => <p {...props} className="type-body mt-4" />,
    ul: (props) => <ul {...props} className="type-body mt-4 list-disc pl-5" />,
    ol: (props) => (
      <ol {...props} className="type-body mt-4 list-decimal pl-5" />
    ),
    li: (props) => <li {...props} className="mt-1.5" />,
    Callout,
    Code: CodeBlock,
    Diagram,
    Figure,
  }
}
