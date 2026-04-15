import { useEffect, useRef } from 'react'
import '../styles/Nav.css'
import logo from '../assets/logo.png'

const links = ['Work', 'Services', 'Process', 'About', 'Contact']

export default function Nav() {
  const navRef = useRef(null)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const onScroll = () => {
      if (window.scrollY > 60) {
        nav.classList.add('nav--scrolled')
      } else {
        nav.classList.remove('nav--scrolled')
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav ref={navRef} className="nav" aria-label="Primary navigation">
      <a href="#hero" className="nav-logo" aria-label="Kenofidia home">
        <img src={logo} alt="Kenofidia" className="nav-logo-img" />
      </a>

      <ul className="nav-links" role="list">
        {links.map(l => (
          <li key={l}>
            <a href={`#${l.toLowerCase()}`} className="nav-link">
              {l}
            </a>
          </li>
        ))}
      </ul>

      <a href="mailto:hello@kenofidia.com" className="nav-cta">
        Get in touch
      </a>
    </nav>
  )
}
