'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  _id: string
  title: string
  image: string
  category: string
  description?: string
  isActive: boolean
  createdAt: string
}

const categories = [
  { id: 'all', name: 'All' },
  { id: 'equipment', name: 'Equipment' },
  { id: 'classes', name: 'Classes' },
  { id: 'cardio', name: 'Cardio' },
  { id: 'strength', name: 'Strength' },
  { id: 'yoga', name: 'Yoga' },
  { id: 'facilities', name: 'Facilities' },
  { id: 'training', name: 'Training' },
  { id: 'crossfit', name: 'CrossFit' }
]

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleImageError = (id: string, src: string) => {
    console.error(`Image failed to load: ${src}`)
    setFailedImages(prev => ({ ...prev, [id]: true }))
  }

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch('/api/gallery')
      const data = await response.json()
      if (data.success) {
        setGalleryImages(data.galleryImages.filter((img: GalleryImage) => img.isActive))
      }
    } catch (error) {
      console.error('Failed to fetch gallery images:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory)

  useEffect(() => {
    setCurrentSlide(0)
  }, [selectedCategory])

  // Ensure currentSlide is within bounds when the filtered images list changes
  useEffect(() => {
    if (filteredImages.length === 0) {
      setCurrentSlide(0)
      return
    }
    setCurrentSlide(prev => (prev >= filteredImages.length ? 0 : prev))
  }, [filteredImages.length])

  const currentImage = filteredImages[currentSlide] || filteredImages[0]

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1))
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <section id="gallery" className="py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Our <span className="text-primary">Gallery</span>
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto mb-4 sm:mb-6"></div>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Take a virtual tour of our state-of-the-art facilities and see why members choose Vitalize Fitness.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-10 sm:mb-12 px-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-primary hover:text-white'
              }`}>
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Carousel */}
        {loading ? (
          <div className="flex justify-center items-center py-12 sm:py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-gray-600 text-lg">No images available in this category.</p>
          </div>
        ) : (
          <div className="relative">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-56 sm:h-72 md:h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
              {failedImages[currentImage._id] ? (
                // Show a local fallback if the optimization or fetch failed
                <Image
                  src="/main.jpg"
                  alt={currentImage.title}
                  fill
                  sizes="100vw"
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <Image
                  src={currentImage.image}
                  alt={currentImage.title}
                  fill
                  sizes="100vw"
                  onError={() => handleImageError(currentImage._id, currentImage.image)}
                  className="object-cover"
                  priority
                  unoptimized
                />
              )} 
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2">{currentImage.title}</h3>
                {currentImage.description && (
                  <p className="text-sm sm:text-base text-gray-200 mb-2">{currentImage.description}</p>
                )}
                <p className="text-xs sm:text-sm text-gray-300 capitalize">Category: {currentImage.category}</p>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrevSlide}
                aria-label="Previous slide"
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-900 rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110">
                <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
              </button>

              <button
                onClick={handleNextSlide}
                aria-label="Next slide"
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-900 rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110">
                <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
              </button>
            </motion.div>

            {/* Slide Indicators */}
            <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8 overflow-x-auto">
              {filteredImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? 'bg-primary w-8'
                      : 'bg-gray-300 hover:bg-gray-400 w-2'
                  }`}
                />
              ))}
            </div>

            {/* Slide Counter */}
            <div className="text-center mt-4 text-gray-600 text-sm sm:text-base">
              {currentSlide + 1} / {filteredImages.length}
            </div>
          </div>
        )}

        {/* Modal - Removed */}
      </div>
    </section>
  )
}