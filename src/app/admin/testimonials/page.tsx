'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  Plus,
  Edit,
  Trash2,
  Star,
  Quote,
  Eye
} from 'lucide-react'

interface Testimonial {
  _id: string
  name: string
  role: string
  content: string
  rating: number
  image?: string
  isActive: boolean
  createdAt: string
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [viewingTestimonial, setViewingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
    image: '',
    isActive: true
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    } else {
      fetchTestimonials()
    }
  }, [router])

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/testimonials')
      const data = await response.json()

      if (data.success) {
        setTestimonials(data.testimonials)
      } else {
        console.error('Failed to fetch testimonials:', data.message)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const response = await fetch(`/api/testimonials?id=${id}`, {
          method: 'DELETE'
        })

        const data = await response.json()

        if (data.success) {
          await fetchTestimonials() // Refresh the list
        } else {
          console.error('Failed to delete testimonial:', data.message)
          alert(data.message)
        }
      } catch (error) {
        console.error('Error deleting testimonial:', error)
        alert('Failed to delete testimonial')
      }
    }
  }

  const toggleActive = async (id: string) => {
    try {
      const testimonial = testimonials.find(t => t._id === id)
      if (!testimonial) return

      const response = await fetch('/api/testimonials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name: testimonial.name,
          content: testimonial.content,
          rating: testimonial.rating,
          image: testimonial.image,
          isActive: !testimonial.isActive
        })
      })

      const data = await response.json()

      if (data.success) {
        await fetchTestimonials() // Refresh the list
      } else {
        console.error('Failed to toggle testimonial status:', data.message)
        alert(data.message)
      }
    } catch (error) {
      console.error('Error toggling testimonial status:', error)
      alert('Failed to toggle testimonial status')
    }
  }

  const handleFileUpload = async (file: File): Promise<string> => {
    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('type', 'testimonial')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const data = await response.json()

      if (data.success) {
        return data.url
      } else {
        throw new Error(data.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let imageUrl = formData.image

      // Upload file if selected
      if (selectedFile) {
        imageUrl = await handleFileUpload(selectedFile)
      }

      const url = editingTestimonial ? '/api/testimonials' : '/api/testimonials'
      const method = editingTestimonial ? 'PUT' : 'POST'

      const requestBody = editingTestimonial
        ? { id: editingTestimonial._id, ...formData, image: imageUrl }
        : { ...formData, image: imageUrl }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (data.success) {
        await fetchTestimonials() // Refresh the list
        setShowAddModal(false)
        setEditingTestimonial(null)
        setFormData({
          name: '',
          role: '',
          content: '',
          rating: 5,
          image: '',
          isActive: true
        })
        setSelectedFile(null)
      } else {
        console.error('Failed to save testimonial:', data.message)
        alert(data.message)
      }
    } catch (error) {
      console.error('Error saving testimonial:', error)
      alert('Failed to save testimonial')
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
      image: testimonial.image || '',
      isActive: testimonial.isActive
    })
    setShowAddModal(true)
  }

  const handleView = (testimonial: Testimonial) => {
    setViewingTestimonial(testimonial)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Testimonials Management</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Manage customer testimonials displayed on the website</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary hover:bg-primary-dark text-white px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap text-sm"
            >
              <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Add Testimonial</span>
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Quote className="w-8 h-8 text-primary/20" />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleActive(testimonial._id)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      testimonial.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {testimonial.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 italic">&ldquo;{testimonial.content}&rdquo;</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
                <div className="flex items-center">
                  {renderStars(testimonial.rating)}
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleView(testimonial)}
                  className="text-primary hover:text-primary-dark p-1"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(testimonial)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                  title="Edit Testimonial"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(testimonial._id)}
                  className="text-red-600 hover:text-red-900 p-1"
                  title="Delete Testimonial"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <Quote className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No testimonials found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first customer testimonial.
            </p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Customer name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Premium Member"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Content</label>
                  <textarea
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Customer testimonial text..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
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
                      {editingTestimonial && (
                        <p className="text-sm text-gray-500">
                          Leave empty to keep current photo, or select a new file to replace it.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingTestimonial(null)
                      setFormData({
                        name: '',
                        role: '',
                        content: '',
                        rating: 5,
                        image: '',
                        isActive: true
                      })
                      setSelectedFile(null)
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {viewingTestimonial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Testimonial Details</h3>
                <button
                  onClick={() => setViewingTestimonial(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-xl">
                    {viewingTestimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{viewingTestimonial.name}</h4>
                    <p className="text-gray-600">{viewingTestimonial.role}</p>
                    <div className="flex items-center mt-1">
                      {renderStars(viewingTestimonial.rating)}
                      <span className="ml-2 text-sm text-gray-500">
                        ({viewingTestimonial.rating} star{viewingTestimonial.rating !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Quote className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-gray-700 italic leading-relaxed">
                      &ldquo;{viewingTestimonial.content}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      viewingTestimonial.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {viewingTestimonial.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setViewingTestimonial(null)
                        handleEdit(viewingTestimonial)
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                    >
                      Edit Testimonial
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}