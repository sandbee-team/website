'use client'
import { useEffect, useRef } from 'react'

export function Sculpture({
  kind,
  className,
}: { kind?: string; className?: string } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const story = canvas?.closest<HTMLElement>(
      kind ? '[data-experience-art]' : '[data-sculpture-story]',
    )
    if (
      !canvas ||
      !story ||
      typeof matchMedia !== 'function' ||
      typeof IntersectionObserver === 'undefined' ||
      typeof ResizeObserver === 'undefined'
    )
      return
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    let disposed = false,
      visible = false,
      paused = document.documentElement.dataset.motion === 'paused',
      frame = 0,
      starting = false
    let contextLost = false
    let arrival = 0
    let target = 0,
      progress = 0,
      x = 0,
      y = 0,
      tx = 0,
      ty = 0
    let top = 0,
      range = 1
    const disclosure = kind ? story.querySelector('details') : null
    let renderer: ReturnType<
      typeof import('./sculpture-renderer').createSculpture
    > = null
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }
    const render = () => {
      frame = 0
      if (
        contextLost ||
        !renderer ||
        disposed ||
        !visible ||
        document.hidden ||
        paused ||
        media.matches
      )
        return
      progress += (target - progress) * 0.1
      x += (tx - x) * 0.09
      y += (ty - y) * 0.09
      arrival += (1 - arrival) * 0.065
      renderer.draw(progress, x, y, arrival)
      canvas.dataset.progress = progress.toFixed(3)
      if (
        1 - arrival > 0.001 ||
        Math.abs(target - progress) > 0.0003 ||
        Math.abs(tx - x) + Math.abs(ty - y) > 0.001
      )
        frame = requestAnimationFrame(render)
    }
    const request = () => {
      if (
        !frame &&
        renderer &&
        visible &&
        !paused &&
        !media.matches &&
        !document.hidden
      )
        frame = requestAnimationFrame(render)
    }
    const scroll = () => {
      target = disclosure?.open
        ? 1
        : Math.max(0, Math.min(1, (window.scrollY - top) / range))
      request()
    }
    const resize = () => {
      top = story.getBoundingClientRect().top + window.scrollY
      range = Math.max(
        1,
        kind ? story.offsetHeight : story.offsetHeight - innerHeight,
      )
      renderer?.resize()
      scroll()
      if (renderer && (paused || media.matches)) renderer.draw(progress, 0, 0)
    }
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      tx = (event.clientX / innerWidth) * 2 - 1
      ty = (event.clientY / innerHeight) * 2 - 1
      request()
    }
    const resetPointer = () => {
      tx = 0
      ty = 0
      request()
    }
    const visibility = () => (document.hidden ? stop() : request())
    const motion = (event: Event) => {
      paused = Boolean(
        (event as CustomEvent<{ paused: boolean }>).detail?.paused,
      )
      canvas.dataset.paused = String(paused)
      if (paused) stop()
      else request()
    }
    const preference = () => {
      if (media.matches) {
        stop()
        canvas.dataset.render = 'fallback'
      } else if (renderer) {
        canvas.dataset.render = 'webgl'
        request()
      } else void start()
    }
    const lost = (event: Event) => {
      event.preventDefault()
      contextLost = true
      stop()
      canvas.dataset.render = 'fallback'
    }
    const restored = () => {
      contextLost = false
      renderer?.dispose()
      renderer = null
      void start()
    }
    async function start() {
      if (disposed || media.matches || renderer || starting) return
      starting = true
      try {
        const { create } = kind
          ? await import('../../site/experience-scene')
          : await import('./sculpture-scene')
        if (disposed || media.matches) return
        renderer = create(canvas!, kind)
        if (!renderer) {
          canvas!.dataset.render = 'fallback'
          return
        }
        resize()
        progress = target
        renderer.draw(progress, 0, 0, arrival)
        canvas!.dataset.render = 'webgl'
        request()
      } catch {
        if (!disposed) canvas!.dataset.render = 'fallback'
      } finally {
        starting = false
      }
    }
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
      if (visible) {
        void start()
        request()
      } else stop()
    })
    observer.observe(story)
    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(story)
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', resize)
    story.addEventListener('pointermove', pointer, { passive: true })
    story.addEventListener('pointerleave', resetPointer)
    window.addEventListener('sandbee:motion', motion)
    document.addEventListener('visibilitychange', visibility)
    media.addEventListener('change', preference)
    canvas.addEventListener('webglcontextlost', lost)
    canvas.addEventListener('webglcontextrestored', restored)
    disclosure?.addEventListener('toggle', scroll)
    return () => {
      disposed = true
      stop()
      observer.disconnect()
      sizeObserver.disconnect()
      renderer?.dispose()
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('resize', resize)
      story.removeEventListener('pointermove', pointer)
      story.removeEventListener('pointerleave', resetPointer)
      window.removeEventListener('sandbee:motion', motion)
      document.removeEventListener('visibilitychange', visibility)
      media.removeEventListener('change', preference)
      canvas.removeEventListener('webglcontextlost', lost)
      canvas.removeEventListener('webglcontextrestored', restored)
      disclosure?.removeEventListener('toggle', scroll)
    }
  }, [kind])
  return (
    <canvas
      ref={canvasRef}
      className={className}
      data-render="fallback"
      data-experience-canvas={kind}
      aria-hidden="true"
    />
  )
}
