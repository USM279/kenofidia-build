import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/Services.css'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    text: 'Food Photography',
    desc: 'Cinematic stills that translate flavour, texture, and atmosphere into images guests cannot ignore.',
  },
  {
    text: 'Menu Design',
    desc: 'Typographic menu systems that guide decisions, elevate perceived value, and reflect your identity.',
  },
  {
    text: 'Brand Identity',
    desc: 'Logo, colour, voice, and visual system built specifically for the hospitality world.',
  },
  {
    text: 'Social Strategy',
    desc: 'Content calendars, community management, and paid social designed to fill covers every service.',
  },
  {
    text: 'Video Production',
    desc: 'Short-form reels, brand films, and behind-the-scenes content crafted for modern platforms.',
  },
  {
    text: 'Website Design',
    desc: 'Reservation-optimised, mobile-first websites that convert browsers into booked guests.',
  },
]

export default function Services() {
  const sectionRef = useRef(null)
  const headRef    = useRef(null)
  const listRef    = useRef(null)

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
          <p className="section-label">What we do</p>
          <h2 ref={headRef} className="services-title">
            {['Every', 'service,', 'one', 'vision.'].map((w, i) => (
              <span key={i} className="sw">
                <span className="sw-inner">{w}</span>
              </span>
            ))}
          </h2>
        </div>

        <div ref={listRef} className="services-reveal-list">
          {services.map((s, i) => (
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
