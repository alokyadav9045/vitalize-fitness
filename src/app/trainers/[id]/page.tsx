'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'

interface TrainerDetail {
  id: number
  name: string
  specialty: string
  experience: string
  image: string
  bio: string
}

export default function TrainerDetail() {
  const { id } = useParams() as { id?: string }
  const [trainer, setTrainer] = useState<TrainerDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/trainers')
        const json = await res.json()
        if (!mounted) return
        if (json.success && Array.isArray(json.trainers)) {
          const found = json.trainers.find((t: TrainerDetail) => String(t.id) === id)
          setTrainer(found ?? null)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [id])

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        {loading ? (
          <div>Loading…</div>
        ) : !trainer ? (
          <div className="text-center text-gray-600">Trainer not found</div>
        ) : (
          <div className="space-y-6">
            <div className="relative h-48 sm:h-64 md:h-72 rounded-lg overflow-hidden shadow-lg">
              <Image src={trainer.image} alt={trainer.name} fill className="object-cover" unoptimized />
            </div>
            <h1 className="text-2xl font-bold">{trainer.name}</h1>
            <p className="text-primary font-semibold">{trainer.specialty}</p>
            <p className="text-gray-700">{trainer.bio}</p>
            <p className="text-sm text-gray-500">Experience: {trainer.experience}</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
