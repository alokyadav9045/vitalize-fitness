'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Trainers from '@/components/Trainers'
import Footer from '@/components/Footer'
import type { Trainer } from '@/components/Trainers'

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/trainers')
        const json = await res.json()
        if (!mounted) return
        if (json.success && Array.isArray(json.trainers)) {
          setTrainers(json.trainers)
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
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Our Trainers</h1>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <Trainers trainersData={trainers ?? undefined} />
        )}
      </div>
      <Footer />
    </main>
  )
}
