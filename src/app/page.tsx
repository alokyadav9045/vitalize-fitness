import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Plans from '@/components/Plans'
import Trainers from '@/components/Trainers'
import Gallery from '@/components/Gallery'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Plans />
      <Trainers />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  )
}