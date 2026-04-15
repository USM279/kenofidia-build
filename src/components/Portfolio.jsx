import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ZoomParallax } from './ui/zoom-parallax'
import '../styles/Portfolio.css'

gsap.registerPlugin(ScrollTrigger)

const images = [
  {
    src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
    alt: 'Maison Dorée',
  },
  {
    src: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
    alt: 'Osteria Notte',
  },
  {
    src: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
    alt: 'The Larder Co.',
  },
  {
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
    alt: 'Kombu Izakaya',
  },
  {
    src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
    alt: 'Saffron & Salt',
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
    alt: 'Restaurant Interior',
  },
  {
    src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
    alt: 'Fine Dining',
  },
]

export default function Portfolio() {
  const sectionRef = useRef(null)
  const headRef    = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headRef.current.querySelectorAll('.sw-inner')
      gsap.fromTo(words,
        { y: '110%' },
        {
          y: '0%',
          duration: 1,
          ease: 'power4.out',
          stagger: 0.07,
          scrollTrigger: { trigger: headRef.current, start: 'top 85%' }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="work" ref={sectionRef} className="portfolio">
      <div className="portfolio-inner">
        <div className="portfolio-head">
          <p className="section-label">Selected Work</p>
          <h2 ref={headRef} className="portfolio-title">
            {['Stories', 'that', 'fill', 'tables.'].map((w, i) => (
              <span key={i} className="sw">
                <span className="sw-inner">{w}</span>
              </span>
            ))}
          </h2>
        </div>
      </div>

      <ZoomParallax images={images} />
    </section>
  )
}
