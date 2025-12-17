import Navbar from '@/components/Navbar'
import Plans from '@/components/Plans'
import Footer from '@/components/Footer'

export default function PlansPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Membership Plans</h1>
        <Plans />
      </div>
      <Footer />
    </main>
  )
}
