import {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from 'react'
import type { Experience } from './experience-art'
import styles from './experience.module.css'

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(node))
    return textOf(node.props.children)
  return ''
}

/*
 * Page intro template: the consistent frame every non-home page opens with — kicker,
 * one <h1>, optional lede — followed by the content slot. Server component; pages must
 * NOT render their own <main> (the root layout owns the landmark). Heading outline
 * stays: h1 here, h2+ in children. The intro sits on a ruled block so listing, detail,
 * reading and utility pages share one rhythm (plan §8).
 */
export function PageScaffold({
  kicker,
  title,
  lede,
  children,
  experience = 'company',
  breadcrumbs,
}: {
  kicker?: string
  title: string
  lede?: string
  children?: ReactNode
  experience?: Experience
  breadcrumbs?: ReactNode
}) {
  const chapters: { id: string; title: string }[] = []
  const content = Children.map(children, (child) => {
    if (
      !isValidElement<{ children?: ReactNode; id?: string }>(child) ||
      child.type !== 'section'
    )
      return child
    const heading = Children.toArray(child.props.children).find(
      (node) => isValidElement(node) && node.type === 'h2',
    ) as ReactElement<{ children?: ReactNode }> | undefined
    if (!heading) return child
    const id = child.props.id || `chapter-${chapters.length + 1}`
    chapters.push({ id, title: textOf(heading.props.children) })
    return cloneElement(child, { id })
  })
  const quiet = experience === 'legal'
  return (
    <div
      className={`page-scaffold container-site section-sm ${styles.page} ${quiet ? styles.quiet : ''}`}
      data-experience={experience}
    >
      {breadcrumbs}
      <header className={styles.intro}>
        <div className={styles.copy}>
          {kicker ? (
            <p className={`type-kicker ${styles.kicker}`}>{kicker}</p>
          ) : null}
          <h1 className={`type-hero ${styles.title}`}>{title}</h1>
          {lede ? <p className={`type-lede ${styles.lede}`}>{lede}</p> : null}
          {children ? (
            <a className={styles.introLink} href="#page-content">
              Explore this page <span aria-hidden="true">↓</span>
            </a>
          ) : null}
        </div>
      </header>
      {chapters.length > 1 ? (
        <nav className={styles.index} aria-label="On this page">
          {chapters.map((chapter, index) => (
            <a key={chapter.id} href={`#${chapter.id}`}>
              <span aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              {chapter.title}
            </a>
          ))}
        </nav>
      ) : null}
      <div id="page-content" className={styles.body} tabIndex={-1}>
        {content}
      </div>
    </div>
  )
}
