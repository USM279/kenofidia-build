import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supportingPhotos } from '../data/portfolio'
import '../styles/Process.css'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Discovery',
    desc: 'We immerse ourselves in your brand — your kitchen, your story, your ambitions. This session shapes everything that follows.',
    img: supportingPhotos[8].src,
  },
  {
    num: '02',
    title: 'Creative Direction',
    desc: 'We develop a visual language: colour, mood, styling, locations, and art direction unique to your concept.',
    img: supportingPhotos[9].src,
  },
  {
    num: '03',
    title: 'Production',
    desc: 'Shoot days, styling, and video production executed with editorial-grade precision on your premises or studio.',
    img: supportingPhotos[1].src,
  },
  {
    num: '04',
    title: 'Post & Delivery',
    desc: 'Retouching, colour grading, and final delivery across all formats — web, print, social — organised and on time.',
    img: supportingPhotos[0].src,
  },
  {
    num: '05',
    title: 'Growth & Iteration',
    desc: 'We track performance, refine content strategy, and evolve your visual identity as your restaurant grows.',
    img: supportingPhotos[7].src,
  },
]

export default function Process() {
  const sectionRef  = useRef(null)
  const headRef     = useRef(null)
  const stepRefs    = useRef([])
  const imgRefs     = useRef([])
  const stickyRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      const words = headRef.current.querySelectorAll('.sw-inner')
      gsap.fromTo(words,
        { y: '110%' },
        {
          y: '0%', duration: 1, ease: 'power4.out', stagger: 0.07,
          scrollTrigger: { trigger: headRef.current, start: 'top 85%' }
        }
      )

      // Steps fade in
      stepRefs.current.forEach((step) => {
        if (!step) return
        gsap.fromTo(step,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 80%' }
          }
        )
      })

      // Image crossfade as steps scroll
      imgRefs.current.forEach((img, i) => {
        if (!img) return
        ScrollTrigger.create({
          trigger: stepRefs.current[i],
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => activateImage(i),
          onEnterBack: () => activateImage(i),
        })
      })

      function activateImage(activeIdx) {
        imgRefs.current.forEach((img, i) => {
          if (!img) return
          gsap.to(img, {
            opacity: i === activeIdx ? 1 : 0,
            duration: 0.6,
            ease: 'power2.inOut',
          })
        })
      }

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="process" ref={sectionRef} className="process">
      <div className="process-inner">
        <div className="process-left">
          <div className="process-head">
            <p className="section-label">How We Work</p>
            <h2 ref={headRef} className="process-title">
              {['A process', 'built for', 'precision.'].map((w, i) => (
                <span key={i} className="sw process-title-line">
                  <span className="sw-inner">{w}</span>
                </span>
              ))}
            </h2>
          </div>

          <ol className="process-steps" role="list">
            {steps.map((s, i) => (
              <li
                key={s.num}
                ref={el => stepRefs.current[i] = el}
                className="process-step"
              >
                <div className="process-step-top">
                  <span className="process-step-num">{s.num}</span>
                  <h3 className="process-step-title">{s.title}</h3>
                </div>
                <p className="process-step-desc">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="process-right">
          <div ref={stickyRef} className="process-sticky">
            <div className="process-img-stack">
              {steps.map((s, i) => (
                <div
                  key={i}
                  ref={el => imgRefs.current[i] = el}
                  className="process-img-frame"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <img src={s.img} alt={s.title} loading="lazy" />
                </div>
              ))}
              <div className="process-img-border" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
