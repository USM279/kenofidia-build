import '../styles/Footer.css'
import { portfolioNavigation } from '../data/portfolio'
import { useLanguage } from '../i18n/useLanguage'

const nav = [...portfolioNavigation, { label: 'Contact', href: '#contact' }]

function getLinkId(href) {
  return href.replace('#', '')
}

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="footer">
      <div className="footer-top">
        <a href="#hero" className="footer-logo">Kenofidia</a>

        <nav className="footer-nav" aria-label={t.footer.navAria}>
          {nav.map(l => (
            <a key={l.label} href={l.href} className="footer-link">{t.nav.links[getLinkId(l.href)] ?? l.label}</a>
          ))}
        </nav>

      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Kenofidia Studio. {t.footer.copy}
        </p>
        <p className="footer-tagline">
          {t.footer.tagline}
        </p>
      </div>
    </footer>
  )
}
