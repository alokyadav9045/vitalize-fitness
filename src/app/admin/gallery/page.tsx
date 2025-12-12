'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Eye
} from 'lucide-react'

interface GalleryImage {
  _id: string
  title: string
  imageUrl: string
  category: string
  description?: string
  isActive: boolean
  createdAt: string
}

const categories = [
  'equipment',
  'classes',
  'cardio',
  'strength',
  'yoga',
  'facilities',
  'training',
  'crossfit'
]

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [viewingImage, setViewingImage] = useState<GalleryImage | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    category: 'equipment',
    description: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true)
      const queryParams = selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''
      const response = await fetch(`/api/gallery${queryParams}`)
      const data = await response.json()

      if (data.success) {
        setImages(data.galleryImages)
      } else {
        console.error('Failed to fetch gallery images:', data.message)
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    } else {
      fetchImages()
    }
  }, [router, fetchImages])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        const response = await fetch(`/api/gallery?id=${id}`, {
          method: 'DELETE'
        })

        const data = await response.json()

        if (data.success) {
          await fetchImages() // Refresh the list
        } else {
          console.error('Failed to delete image:', data.message)
          alert(data.message)
        }
      } catch (error) {
        console.error('Error deleting image:', error)
        alert('Failed to delete image')
      }
    }
  }

  const toggleActive = async (id: string) => {
    try {
      const image = images.find(img => img._id === id)
      if (!image) return

      const response = await fetch('/api/gallery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title: image.title,
          imageUrl: image.imageUrl,
          category: image.category,
          description: image.description,
          isActive: !image.isActive
        })
      })

      const data = await response.json()

      if (data.success) {
        await fetchImages() // Refresh the list
      } else {
        console.error('Failed to toggle image status:', data.message)
        alert(data.message)
      }
    } catch (error) {
      console.error('Error toggling image status:', error)
      alert('Failed to toggle image status')
    }
  }

  const handleView = (image: GalleryImage) => {
    setViewingImage(image)
  }

  const handleFileUpload = async (file: File): Promise<string> => {
    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('type', 'gallery')

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
      let imageUrl = formData.imageUrl

      // Upload file if selected
      if (selectedFile) {
        imageUrl = await handleFileUpload(selectedFile)
      }

      const url = editingImage ? '/api/gallery' : '/api/gallery'
      const method = editingImage ? 'PUT' : 'POST'

      const requestBody = editingImage
        ? { id: editingImage._id, ...formData, imageUrl }
        : { ...formData, imageUrl }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (data.success) {
        await fetchImages() // Refresh the list
        setShowAddModal(false)
        setEditingImage(null)
        setSelectedFile(null)
        setFormData({
          title: '',
          imageUrl: '',
          category: 'equipment',
          description: ''
        })
      } else {
        console.error('Failed to save gallery image:', data.message)
        alert(data.message)
      }
    } catch (error) {
      console.error('Error saving gallery image:', error)
      alert('Failed to save gallery image')
    }
  }

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory)

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
              <p className="text-gray-600 mt-2">Manage images displayed in the website gallery</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Image
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div key={image._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative">
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => toggleActive(image._id)}
                    className={`p-1 rounded text-xs font-medium ${
                      image.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{image.title}</h3>
                <p className="text-sm text-gray-600 mb-2 capitalize">{image.category}</p>
                {image.description && (
                  <p className="text-sm text-gray-500 mb-3">{image.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(image)}
                      className="text-primary hover:text-primary-dark p-1"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingImage(image)
                        setFormData({
                          title: image.title,
                          imageUrl: image.imageUrl,
                          category: image.category,
                          description: image.description || ''
                        })
                        setShowAddModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Edit Image"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedCategory === 'all'
                ? 'Add your first gallery image to showcase your gym.'
                : `No images found in the ${selectedCategory} category.`}
            </p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {editingImage ? 'Edit Gallery Image' : 'Add New Gallery Image'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Image title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="capitalize">{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image File</label>
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
                      required={!editingImage}
                    />
                    {selectedFile && (
                      <p className="text-sm text-gray-600">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                    {editingImage && (
                      <p className="text-sm text-gray-500">
                        Leave empty to keep current image, or select a new file to replace it.
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Image description"
                    rows={3}
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingImage(null)
                      setFormData({
                        title: '',
                        imageUrl: '',
                        category: 'equipment',
                        description: ''
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
                    {uploading ? 'Uploading...' : editingImage ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {viewingImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Gallery Image Details</h3>
                <button
                  onClick={() => setViewingImage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Image Preview */}
                <div className="flex justify-center">
                  <div className="w-full max-w-md h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                </div>

                {/* Image Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Image Information</h5>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-600 w-20">Title:</span>
                        <span className="text-gray-900">{viewingImage.title}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-600 w-20">Category:</span>
                        <span className="text-gray-900 capitalize">{viewingImage.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Status & Settings</h5>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-600 w-20">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          viewingImage.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {viewingImage.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {viewingImage.description && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                    <p className="text-gray-700 text-sm leading-relaxed">{viewingImage.description}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Image ID: {viewingImage._id}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleActive(viewingImage._id)}
                      className={`px-4 py-2 rounded text-sm font-medium ${
                        viewingImage.isActive
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {viewingImage.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => {
                        setViewingImage(null)
                        setEditingImage(viewingImage)
                        setShowAddModal(true)
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                    >
                      Edit Image
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