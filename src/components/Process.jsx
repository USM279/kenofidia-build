import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supportingPhotos } from '../data/portfolio'
import '../styles/Process.css'
import { useLanguage } from '../i18n/useLanguage'

gsap.registerPlugin(ScrollTrigger)

const stepImages = [
  supportingPhotos[8].src,
  supportingPhotos[9].src,
  supportingPhotos[1].src,
  supportingPhotos[0].src,
  supportingPhotos[7].src,
]

export default function Process() {
  const sectionRef  = useRef(null)
  const headRef     = useRef(null)
  const stepRefs    = useRef([])
  const imgRefs     = useRef([])
  const stickyRef   = useRef(null)
  const { t } = useLanguage()
  const steps = useMemo(
    () => t.process.steps.map((step, index) => ({ ...step, img: stepImages[index] })),
    [t.process.steps],
  )

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
  }, [steps])

  return (
    <section id="process" ref={sectionRef} className="process">
      <div className="process-inner">
        <div className="process-left">
          <div className="process-head">
            <p className="section-label">{t.process.label}</p>
            <h2 ref={headRef} className="process-title">
              {t.process.title.map((w, i) => (
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
                  <img src={s.img} alt={s.title} loading="lazy" decoding="async" />
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
