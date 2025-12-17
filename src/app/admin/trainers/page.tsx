'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  Plus,
  Edit,
  Trash2,
  User,
  Mail,
  Phone
} from 'lucide-react'

interface Trainer {
  _id: string
  name: string
  email: string
  phone: string
  specializations: string[]
  experience: number
  bio: string
  image?: string
  rating?: number
  certifications?: string[]
  isActive: boolean
  createdAt: string
}

const specializations = [
  'Personal Training',
  'Group Fitness',
  'Yoga',
  'Pilates',
  'CrossFit',
  'Nutrition',
  'Strength Training',
  'Cardio Training',
  'Martial Arts',
  'Sports Performance'
]

export default function Trainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    image: '',
    specializations: [] as string[],
    experience: 0,
    certifications: [] as string[]
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    } else {
      fetchTrainers()
    }
  }, [router])

  const fetchTrainers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/trainers')
      const data = await response.json()

      if (data.success) {
        setTrainers(data.trainers)
      } else {
        console.error('Failed to fetch trainers:', data.message)
      }
    } catch (error) {
      console.error('Error fetching trainers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this trainer?')) {
      try {
        const response = await fetch(`/api/trainers?id=${id}`, {
          method: 'DELETE'
        })

        const data = await response.json()

        if (data.success) {
          await fetchTrainers() // Refresh the list
        } else {
          console.error('Failed to delete trainer:', data.message)
          alert(data.message)
        }
      } catch (error) {
        console.error('Error deleting trainer:', error)
        alert('Failed to delete trainer')
      }
    }
  }

  const toggleActive = async (id: string) => {
    try {
      const trainer = trainers.find(t => t._id === id)
      if (!trainer) return

      const response = await fetch('/api/trainers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name: trainer.name,
          email: trainer.email,
          phone: trainer.phone,
          bio: trainer.bio,
          image: trainer.image,
          specializations: trainer.specializations,
          experience: trainer.experience,
          certifications: trainer.certifications,
          isActive: !trainer.isActive
        })
      })

      const data = await response.json()

      if (data.success) {
        await fetchTrainers() // Refresh the list
      } else {
        console.error('Failed to toggle trainer status:', data.message)
        alert(data.message)
      }
    } catch (error) {
      console.error('Error toggling trainer status:', error)
      alert('Failed to toggle trainer status')
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-40 sm:h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Trainer Management</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Manage gym trainers and their information</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary hover:bg-primary-dark text-white px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap text-sm"
            >
              <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Add Trainer</span>
            </button>
          </div>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {trainers.map((trainer) => (
            <div key={trainer._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative">
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => toggleActive(trainer._id)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      trainer.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {trainer.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{trainer.name || 'Unknown Trainer'}</h3>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {trainer.email || 'No email'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {trainer.phone || 'No phone'}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">Specializations:</p>
                  <div className="flex flex-wrap gap-1">
                    {(trainer.specializations || []).slice(0, 2).map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {spec}
                      </span>
                    ))}
                    {(trainer.specializations || []).length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{(trainer.specializations || []).length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>{trainer.experience || 0} years experience</span>
                </div>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{trainer.bio || 'No bio available'}</p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingTrainer(trainer)
                      setFormData({
                        name: trainer.name,
                        email: trainer.email,
                        phone: trainer.phone,
                        bio: trainer.bio,
                        image: trainer.image || '',
                        specializations: trainer.specializations,
                        experience: trainer.experience || 0,
                        certifications: trainer.certifications || []
                      })
                      setShowAddModal(true)
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(trainer._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {trainers.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No trainers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your first trainer to showcase your gym&apos;s expert team.
            </p>
          </div>
        )}

        {/* Add/Edit Modal would go here */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Add New Trainer</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Trainer name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="trainer@vitalizefitness.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                    <input
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="5"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
                  <div className="grid grid-cols-2 gap-2">
                    {specializations.map(spec => (
                      <label key={spec} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.specializations.includes(spec)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, specializations: [...formData.specializations, spec]})
                            } else {
                              setFormData({...formData, specializations: formData.specializations.filter(s => s !== spec)})
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Brief biography of the trainer..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Optional)</label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSelectedFile(file)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    />
                    {selectedFile && (
                      <p className="text-sm text-gray-600">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                    {editingTrainer && (
                      <p className="text-sm text-gray-500">
                        Leave empty to keep current photo, or select a new file to replace it.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingTrainer(null)
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      bio: '',
                      image: '',
                      specializations: [],
                      experience: 0,
                      certifications: []
                    })
                    setSelectedFile(null)
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}