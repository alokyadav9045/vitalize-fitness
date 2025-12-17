'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  Plus,
  Edit,
  Trash2,
  Award,
  Check,
  Star
} from 'lucide-react'

interface MembershipPlan {
  _id: string
  name: string
  type: string
  price: number
  duration: number // in months
  features: string[]
  description?: string
  popular: boolean
  isActive: boolean
  createdAt: string
}

export default function Plans() {
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'Basic',
    price: 0,
    duration: 1,
    features: [] as string[],
    description: '',
    popular: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    } else {
      fetchPlans()
    }
  }, [router])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans')
      const data = await response.json()

      if (data.success) {
        setPlans(data.plans)
      } else {
        console.error('Failed to fetch plans:', data.message)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this membership plan?')) {
      try {
        const response = await fetch(`/api/plans?id=${id}`, {
          method: 'DELETE'
        })

        const data = await response.json()

        if (data.success) {
          await fetchPlans() // Refresh the list
        } else {
          console.error('Failed to delete plan:', data.message)
          alert(data.message)
        }
      } catch (error) {
        console.error('Error deleting plan:', error)
        alert('Failed to delete plan')
      }
    }
  }

  const toggleActive = async (id: string) => {
    try {
      const plan = plans.find(p => p._id === id)
      if (!plan) return

      const response = await fetch('/api/plans', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name: plan.name,
          type: plan.type,
          price: plan.price,
          duration: plan.duration,
          features: plan.features,
          description: plan.description,
          popular: plan.popular,
          isActive: !plan.isActive
        })
      })

      const data = await response.json()

      if (data.success) {
        await fetchPlans() // Refresh the list
      } else {
        console.error('Failed to toggle plan status:', data.message)
        alert(data.message)
      }
    } catch (error) {
      console.error('Error toggling plan status:', error)
      alert('Failed to toggle plan status')
    }
  }

  const togglePopular = async (id: string) => {
    try {
      const plan = plans.find(p => p._id === id)
      if (!plan) return

      const response = await fetch('/api/plans', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name: plan.name,
          type: plan.type,
          price: plan.price,
          duration: plan.duration,
          features: plan.features,
          description: plan.description,
          popular: !plan.popular,
          isActive: plan.isActive
        })
      })

      const data = await response.json()

      if (data.success) {
        await fetchPlans() // Refresh the list
      } else {
        console.error('Failed to toggle popular status:', data.message)
        alert(data.message)
      }
    } catch (error) {
      console.error('Error toggling popular status:', error)
      alert('Failed to toggle popular status')
    }
  }

  const handleEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      type: plan.type,
      price: plan.price,
      duration: plan.duration,
      features: plan.features,
      description: plan.description || '',
      popular: plan.popular
    })
    setShowAddModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingPlan ? '/api/plans' : '/api/plans'
      const method = editingPlan ? 'PUT' : 'POST'

      const requestBody = editingPlan
        ? { id: editingPlan._id, ...formData, isActive: editingPlan.isActive }
        : { ...formData, isActive: true }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (data.success) {
        await fetchPlans() // Refresh the list
        setShowAddModal(false)
        setEditingPlan(null)
        setFormData({
          name: '',
          type: 'Basic',
          price: 0,
          duration: 1,
          features: [],
          description: '',
          popular: false
        })
      } else {
        console.error('Failed to save plan:', data.message)
        alert(data.message)
      }
    } catch (error) {
      console.error('Error saving plan:', error)
      alert('Failed to save plan')
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Membership Plans</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Manage pricing plans and features displayed on the website</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary hover:bg-primary-dark text-white px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap text-sm"
            >
              <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Add Plan</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className={`bg-white rounded-lg shadow p-6 relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Award className="w-6 h-6 text-primary mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => togglePopular(plan._id)}
                    className={`p-1 rounded ${plan.popular ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                  >
                    <Star className={`w-4 h-4 ${plan.popular ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => toggleActive(plan._id)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      plan.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</span>
                  <span className="text-gray-600 ml-1">/{plan.duration} month{plan.duration > 1 ? 's' : ''}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                <ul className="space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(plan)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="text-red-600 hover:text-red-900 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {plans.length === 0 && (
          <div className="text-center py-12">
            <Award className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No membership plans found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first membership plan to start selling subscriptions.
            </p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                {editingPlan ? 'Edit Membership Plan' : 'Add New Membership Plan'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Basic Plan"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="Basic">Basic</option>
                      <option value="Premium">Premium</option>
                      <option value="Elite">Elite</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="1500"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="1"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                  <textarea
                    rows={4}
                    value={formData.features.join('\n')}
                    onChange={(e) => setFormData({...formData, features: e.target.value.split('\n').filter(f => f.trim())})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Access to gym equipment&#10;Locker facility&#10;Basic fitness assessment"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Brief description of the plan..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="popular"
                    checked={formData.popular}
                    onChange={(e) => setFormData({...formData, popular: e.target.checked})}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="popular" className="ml-2 block text-sm text-gray-900">
                    Mark as most popular plan
                  </label>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingPlan(null)
                      setFormData({
                        name: '',
                        type: 'Basic',
                        price: 0,
                        duration: 1,
                        features: [],
                        description: '',
                        popular: false
                      })
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                  >
                    {editingPlan ? 'Update' : 'Save'}
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