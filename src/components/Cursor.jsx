import { useEffect, useRef } from 'react'
import '../styles/Cursor.css'

export default function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = window.innerWidth  / 2
    let mouseY = window.innerHeight / 2
    let ringX  = mouseX
    let ringY  = mouseY
    let rafId

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const tick = () => {
      // dot follows instantly
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`

      // ring lags behind
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`

      rafId = requestAnimationFrame(tick)
    }

    const onEnterHoverable = () => ring.classList.add('cursor-ring--expanded')
    const onLeaveHoverable = () => ring.classList.remove('cursor-ring--expanded')

    const bindHoverables = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnterHoverable)
        el.addEventListener('mouseleave', onLeaveHoverable)
      })
    }

    window.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(tick)
    bindHoverables()

    // Re-bind when DOM changes (SPA navigations / lazy renders)
    const observer = new MutationObserver(bindHoverables)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
