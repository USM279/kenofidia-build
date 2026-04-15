import Cursor      from './components/Cursor'
import Nav         from './components/Nav'
import Hero        from './components/Hero'
import Marquee     from './components/Marquee'
import Services    from './components/Services'
import Portfolio   from './components/Portfolio'
import Stats       from './components/Stats'
import Process     from './components/Process'
import Clients     from './components/Clients'
import Testimonial from './components/Testimonial'
import CTA         from './components/CTA'
import Footer      from './components/Footer'
import './App.css'

export default function App() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Portfolio />
        <Stats />
        <Process />
        <Clients />
        <Testimonial />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
