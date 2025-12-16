'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, LogIn } from 'lucide-react'

const navItems = [
  { name: 'Home', link: '#home' },
  { name: 'About', link: '#about' },
  { name: 'Services', link: '#services' },
  { name: 'Plans', link: '#plans' },
  { name: 'Trainers', link: '#trainers' },
  { name: 'Gallery', link: '#gallery' },
  { name: 'Contact', link: '#contact' },
  { name: 'Login', link: '/admin/login', icon: LogIn }
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    const handleScrollSpy = () => {
      const sections = navItems.filter(item => item.link.startsWith('#')).map(item => item.link.slice(1))
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('scroll', handleScrollSpy)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScrollSpy)
    }
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/Vitalize Fitness.png" alt="Vitalize Fitness" width={36} height={36} className="logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === item.link.slice(1)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-md">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-primary/5"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}