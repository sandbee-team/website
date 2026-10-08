'use client'

import { useEffect } from 'react'

/*
 * Atlas interaction island (07c task 6): plain-DOM rung — the ONLY interaction JS the
 * map needs. All highlighting is CSS (globals.css) and every node is a real `<a>`, so
 * this island is deletable without information loss: it only adds roving arrow-key
 * navigation between map nodes (tab order already reaches each one). No library, no
 * motion — nothing here is gated on prefers-reduced-motion because focus movement is
 * an accessibility affordance, not an animation.
 */
export function AtlasKeyboard() {
  useEffect(() => {
    const svg = document.querySelector<SVGSVGElement>('svg[data-atlas-map]')
    if (!svg) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key))
        return
      const origin = event.target as Element | null
      const current = origin?.closest('a[data-atlas-node]')
      if (!current) return
      const nodes = Array.from(
        svg.querySelectorAll<SVGAElement>('a[data-atlas-node]'),
      )
      const index = nodes.indexOf(current as SVGAElement)
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
    svg.addEventListener('keydown', onKeyDown)
    return () => svg.removeEventListener('keydown', onKeyDown)
  }, [])
  return null
}
