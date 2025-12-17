'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Facebook, Twitter, Instagram } from 'lucide-react'
import { useState } from 'react'

export interface Trainer {
  id: number
  name: string
  specialty: string
  experience: string
  image: string
  bio: string
  social: { facebook: string; twitter: string; instagram: string }
}

const defaultTrainers: Trainer[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    specialty: 'Strength Training',
    experience: '8 years',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    bio: 'Certified personal trainer specializing in strength and conditioning.',
    social: {
      facebook: '#',
      twitter: '#',
      instagram: '#'
    }
  },
  {
    id: 2,
    name: 'Mike Chen',
    specialty: 'CrossFit',
    experience: '6 years',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: 'CrossFit Level 2 trainer with a passion for functional fitness.',
    social: {
      facebook: '#',
      twitter: '#',
      instagram: '#'
    }
  },
  {
    id: 3,
    name: 'Emma Davis',
    specialty: 'Yoga & Pilates',
    experience: '10 years',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    bio: 'Experienced yoga instructor and Pilates specialist.',
    social: {
      facebook: '#',
      twitter: '#',
      instagram: '#'
    }
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    specialty: 'Cardio & HIIT',
    experience: '7 years',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'HIIT and cardio specialist helping members achieve peak fitness.',
    social: {
      facebook: '#',
      twitter: '#',
      instagram: '#'
    }
  }
]

export default function Trainers({ trainersData }: { trainersData?: Trainer[] }) {
  const trainers = trainersData ?? defaultTrainers
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({})

  const handleImageError = (id: number) => {
    setFailedImages(prev => ({ ...prev, [id]: true }))
  }

  return (
    <section id="trainers" className="py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Meet Our <span className="text-primary">Trainers</span>
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto mb-4 sm:mb-6"></div>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Our certified trainers are dedicated to helping you achieve your fitness goals with personalized guidance and motivation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {trainers.map((trainer, index) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
                <Image
                  src={failedImages[trainer.id] ? '/main.jpg' : trainer.image}
                  alt={trainer.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  unoptimized
                  onError={() => handleImageError(trainer.id)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-center space-x-4">
                    <a href={trainer.social?.facebook ?? '#'} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a href={trainer.social?.twitter ?? '#'} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href={trainer.social?.instagram ?? '#'} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{trainer.name}</h3>
                <p className="text-primary text-sm sm:text-base font-semibold mb-1">{trainer.specialty}</p>
                <p className="text-gray-600 text-xs sm:text-sm mb-3">{trainer.experience} experience</p>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{trainer.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-12">
          <button className="bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base">
            Book a Session
          </button>
        </motion.div>
      </div>
    </section>
  )
}