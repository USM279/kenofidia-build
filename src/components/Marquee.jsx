import '../styles/Marquee.css'
import { useLanguage } from '../i18n/useLanguage'

export default function Marquee() {
  const { t } = useLanguage()
  const repeated = [...t.marquee.items, ...t.marquee.items]

  return (
    <div className="marquee-section" aria-label={t.marquee.aria}>
      <div className="marquee-track">
        <div className="marquee-inner">
          {repeated.map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
              <span className="marquee-sep" aria-hidden="true">◆</span>
            </span>
          ))}
        </div>
        <div className="marquee-inner" aria-hidden="true">
          {repeated.map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
              <span className="marquee-sep">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
