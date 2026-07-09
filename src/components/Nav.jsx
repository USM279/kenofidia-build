import { useEffect, useRef, useState } from 'react'
import '../styles/Nav.css'
import logo from '../assets/logo-small.png'
import { portfolioNavigation } from '../data/portfolio'
import { useLanguage } from '../i18n/useLanguage'
import { languageNames, supportedLanguages } from '../i18n/translations'

function getLinkId(href) {
  return href.replace('#', '')
}

function LanguageToggle({ compact = false }) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className={`language-toggle${compact ? ' language-toggle--drawer' : ''}`} aria-label={t.nav.switchLanguage}>
      {supportedLanguages.map(option => (
        <button
          key={option}
          className={`language-toggle-option${language === option ? ' language-toggle-option--active' : ''}`}
          type="button"
          onClick={() => setLanguage(option)}
          aria-pressed={language === option}
          aria-label={languageNames[option]}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default function Nav() {
  const navRef     = useRef(null)
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const onScroll = () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    document.body.classList.toggle('menu-open', open)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.classList.remove('menu-open')
    }
  }, [open])

  /* close drawer on link click */
  const handleLink = () => setOpen(false)

  return (
    <>
      <nav ref={navRef} className={`nav${open ? ' nav--open' : ''}`} aria-label={t.nav.aria}>
        <a href="#hero" className="nav-logo" aria-label={t.nav.home}>
          <img src={logo} alt="Kinofedia" className="nav-logo-img" />
        </a>

        <ul className="nav-links" role="list">
          {portfolioNavigation.map(link => (
            <li key={link.href}>
              <a href={link.href} className="nav-link" onClick={handleLink}>
                {t.nav.links[getLinkId(link.href)] ?? link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <LanguageToggle />
          <a href="mailto:info@kinofedia.nl" className="nav-cta">
            {t.nav.getInTouch}
          </a>
        </div>

        <button
          className={`nav-burger${open ? ' nav-burger--open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label={t.nav.toggleMenu}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-navigation"
        className={`nav-drawer${open ? ' nav-drawer--open' : ''}`}
        aria-hidden={!open}
        inert={!open}
      >
        <ul className="nav-drawer-links" role="list">
          {portfolioNavigation.map((link, index) => (
            <li key={link.href}>
              <a href={link.href} className="nav-drawer-link" onClick={handleLink}>
                <span>{String(index + 1).padStart(2, '0')}</span>{t.nav.links[getLinkId(link.href)] ?? link.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="mailto:info@kinofedia.nl" className="nav-drawer-cta" onClick={handleLink}>
          {t.nav.getInTouch}
        </a>
        <div className="nav-drawer-language">
          <span>{t.nav.drawerLanguage}</span>
          <LanguageToggle compact />
        </div>
      </div>

      {/* Backdrop */}
      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}
    </>
  )
}
