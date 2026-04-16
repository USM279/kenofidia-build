import { useEffect, useRef, useState } from 'react'
import '../styles/Nav.css'
import logo from '../assets/logo.png'

const links = ['Work', 'Services', 'Process', 'About', 'Contact']

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

  /* close drawer on link click */
  const handleLink = () => setOpen(false)

  return (
    <>
      <nav ref={navRef} className={`nav${open ? ' nav--open' : ''}`} aria-label="Primary navigation">
        <a href="#hero" className="nav-logo" aria-label="Kenofidia home">
          <img src={logo} alt="Kenofidia" className="nav-logo-img" />
        </a>

        <ul className="nav-links" role="list">
          {links.map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className="nav-link" onClick={handleLink}>
                {l}
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
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-drawer${open ? ' nav-drawer--open' : ''}`} aria-hidden={!open}>
        <ul className="nav-drawer-links" role="list">
          {links.map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className="nav-drawer-link" onClick={handleLink}>
                {l}
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
