import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/Stats.css'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 140,  suffix: '+', label: 'Restaurants Served' },
  { value: 8,    suffix: 'yr', label: 'Years of Experience' },
  { value: 3.2,  suffix: 'M', label: 'Impressions Generated' },
  { value: 98,   suffix: '%', label: 'Client Retention' },
]

export default function Stats() {
  const sectionRef = useRef(null)
  const countRefs  = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      countRefs.current.forEach((el, i) => {
        if (!el) return
        const target = stats[i].value
        const isFloat = String(target).includes('.')

        gsap.fromTo({ val: 0 },
          { val: 0 },
          {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
              el.textContent = isFloat
                ? this.targets()[0].val.toFixed(1)
                : Math.round(this.targets()[0].val)
            },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true,
            }
          }
        )
      })

      gsap.fromTo(sectionRef.current.querySelectorAll('.stat-item'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="stats">
      <div className="stats-inner">
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            <div className="stat-value">
              <span ref={el => countRefs.current[i] = el}>0</span>
              <span className="stat-suffix">{s.suffix}</span>
            </div>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
