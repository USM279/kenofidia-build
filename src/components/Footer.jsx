import '../styles/Footer.css'

const nav = [
  { label: 'Work',     href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process',  href: '#process' },
  { label: 'Clients',  href: '#clients' },
  { label: 'Contact',  href: '#contact' },
]

const social = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn',  href: '#' },
  { label: 'Behance',   href: '#' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <a href="#hero" className="footer-logo">Kenofidia</a>

        <nav className="footer-nav" aria-label="Footer navigation">
          {nav.map(l => (
            <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
          ))}
        </nav>

        <div className="footer-social">
          {social.map(s => (
            <a key={s.label} href={s.href} className="footer-social-link" aria-label={s.label}>
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Kenofidia Studio. All rights reserved.
        </p>
        <p className="footer-tagline">
          Crafting visual stories that fill tables.
        </p>
      </div>
    </footer>
  )
}
