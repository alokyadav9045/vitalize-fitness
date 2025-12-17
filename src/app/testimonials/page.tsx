'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Testimonial {
  _id: string
  name: string
  role?: string
  message: string
  isActive: boolean
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/testimonials')
        const json = await res.json()
        if (!mounted) return
        if (json.success && Array.isArray(json.testimonials)) {
          setTestimonials(json.testimonials.filter((t: Testimonial) => t.isActive))
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Testimonials</h1>
        {loading ? (
          <div>Loading…</div>
        ) : testimonials.length === 0 ? (
          <p className="text-gray-600">No testimonials available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map(t => (
              <blockquote key={t._id} className="p-4 sm:p-6 bg-gray-50 rounded-lg shadow">
                <p className="text-gray-800 text-sm sm:text-base">{t.message}</p>
                <footer className="text-sm text-gray-500 mt-2">— {t.name}</footer>
                {t.role && <div className="text-xs text-gray-400 mt-1">{t.role}</div>}
              </blockquote>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
