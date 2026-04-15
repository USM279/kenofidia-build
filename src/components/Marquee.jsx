import '../styles/Marquee.css'

const items = [
  'Food Photography',
  'Menu Design',
  'Social Media Strategy',
  'Brand Identity',
  'Campaign Direction',
  'Editorial Styling',
  'Video Production',
  'Website Design',
]

export default function Marquee() {
  const repeated = [...items, ...items]

  return (
    <div className="marquee-section" aria-label="Services">
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
