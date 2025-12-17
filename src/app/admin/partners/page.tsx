'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  Plus,
  Edit,
  Trash2,
  Building,
  Upload
} from 'lucide-react'

interface Partner {
  _id: string
  name: string
  logo: string
  website?: string
  description?: string
  isActive: boolean
  order: number
  createdAt: string
}

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website: '',
    description: '',
    order: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    } else {
      fetchPartners()
    }
  }, [router])

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners')
      const data = await response.json()

      if (data.success) {
        setPartners(data.partners)
      } else {
        console.error('Failed to fetch partners:', data.message)
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this partner?')) {
      try {
        const response = await fetch(`/api/partners?id=${id}`, {
          method: 'DELETE'
        })

        const data = await response.json()

        if (data.success) {
          await fetchPartners() // Refresh the list
        } else {
          console.error('Failed to delete partner:', data.message)
          alert(data.message)
        }
      } catch (error) {
        console.error('Error deleting partner:', error)
        alert('Failed to delete partner')
      }
    }
  }

  const toggleActive = async (id: string) => {
    try {
      const partner = partners.find(p => p._id === id)
      if (!partner) return

      const response = await fetch('/api/partners', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name: partner.name,
          logo: partner.logo,
          website: partner.website,
          description: partner.description,
          order: partner.order,
          isActive: !partner.isActive
        })
      })

      const data = await response.json()

      if (data.success) {
        await fetchPartners() // Refresh the list
      } else {
        console.error('Failed to toggle partner status:', data.message)
        alert(data.message)
      }
    } catch (error) {
      console.error('Error toggling partner status:', error)
      alert('Failed to toggle partner status')
    }
  }

  const handleFileUpload = async (file: File): Promise<string> => {
    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('type', 'partner')

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

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      logo: partner.logo,
      website: partner.website || '',
      description: partner.description || '',
      order: partner.order
    })
    setShowAddModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let logoUrl = formData.logo

      // Upload file if selected
      if (selectedFile) {
        logoUrl = await handleFileUpload(selectedFile)
      }

      const url = editingPartner ? '/api/partners' : '/api/partners'
      const method = editingPartner ? 'PUT' : 'POST'

      const requestBody = editingPartner
        ? { id: editingPartner._id, ...formData, logo: logoUrl }
        : { ...formData, logo: logoUrl }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (data.success) {
        await fetchPartners() // Refresh the list
        setShowAddModal(false)
        setEditingPartner(null)
        setFormData({
          name: '',
          logo: '',
          website: '',
          description: '',
          order: 0
        })
        setSelectedFile(null)
      } else {
        console.error('Failed to save partner:', data.message)
        alert(data.message)
      }
    } catch (error) {
      console.error('Error saving partner:', error)
      alert('Failed to save partner')
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Partners & Logos</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Manage partner logos and sponsorships displayed on the website</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary hover:bg-primary-dark text-white px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap text-sm"
            >
              <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Add Partner</span>
            </button>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {partners.map((partner) => (
            <div key={partner._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <Building className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                    <p className="text-sm text-gray-600">Order: {partner.order}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleActive(partner._id)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      partner.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {partner.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">Logo Preview</p>
              </div>

              {partner.description && (
                <p className="text-sm text-gray-600 mb-4">{partner.description}</p>
              )}

              {partner.website && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary-dark mb-4 block"
                >
                  {partner.website}
                </a>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(partner)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(partner._id)}
                  className="text-red-600 hover:text-red-900 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {partners.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No partners found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your first partner or sponsor to showcase on the website.
            </p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                {editingPartner ? 'Edit Partner' : 'Add New Partner'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Partner company name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
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
                      required={!editingPartner}
                    />
                    {selectedFile && (
                      <p className="text-sm text-gray-600">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                    {editingPartner && (
                      <p className="text-sm text-gray-500">
                        Leave empty to keep current logo, or select a new file to replace it.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://partner-website.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Brief description of the partnership..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingPartner(null)
                      setFormData({
                        name: '',
                        logo: '',
                        website: '',
                        description: '',
                        order: 0
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
                    {uploading ? 'Uploading...' : editingPartner ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}