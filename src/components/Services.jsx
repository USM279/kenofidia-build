import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RevealImageList } from './ui/reveal-images'
import '../styles/Services.css'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    
    text: 'Food Photography',
    desc: 'Cinematic stills that translate flavour, texture, and atmosphere into images guests cannot ignore.',
    images: [
      { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80', alt: 'Food Photography' },
      { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', alt: 'Food Photography 2' },
    ],
  },
  {
    
    text: 'Menu Design',
    desc: 'Typographic menu systems that guide decisions, elevate perceived value, and reflect your identity.',
    images: [
      { src: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=80', alt: 'Menu Design' },
      { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80', alt: 'Menu Design 2' },
    ],
  },
  {
    
    text: 'Brand Identity',
    desc: 'Logo, colour, voice, and visual system built specifically for the hospitality world.',
    images: [
      { src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&q=80', alt: 'Branding' },
      { src: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400&q=80', alt: 'Branding 2' },
    ],
  },
  {
    
    text: 'Social Strategy',
    desc: 'Content calendars, community management, and paid social designed to fill covers every service.',
    images: [
      { src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80', alt: 'Social Media' },
      { src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80', alt: 'Social Media 2' },
    ],
  },
  {
    
    text: 'Video Production',
    desc: 'Short-form reels, brand films, and behind-the-scenes content crafted for modern platforms.',
    images: [
      { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80', alt: 'Video' },
      { src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', alt: 'Video 2' },
    ],
  },
  {
      
    text: 'Website Design',
    desc: 'Reservation-optimised, mobile-first websites that convert browsers into booked guests.',
    images: [
      { src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', alt: 'Web Design' },
      { src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80', alt: 'Web Design 2' },
    ],
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
              <RevealImageList items={[s]} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
