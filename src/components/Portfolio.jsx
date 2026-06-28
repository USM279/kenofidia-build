import { useEffect, useRef, useState } from 'react'
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

function getYouTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')
    let videoId = ''

    if (host === 'youtu.be') {
      videoId = parsed.pathname.split('/').filter(Boolean)[0] ?? ''
    } else if (parsed.pathname.startsWith('/shorts/')) {
      videoId = parsed.pathname.split('/').filter(Boolean)[1] ?? ''
    } else if (parsed.pathname.startsWith('/embed/')) {
      videoId = parsed.pathname.split('/').filter(Boolean)[1] ?? ''
    } else {
      videoId = parsed.searchParams.get('v') ?? ''
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1` : url
  } catch {
    return url
  }
}

function VideoModal({ item, onClose }) {
  useEffect(() => {
    if (!item) return undefined

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [item, onClose])

  if (!item) return null

  const isPortrait = item.format === 'portrait' || (item.width && item.height && item.height > item.width)
  const modalAspect = item.width && item.height
    ? `${item.width} / ${item.height}`
    : isPortrait
      ? '9 / 16'
      : '16 / 9'
  const modalFrameStyle = {
    '--modal-aspect': modalAspect,
    '--modal-frame-width': isPortrait ? 'min(100%, calc((100dvh - 8rem) * 9 / 16))' : 'min(100%, 64rem)',
  }

  return (
    <div className="video-modal" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="video-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="video-modal-title">
        <button className="video-modal-close" type="button" aria-label="Close video" onClick={onClose}>×</button>
        <div className="video-modal-frame" style={modalFrameStyle}>
          <iframe
            src={getYouTubeEmbedUrl(item.youtubeUrl)}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="video-modal-caption">
          <p>{item.category}</p>
          <h3 id="video-modal-title">{item.title}</h3>
        </div>
      </div>
    </div>
  )
}

function ImageModal({ item, onClose }) {
  useEffect(() => {
    if (!item) return undefined

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [item, onClose])

  if (!item) return null

  return (
    <div className="image-modal" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="image-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="image-modal-title">
        <button className="video-modal-close" type="button" aria-label="Close image" onClick={onClose}>×</button>
        <img src={item.src} alt={item.alt} />
        <div className="video-modal-caption">
          <p>{item.category}</p>
          <h3 id="image-modal-title">{item.title}</h3>
        </div>
      </div>
    </div>
  )
}

function VideoCard({ item, isAi, onOpen }) {
  const naturalAspect = item.width && item.height
    ? { '--media-aspect': `${item.width} / ${item.height}` }
    : undefined
  const cardClass = `video-card video-card--${item.format}${naturalAspect ? ' video-card--natural' : ''}`
  const content = (
    <>
      <div className="video-card-media" style={naturalAspect}>
        <img src={item.poster} alt={item.posterAlt} loading="lazy" decoding="async" />
        <div className="media-shade" />
        <PlayMark />
        {isAi && <span className="media-badge">AI generated</span>}
      </div>
      <div className="media-caption">
        <div>
          <p>{item.category}</p>
          <h3>{item.title}</h3>
        </div>
        <span className="media-action">{item.youtubeUrl ? 'Watch video' : 'YouTube link pending'}</span>
      </div>
    </>
  )

  return item.youtubeUrl ? (
    <button className={cardClass} type="button" onClick={() => onOpen(item)} data-cursor-hover>
      {content}
    </button>
  ) : (
    <article className={`${cardClass} video-card--pending`}>{content}</article>
  )
}

function GalleryCard({ item, isAi, index, onOpen }) {
  const naturalAspect = item.width && item.height
    ? { '--media-aspect': `${item.width} / ${item.height}` }
    : undefined

  return (
    <button
      className={`gallery-card gallery-card--${(index % 5) + 1}${naturalAspect ? ' gallery-card--natural' : ''}`}
      type="button"
      aria-label={`Open ${item.title}`}
      onClick={() => onOpen(item)}
      data-cursor-hover
    >
      <div className="gallery-card-media" style={naturalAspect}>
        <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
        <div className="media-shade" />
        {isAi && <span className="media-badge">AI generated</span>}
      </div>
      <div className="media-caption">
        <div>
          <p>{item.category}</p>
          <h3>{item.title}</h3>
        </div>
        <span className="media-index">{item.displayIndex ?? String(index + 1).padStart(2, '0')}</span>
      </div>
    </button>
  )
}

function FlyerCard({ item, index, onOpen }) {
  const naturalAspect = item.width && item.height
    ? { '--media-aspect': `${item.width} / ${item.height}` }
    : undefined

  return (
    <button
      className={`flyer-card${naturalAspect ? ' flyer-card--natural' : ''}`}
      type="button"
      aria-label={`Open ${item.title}`}
      onClick={() => onOpen(item)}
      data-cursor-hover
    >
      <div className="flyer-card-frame">
        <img src={item.src} alt={item.alt} loading="lazy" decoding="async" style={naturalAspect} />
      </div>
      <div className="media-caption">
        <div>
          <p>{item.category}</p>
          <h3>{item.title}</h3>
        </div>
        <span className="media-index">{String(index + 1).padStart(2, '0')}</span>
      </div>
    </button>
  )
}

function Collection({ collection, onVideoOpen, onImageOpen }) {
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
            if (collection.kind === 'video') return <VideoCard key={item.id} item={item} isAi={isAi} onOpen={onVideoOpen} />
            if (collection.kind === 'flyer') return <FlyerCard key={item.id} item={item} index={index} onOpen={onImageOpen} />
            return <GalleryCard key={item.id} item={item} index={index} isAi={isAi} onOpen={onImageOpen} />
          })}
        </div>
      </div>
    </section>
  )
}

export default function Portfolio() {
  const portfolioRef = useRef(null)
  const [activeVideo, setActiveVideo] = useState(null)
  const [activeImage, setActiveImage] = useState(null)

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
      {collections.map((collection) => (
        <Collection
          key={collection.id}
          collection={collection}
          onVideoOpen={setActiveVideo}
          onImageOpen={setActiveImage}
        />
      ))}
      <VideoModal item={activeVideo} onClose={() => setActiveVideo(null)} />
      <ImageModal item={activeImage} onClose={() => setActiveImage(null)} />
    </div>
  )
}
