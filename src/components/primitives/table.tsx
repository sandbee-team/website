import type { ComponentProps, ReactNode } from 'react'

/*
 * Index/table primitives: ruled horizontally only (1px line hairlines, a stronger rule
 * under the header, no vertical rules, no zebra fills), tabular numbering. Semantic
 * <table> with a required caption (visually hidden by default) so every index is
 * announced. Wide tables scroll inside their own container, never the page body.
 */

export function Table({
  caption,
  captionVisible = false,
  className,
  children,
  ...props
}: ComponentProps<'table'> & {
  caption: string
  captionVisible?: boolean
  children: ReactNode
}) {
  return (
    <div className="overflow-x-auto">
      <table
        {...props}
        className={['w-full border-collapse text-left', className]
          .filter(Boolean)
          .join(' ')}
      >
        <caption
          className={
            captionVisible
              ? 'type-caption pb-3 text-left text-ink-muted'
              : 'sr-only'
          }
        >
          {caption}
        </caption>
        {children}
      </table>
    </div>
  )
}

export function Th({ className, ...props }: ComponentProps<'th'>) {
  return (
    <th
      {...props}
      scope="col"
      className={[
        'type-caption border-b border-line-strong py-2.5 pr-6 font-semibold text-ink-muted',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

export function Td({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      {...props}
      className={['border-b border-line py-3.5 pr-6 align-top', className]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

/* Index row: tabular row number in the first cell. */
export function IndexRow({
  index,
  className,
  children,
  ...props
}: ComponentProps<'tr'> & { index: string; children: ReactNode }) {
  return (
    <tr {...props} className={className}>
      <Td className="type-code w-12 text-ink-muted tabular-nums">{index}</Td>
      {children}
    </tr>
  )
}
