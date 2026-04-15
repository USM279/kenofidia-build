import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/Clients.css'

gsap.registerPlugin(ScrollTrigger)

const clients = [
  'Maison Dorée',
  'Osteria Notte',
  'The Larder Co.',
  'Kombu Izakaya',
  'Saffron & Salt',
  'Blackwood Brasserie',
  'La Petite Cour',
  'Hearth & Ember',
  'Kōji House',
  'Dune Bistro',
]

export default function Clients() {
  const sectionRef = useRef(null)
  const headRef    = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headRef.current.querySelectorAll('.sw-inner')
      gsap.fromTo(words,
        { y: '110%' },
        {
          y: '0%', duration: 1, ease: 'power4.out', stagger: 0.07,
          scrollTrigger: { trigger: headRef.current, start: 'top 85%' }
        }
      )

      gsap.fromTo(sectionRef.current.querySelectorAll('.client-name'),
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="clients" ref={sectionRef} className="clients">
      <div className="clients-inner">
        <div className="clients-head">
          <p className="section-label">Our Clients</p>
          <h2 ref={headRef} className="clients-title">
            {['Trusted by', 'the finest.'].map((w, i) => (
              <span key={i} className="sw clients-title-line">
                <span className="sw-inner">{w}</span>
              </span>
            ))}
          </h2>
        </div>

        <div className="clients-grid">
          {clients.map((name, i) => (
            <div key={i} className="client-name" data-cursor-hover>
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
