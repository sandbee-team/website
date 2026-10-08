// Vitest stand-in for any imported .mdx module (aliased in vitest.config.mts).
// Real MDX rendering is covered by `next build` and the Playwright e2e suite.
export default function MdxStub() {
  return null
}
