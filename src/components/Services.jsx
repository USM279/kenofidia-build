import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/Services.css'
import { useLanguage } from '../i18n/useLanguage'

gsap.registerPlugin(ScrollTrigger)

export default function Services() {
  const sectionRef = useRef(null)
  const headRef    = useRef(null)
  const listRef    = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading words
      const words = headRef.current.querySelectorAll('.sw-inner')
      gsap.fromTo(words,
        { y: '110%' },
        {
          y: '0%',
          duration: 1,
          ease: 'power4.out',
          stagger: 0.07,
          scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
        }
      )

      // List items stagger
      const items = listRef.current.querySelectorAll('.services-reveal-item')
      gsap.fromTo(items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: listRef.current, start: 'top 80%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="services" ref={sectionRef} className="services">
      <div className="services-inner">
        <div className="services-head">
          <p className="section-label">{t.services.label}</p>
          <h2 ref={headRef} className="services-title">
            {t.services.title.map((w, i) => (
              <span key={i} className="sw">
                <span className="sw-inner">{w}</span>
              </span>
            ))}
          </h2>
        </div>

        <div ref={listRef} className="services-reveal-list">
          {t.services.items.map((s, i) => (
            <div key={i} className="services-reveal-item">
              <div className="service-text-item">
                <h3>{s.text}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
