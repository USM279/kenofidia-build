import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/CTA.css'
import { useLanguage } from '../i18n/useLanguage'

gsap.registerPlugin(ScrollTrigger)

export default function CTA() {
  const sectionRef = useRef(null)
  const lineRef    = useRef(null)
  const headRef    = useRef(null)
  const subRef     = useRef(null)
  const emailRef   = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' }
      })

      tl.fromTo(lineRef.current,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.9, ease: 'power3.inOut', transformOrigin: 'top' }
      )
      .fromTo(headRef.current.querySelectorAll('.sw-inner'),
        { y: '110%' },
        { y: '0%', duration: 1.1, ease: 'power4.out', stagger: 0.08 },
        '-=0.5'
      )
      .fromTo(subRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(emailRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.5'
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="cta">
      <div ref={lineRef} className="cta-line" aria-hidden="true" />
      <div className="cta-inner">
        <h2 ref={headRef} className="cta-headline">
          {t.cta.title.map((w, i) => (
            <span key={i} className="sw cta-line-wrap">
              <span className="sw-inner">{w}</span>
            </span>
          ))}
        </h2>
        <p ref={subRef} className="cta-sub">
          {t.cta.bodyLine1}<br />
          {t.cta.bodyLine2}
        </p>
        <a
          ref={emailRef}
          href="mailto:info@kinofedia.nl"
          className="cta-email"
          data-cursor-hover
        >
          info@kinofedia.nl
          <span className="cta-email-arrow">↗</span>
        </a>
      </div>
    </section>
  )
}
