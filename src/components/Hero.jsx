import ScrollMorphHero from './ui/scroll-morph-hero'
import '../styles/Hero.css'

export default function Hero() {
  return (
    <section id="hero" className="hero hero--morph">
      <ScrollMorphHero />
    </section>
  )
}
