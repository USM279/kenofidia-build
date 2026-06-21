import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { portfolioMedia } from '../data/portfolio'
import '../styles/Portfolio.css'

gsap.registerPlugin(ScrollTrigger)

const collections = [
  {
    id: 'restaurant-videos',
    index: '01',
    eyebrow: 'Restaurant Films',
    title: 'Stories in motion.',
    intro: 'Short-form films, service stories, and campaign pieces made inside real restaurants.',
    kind: 'video',
    format: 'portrait-video',
    items: portfolioMedia.restaurantVideos,
  },
  {
    id: 'restaurant-photos',
    index: '02',
    eyebrow: 'Food & Restaurant Photography',
    title: 'Made to be tasted with the eyes.',
    intro: 'Food, people, and atmosphere photographed with an editorial eye and a sense of place.',
    kind: 'gallery',
    format: 'photo-masonry',
    items: portfolioMedia.photos,
  },
  {
    id: 'ai-images',
    index: '03',
    eyebrow: 'AI Images',
    title: 'The imagined table.',
    intro: 'Conceptual image-making where art direction, food culture, and generative craft meet.',
    kind: 'gallery',
    format: 'mixed-gallery',
    tone: 'ai',
    items: portfolioMedia.aiImages,
  },
  {
    id: 'ai-videos',
    index: '04',
    eyebrow: 'AI Films',
    title: 'Impossible scenes, set in motion.',
    intro: 'Experimental motion work created with AI and finished through the same cinematic lens.',
    kind: 'video',
    format: 'portrait-video-three',
    tone: 'ai',
    items: portfolioMedia.aiVideos,
  },
  {
    id: 'flyers',
    index: '05',
    eyebrow: 'Flyer Design',
    title: 'Campaigns you can hold.',
    intro: 'Graphic pieces for openings, events, offers, and moments that deserve a visual identity.',
    kind: 'flyer',
    format: 'flyer-three',
    items: portfolioMedia.flyers,
  },
  {
    id: 'behind-the-scenes',
    index: '06',
    eyebrow: 'Behind the Scenes',
    title: 'The work behind the work.',
    intro: 'A closer look at the sets, hands, decisions, and happy accidents behind every finished frame.',
    kind: 'video',
    format: 'mixed-video',
    items: portfolioMedia.behindScenes,
  },
]

function PlayMark() {
  return (
    <span className="media-play" aria-hidden="true">
      <svg viewBox="0 0 24 24" role="presentation"><path d="M9 7.2 17 12l-8 4.8V7.2Z" /></svg>
    </span>
  )
}

function VideoCard({ item, isAi }) {
  const naturalAspect = item.width && item.height
    ? { '--media-aspect': `${item.width} / ${item.height}` }
    : undefined
  const cardClass = `video-card video-card--${item.format}${naturalAspect ? ' video-card--natural' : ''}`
  const content = (
    <>
      <div className="video-card-media" style={naturalAspect}>
        <img src={item.poster} alt={item.posterAlt} loading="lazy" />
        <div className="media-shade" />
        <PlayMark />
        {isAi && <span className="media-badge">AI generated</span>}
      </div>
      <div className="media-caption">
        <div>
          <p>{item.category}</p>
          <h3>{item.title}</h3>
        </div>
        <span className="media-action">{item.youtubeUrl ? 'Watch on YouTube ↗' : 'YouTube link pending'}</span>
      </div>
    </>
  )

  return item.youtubeUrl ? (
    <a className={cardClass} href={item.youtubeUrl} target="_blank" rel="noreferrer" data-cursor-hover>
      {content}
    </a>
  ) : (
    <article className={`${cardClass} video-card--pending`}>{content}</article>
  )
}

function GalleryCard({ item, isAi, index }) {
  const naturalAspect = item.width && item.height
    ? { '--media-aspect': `${item.width} / ${item.height}` }
    : undefined

  return (
    <figure className={`gallery-card gallery-card--${(index % 5) + 1}${naturalAspect ? ' gallery-card--natural' : ''}`}>
      <div className="gallery-card-media" style={naturalAspect}>
        <img src={item.src} alt={item.alt} loading="lazy" />
        <div className="media-shade" />
        {isAi && <span className="media-badge">AI generated</span>}
      </div>
      <figcaption className="media-caption">
        <div>
          <p>{item.category}</p>
          <h3>{item.title}</h3>
        </div>
        <span className="media-index">{String(index + 1).padStart(2, '0')}</span>
      </figcaption>
    </figure>
  )
}

function FlyerCard({ item, index }) {
  const naturalAspect = item.width && item.height
    ? { '--media-aspect': `${item.width} / ${item.height}` }
    : undefined

  return (
    <figure className={`flyer-card${naturalAspect ? ' flyer-card--natural' : ''}`}>
      <div className="flyer-card-frame">
        <img src={item.src} alt={item.alt} loading="lazy" style={naturalAspect} />
      </div>
      <figcaption className="media-caption">
        <div>
          <p>{item.category}</p>
          <h3>{item.title}</h3>
        </div>
        <span className="media-index">{String(index + 1).padStart(2, '0')}</span>
      </figcaption>
    </figure>
  )
}

function Collection({ collection }) {
  const isAi = collection.tone === 'ai'

  return (
    <section id={collection.id} className={`portfolio-collection${isAi ? ' portfolio-collection--ai' : ''}`}>
      <div className="portfolio-collection-inner">
        <header className="collection-head">
          <span className="collection-number">{collection.index}</span>
          <div className="collection-title-wrap">
            <p className="section-label">{collection.eyebrow}</p>
            <h2>{collection.title}</h2>
          </div>
          <p className="collection-intro">{collection.intro}</p>
        </header>

        <div className={`collection-grid collection-grid--${collection.kind}${collection.format ? ` collection-grid--${collection.format}` : ''}`}>
          {collection.items.map((item, index) => {
            if (collection.kind === 'video') return <VideoCard key={item.id} item={item} isAi={isAi} />
            if (collection.kind === 'flyer') return <FlyerCard key={item.id} item={item} index={index} />
            return <GalleryCard key={item.id} item={item} index={index} isAi={isAi} />
          })}
        </div>
      </div>
    </section>
  )
}

export default function Portfolio() {
  const portfolioRef = useRef(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.portfolio-collection').forEach((section) => {
        const head = section.querySelector('.collection-head')
        const cards = section.querySelectorAll('.video-card, .gallery-card, .flyer-card')

        gsap.fromTo(head, { opacity: 0, y: 48 }, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 78%' },
        })
        gsap.from(cards, {
          opacity: 0,
          y: 42,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.08,
          immediateRender: false,
          scrollTrigger: { trigger: cards[0], start: 'top 86%' },
        })
      })
    }, portfolioRef)

    return () => ctx.revert()
  }, [])

  return (
    <div id="work" ref={portfolioRef} className="portfolio">
      <div className="portfolio-intro">
        <p className="section-label">Selected Work</p>
        <div className="portfolio-intro-grid">
          <h2>One appetite.<br /><em>Many forms.</em></h2>
          <p>Explore films, photography, AI experiments, campaign design, and the process behind it all.</p>
        </div>
      </div>
      {collections.map((collection) => <Collection key={collection.id} collection={collection} />)}
    </div>
  )
}
