import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/Testimonial.css'

gsap.registerPlugin(ScrollTrigger)

export default function Testimonial() {
  const sectionRef = useRef(null)
  const quoteMarkRef = useRef(null)
  const quoteRef   = useRef(null)
  const authorRef  = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        }
      })

      tl.fromTo(quoteMarkRef.current,
        { opacity: 0, scale: 0.5, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }
      )
      .fromTo(quoteRef.current.querySelectorAll('.sw-inner'),
        { y: '110%' },
        { y: '0%', duration: 1, ease: 'power4.out', stagger: 0.06 },
        '-=0.3'
      )
      .fromTo(authorRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.4'
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const quoteWords = '"Working with Kenofidia transformed how guests perceive us before they even walk through the door."'.split(' ')

  return (
    <section ref={sectionRef} className="testimonial">
      <div className="testimonial-inner">
        <div ref={quoteMarkRef} className="testimonial-quotemark" aria-hidden="true">
          &ldquo;
        </div>

        <blockquote>
          <p ref={quoteRef} className="testimonial-quote">
            {quoteWords.map((word, i) => (
              <span key={i} className="sw">
                <span className="sw-inner">{word}</span>
              </span>
            ))}
          </p>

          <footer ref={authorRef} className="testimonial-author">
            <span className="testimonial-author-name">Marco de Luca</span>
            <span className="testimonial-author-role">Owner, Maison Dorée London</span>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
