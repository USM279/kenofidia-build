import { useEffect, useRef, useState } from 'react'
import '../styles/Nav.css'
import logo from '../assets/logo.png'
import { portfolioNavigation } from '../data/portfolio'

export default function Nav() {
  const navRef     = useRef(null)
  const [open, setOpen] = useState(false)

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
      <nav ref={navRef} className={`nav${open ? ' nav--open' : ''}`} aria-label="Primary navigation">
        <a href="#hero" className="nav-logo" aria-label="Kenofidia home">
          <img src={logo} alt="Kenofidia" className="nav-logo-img" />
        </a>

        <ul className="nav-links" role="list">
          {portfolioNavigation.map(link => (
            <li key={link.href}>
              <a href={link.href} className="nav-link" onClick={handleLink}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="mailto:hello@kenofidia.com" className="nav-cta">
          Get in touch
        </a>

        <button
          className={`nav-burger${open ? ' nav-burger--open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div id="mobile-navigation" className={`nav-drawer${open ? ' nav-drawer--open' : ''}`} aria-hidden={!open}>
        <ul className="nav-drawer-links" role="list">
          {portfolioNavigation.map((link, index) => (
            <li key={link.href}>
              <a href={link.href} className="nav-drawer-link" onClick={handleLink}>
                <span>{String(index + 1).padStart(2, '0')}</span>{link.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="mailto:hello@kenofidia.com" className="nav-drawer-cta" onClick={handleLink}>
          Get in touch
        </a>
      </div>

      {/* Backdrop */}
      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}
    </>
  )
}
