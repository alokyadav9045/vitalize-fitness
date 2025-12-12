'use client'

import { motion } from 'framer-motion'
import {
  Dumbbell,
  Users,
  Apple,
  Heart,
  Zap,
  Target
} from 'lucide-react'

const services = [
  {
    id: 1,
    title: 'Personal Training',
    description: 'One-on-one sessions tailored to your fitness goals and schedule.',
    icon: Dumbbell,
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Group Classes',
    description: 'High-energy group workouts including Yoga, Zumba, and HIIT sessions.',
    icon: Users,
    color: 'bg-green-500'
  },
  {
    id: 3,
    title: 'Nutrition Counseling',
    description: 'Expert guidance on diet and nutrition to complement your workouts.',
    icon: Apple,
    color: 'bg-orange-500'
  },
  {
    id: 4,
    title: 'Cardio Zone',
    description: 'State-of-the-art cardio equipment for effective fat burning.',
    icon: Heart,
    color: 'bg-red-500'
  },
  {
    id: 5,
    title: 'Strength Training',
    description: 'Build muscle and strength with our comprehensive weight training programs.',
    icon: Zap,
    color: 'bg-purple-500'
  },
  {
    id: 6,
    title: 'CrossFit Program',
    description: 'High-intensity functional training for ultimate fitness gains.',
    icon: Target,
    color: 'bg-indigo-500'
  }
]

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-primary">Services</span>
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of fitness services designed to help you achieve your goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-8">
                <div className={`inline-flex p-3 rounded-xl ${service.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            View All Services
          </button>
        </motion.div>
      </div>
    </section>
  )
}