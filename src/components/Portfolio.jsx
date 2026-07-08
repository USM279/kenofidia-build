import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { portfolioMedia } from '../data/portfolio'
import '../styles/Portfolio.css'
import { useLanguage } from '../i18n/useLanguage'
import { getMediaAlt, getMediaCategory, getMediaTitle } from '../i18n/translations'

gsap.registerPlugin(ScrollTrigger)

const collectionBlueprints = [
  {
    id: 'restaurant-videos',
    index: '01',
    kind: 'video',
    format: 'portrait-video',
    items: portfolioMedia.restaurantVideos,
  },
  {
    id: 'restaurant-photos',
    index: '02',
    kind: 'gallery',
    format: 'photo-masonry',
    items: portfolioMedia.photos,
  },
  {
    id: 'ai-images',
    index: '03',
    kind: 'gallery',
    format: 'mixed-gallery',
    tone: 'ai',
    items: portfolioMedia.aiImages,
  },
  {
    id: 'ai-videos',
    index: '04',
    kind: 'video',
    format: 'portrait-video-three',
    tone: 'ai',
    items: portfolioMedia.aiVideos,
  },
  {
    id: 'flyers',
    index: '05',
    kind: 'flyer',
    format: 'flyer-three',
    items: portfolioMedia.flyers,
  },
  {
    id: 'behind-the-scenes',
    index: '06',
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

function getVideoEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')
    let videoId = ''

    if (host === 'vimeo.com') {
      videoId = parsed.pathname.split('/').filter(Boolean)[0] ?? ''
      return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1` : url
    }

    if (host === 'player.vimeo.com' && parsed.pathname.startsWith('/video/')) {
      videoId = parsed.pathname.split('/').filter(Boolean)[1] ?? ''
      return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1` : url
    }

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

function VideoModal({ item, onClose, language, copy }) {
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
  const title = getMediaTitle(item.title, language)
  const category = getMediaCategory(item.category, language)

  return (
    <div className="video-modal" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="video-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="video-modal-title">
        <button className="video-modal-close" type="button" aria-label={copy.closeVideo} onClick={onClose}>×</button>
        <div className="video-modal-frame" style={modalFrameStyle}>
          <iframe
            src={getVideoEmbedUrl(item.youtubeUrl)}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="video-modal-caption">
          <p>{category}</p>
          <h3 id="video-modal-title">{title}</h3>
        </div>
      </div>
    </div>
  )
}

function ImageModal({ item, onClose, language, copy }) {
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
  const title = getMediaTitle(item.title, language)
  const category = getMediaCategory(item.category, language)

  return (
    <div className="image-modal" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="image-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="image-modal-title">
        <button className="video-modal-close" type="button" aria-label={copy.closeImage} onClick={onClose}>×</button>
        <img src={item.src} alt={getMediaAlt(item, language)} />
        <div className="video-modal-caption">
          <p>{category}</p>
          <h3 id="image-modal-title">{title}</h3>
        </div>
      </div>
    </div>
  )
}

function VideoCard({ item, isAi, onOpen, language, copy }) {
  const naturalAspect = item.width && item.height
    ? { '--media-aspect': `${item.width} / ${item.height}` }
    : undefined
  const cardClass = `video-card video-card--${item.format}${naturalAspect ? ' video-card--natural' : ''}`
  const title = getMediaTitle(item.title, language)
  const category = getMediaCategory(item.category, language)
  const content = (
    <>
      <div className="video-card-media" style={naturalAspect}>
        <img src={item.poster} alt={getMediaAlt(item, language, 'poster')} loading="lazy" decoding="async" />
        <div className="media-shade" />
        <PlayMark />
        {isAi && <span className="media-badge">{copy.aiGenerated}</span>}
      </div>
      <div className="media-caption">
        <div>
          <p>{category}</p>
          <h3>{title}</h3>
        </div>
        <span className="media-action">{item.youtubeUrl ? copy.watchVideo : copy.videoPending}</span>
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

function GalleryCard({ item, isAi, index, onOpen, language, copy }) {
  const naturalAspect = item.width && item.height
    ? { '--media-aspect': `${item.width} / ${item.height}` }
    : undefined
  const title = getMediaTitle(item.title, language)
  const category = getMediaCategory(item.category, language)

  return (
    <button
      className={`gallery-card gallery-card--${(index % 5) + 1}${naturalAspect ? ' gallery-card--natural' : ''}`}
      type="button"
      aria-label={`${copy.open} ${title}`}
      onClick={() => onOpen(item)}
      data-cursor-hover
    >
      <div className="gallery-card-media" style={naturalAspect}>
        <img src={item.src} alt={getMediaAlt(item, language)} loading="lazy" decoding="async" />
        <div className="media-shade" />
        {isAi && <span className="media-badge">{copy.aiGenerated}</span>}
      </div>
      <div className="media-caption">
        <div>
          <p>{category}</p>
          <h3>{title}</h3>
        </div>
        <span className="media-index">{item.displayIndex ?? String(index + 1).padStart(2, '0')}</span>
      </div>
    </button>
  )
}

function FlyerCard({ item, index, onOpen, language, copy }) {
  const naturalAspect = item.width && item.height
    ? { '--media-aspect': `${item.width} / ${item.height}` }
    : undefined
  const title = getMediaTitle(item.title, language)
  const category = getMediaCategory(item.category, language)

  return (
    <button
      className={`flyer-card${naturalAspect ? ' flyer-card--natural' : ''}`}
      type="button"
      aria-label={`${copy.open} ${title}`}
      onClick={() => onOpen(item)}
      data-cursor-hover
    >
      <div className="flyer-card-frame">
        <img src={item.src} alt={getMediaAlt(item, language)} loading="lazy" decoding="async" style={naturalAspect} />
      </div>
      <div className="media-caption">
        <div>
          <p>{category}</p>
          <h3>{title}</h3>
        </div>
        <span className="media-index">{String(index + 1).padStart(2, '0')}</span>
      </div>
    </button>
  )
}

function Collection({ collection, onVideoOpen, onImageOpen, language, copy }) {
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
            if (collection.kind === 'video') return <VideoCard key={item.id} item={item} isAi={isAi} onOpen={onVideoOpen} language={language} copy={copy} />
            if (collection.kind === 'flyer') return <FlyerCard key={item.id} item={item} index={index} onOpen={onImageOpen} language={language} copy={copy} />
            return <GalleryCard key={item.id} item={item} index={index} isAi={isAi} onOpen={onImageOpen} language={language} copy={copy} />
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
  const { language, t } = useLanguage()
  const collections = useMemo(
    () => collectionBlueprints.map((collection, index) => ({
      ...collection,
      ...t.portfolio.collections[index],
    })),
    [t.portfolio.collections],
  )

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
        <p className="section-label">{t.portfolio.selectedLabel}</p>
        <div className="portfolio-intro-grid">
          <h2>{t.portfolio.introTitleLead}<br /><em>{t.portfolio.introTitleEmphasis}</em></h2>
          <p>{t.portfolio.introBody}</p>
        </div>
      </div>
      {collections.map((collection) => (
        <Collection
          key={collection.id}
          collection={collection}
          onVideoOpen={setActiveVideo}
          onImageOpen={setActiveImage}
          language={language}
          copy={t.portfolio}
        />
      ))}
      <VideoModal item={activeVideo} onClose={() => setActiveVideo(null)} language={language} copy={t.portfolio} />
      <ImageModal item={activeImage} onClose={() => setActiveImage(null)} language={language} copy={t.portfolio} />
    </div>
  )
}
