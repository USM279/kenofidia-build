import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/Services.css'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    num: '01',
    name: 'Food Photography',
    desc: 'Cinematic stills that translate flavour, texture, and atmosphere into images guests cannot ignore.',
    icon: '↗',
  },
  {
    num: '02',
    name: 'Menu Design',
    desc: 'Typographic menu systems that guide decisions, elevate perceived value, and reflect your identity.',
    icon: '↗',
  },
  {
    num: '03',
    name: 'Brand Identity',
    desc: 'Logo, colour, voice, and visual system built specifically for the hospitality world.',
    icon: '↗',
  },
  {
    num: '04',
    name: 'Social Strategy',
    desc: 'Content calendars, community management, and paid social designed to fill covers every service.',
    icon: '↗',
  },
  {
    num: '05',
    name: 'Video Production',
    desc: 'Short-form reels, brand films, and behind-the-scenes content crafted for modern platforms.',
    icon: '↗',
  },
  {
    num: '06',
    name: 'Website Design',
    desc: 'Reservation-optimised, mobile-first websites that convert browsers into booked guests.',
    icon: '↗',
  },
]

export default function Services() {
  const sectionRef = useRef(null)
  const headRef    = useRef(null)
  const cardsRef   = useRef([])

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
          scrollTrigger: {
            trigger: headRef.current,
            start: 'top 85%',
          }
        }
      )

      // Cards stagger
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="services" ref={sectionRef} className="services">
      <div className="services-inner">
        <div className="services-head">
          <p className="section-label">What we do</p>
          <h2 ref={headRef} className="services-title">
            {['Every', 'service,', 'one', 'vision.'].map((w, i) => (
              <span key={i} className="sw">
                <span className="sw-inner">{w}</span>
              </span>
            ))}
          </h2>
        </div>

        <div className="services-grid">
          {services.map((s, i) => (
            <article
              key={s.num}
              ref={el => cardsRef.current[i] = el}
              className="service-card"
              data-cursor-hover
            >
              <div className="service-card-reveal" />
              <div className="service-card-body">
                <span className="service-num">{s.num}</span>
                <h3 className="service-name">{s.name}</h3>
                <p className="service-desc">{s.desc}</p>
                <span className="service-arrow">{s.icon}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
