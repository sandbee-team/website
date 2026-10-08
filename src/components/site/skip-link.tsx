/*
 * Skip link (spec §26, ADR-0009 §1): first focusable element on every page, jumps to
 * the layout's <main id="main-content">. Styled entirely by the .skip-link class in
 * globals.css — sr-only + chamfer utilities fight over clip-path in the utility sort
 * order (03b visual-QA finding), so the hidden state is an off-viewport translate that
 * slides the ink action block into view on focus.
 */
export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to content
    </a>
  )
}
