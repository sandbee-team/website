'use client'

import { useEffect } from 'react'

/*
 * Generic plain-DOM roving-focus island (07d; pattern established by the 07c Atlas
 * keyboard island): ArrowRight/ArrowLeft move focus between the matched items
 * (wrapping), Home/End jump to the ends. Tab order already reaches every item — this
 * only ADDS an affordance, so the island is deletable without information loss.
 * No library, no motion, no reduce gate (focus movement is an accessibility
 * affordance, not an animation).
 */
export function RovingFocus({
  container,
  items,
}: {
  /** CSS selector for the element that hosts the keydown listener. */
  container: string
  /** CSS selector (within the container) for the focusable items. */
  items: string
}) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(container)
    if (!root) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key))
        return
      const origin = event.target as Element | null
      const current = origin?.closest(items)
      if (!current) return
      const nodes = Array.from(root.querySelectorAll<HTMLElement>(items))
      const index = nodes.indexOf(current as HTMLElement)
      if (index < 0) return
      let next = index
      if (event.key === 'ArrowRight') next = (index + 1) % nodes.length
      if (event.key === 'ArrowLeft')
        next = (index - 1 + nodes.length) % nodes.length
      if (event.key === 'Home') next = 0
      if (event.key === 'End') next = nodes.length - 1
      event.preventDefault()
      nodes[next].focus()
    }
    root.addEventListener('keydown', onKeyDown)
    return () => root.removeEventListener('keydown', onKeyDown)
  }, [container, items])
  return null
}
