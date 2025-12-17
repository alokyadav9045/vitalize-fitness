'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'

interface GalleryImage {
  _id: string
  title: string
  image: string
  category: string
  description?: string
  isActive: boolean
  createdAt: string
}

export default function GalleryDetail() {
  const { id } = useParams() as { id?: string }
  const [image, setImage] = useState<GalleryImage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/gallery')
        const json = await res.json()
        if (!mounted) return
        if (json.success && Array.isArray(json.galleryImages)) {
          const found = json.galleryImages.find((g: GalleryImage) => g._id === id)
          setImage(found ?? null)
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
      <div className="max-w-4xl mx-auto px-4 py-20">
        {loading ? (
          <div className="text-center">Loading…</div>
        ) : !image ? (
          <div className="text-center text-gray-600">Image not found</div>
        ) : (
          <div className="space-y-6">
            <div className="relative h-56 sm:h-72 md:h-96 rounded-lg overflow-hidden shadow-lg">
              <Image src={image.image} alt={image.title} fill className="object-cover" unoptimized />
            </div>
            <h1 className="text-2xl font-bold">{image.title}</h1>
            {image.description && <p className="text-gray-700">{image.description}</p>}
            <p className="text-sm text-gray-500">Category: {image.category}</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
