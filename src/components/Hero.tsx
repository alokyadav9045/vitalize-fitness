'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const words = ["Transform", "Your", "Body"]

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const type = () => {
      const currentWord = words[currentWordIndex]
      const shouldDelete = isDeleting

      if (!shouldDelete) {
        setCurrentText(currentWord.substring(0, currentText.length + 1))
        if (currentText === currentWord) {
          setTimeout(() => setIsDeleting(true), 1000)
        }
      } else {
        setCurrentText(currentWord.substring(0, currentText.length - 1))
        if (currentText === '') {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }

    const timer = setTimeout(type, isDeleting ? 100 : 200)
    return () => clearTimeout(timer)
  }, [currentText, isDeleting, currentWordIndex])

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop)',
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="block">Welcome to</span>
            <span className="block text-primary">Vitalize Fitness</span>
          <div className="text-2xl sm:text-4xl lg:text-5xl font-light mb-8 h-16 flex items-center justify-center">
            <span>{currentText}</span>
            <span className="animate-pulse">|</span>
          </div>

          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Join the ultimate fitness community. Transform your body, mind, and lifestyle with our expert trainers and state-of-the-art facilities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Start Your Journey
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold">1000+</div>
            <div className="text-sm sm:text-base">Happy Members</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold">50+</div>
            <div className="text-sm sm:text-base">Expert Trainers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold">10+</div>
            <div className="text-sm sm:text-base">Years Experience</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold">100+</div>
            <div className="text-sm sm:text-base">Success Stories</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <ChevronDown className="w-6 h-6 text-white animate-bounce" />
      </motion.div>
    </section>
  )
}