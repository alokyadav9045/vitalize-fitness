'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react'

interface ReportData {
  totalMembers: number
  activeMembers: number
  totalRevenue: number
  monthlyRevenue: number
  attendanceRate: number
  popularServices: Array<{ name: string; count: number }>
  membershipDistribution: Array<{ type: string; count: number }>
  monthlyTrends: Array<{ month: string; revenue: number; members: number }>
}

export default function Reports() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState('month')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    } else {
      fetchReports()
    }
  }, [router, dateRange])

  const fetchReports = async () => {
    try {
      // Mock data for demonstration
      const mockData: ReportData = {
        totalMembers: 1234,
        activeMembers: 987,
        totalRevenue: 245000,
        monthlyRevenue: 45000,
        attendanceRate: 85,
        popularServices: [
          { name: 'Personal Training', count: 245 },
          { name: 'Group Classes', count: 189 },
          { name: 'Cardio Zone', count: 156 },
          { name: 'Strength Training', count: 134 }
        ],
        membershipDistribution: [
          { type: 'Basic', count: 456 },
          { type: 'Premium', count: 523 },
          { type: 'Elite', count: 255 }
        ],
        monthlyTrends: [
          { month: 'Aug', revenue: 38000, members: 45 },
          { month: 'Sep', revenue: 42000, members: 52 },
          { month: 'Oct', revenue: 39000, members: 48 },
          { month: 'Nov', revenue: 46000, members: 61 },
          { month: 'Dec', revenue: 45000, members: 58 }
        ]
      }
      setReportData(mockData)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
          <p className="mt-1 text-sm text-gray-500">Unable to load report data.</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 mt-2">Comprehensive insights into your gym&apos;s performance</p>
            </div>
            <div className="flex space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.totalMembers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.activeMembers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{reportData.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{reportData.monthlyRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Membership Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership Distribution</h3>
            <div className="space-y-4">
              {reportData.membershipDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      item.type === 'Basic' ? 'bg-blue-500' :
                      item.type === 'Premium' ? 'bg-purple-500' : 'bg-gold-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.type}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">{item.count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.type === 'Basic' ? 'bg-blue-500' :
                          item.type === 'Premium' ? 'bg-purple-500' : 'bg-gold-500'
                        }`}
                        style={{ width: `${(item.count / reportData.totalMembers) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Services */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Services</h3>
            <div className="space-y-4">
              {reportData.popularServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{service.name}</span>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">{service.count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(service.count / Math.max(...reportData.popularServices.map(s => s.count))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trends Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {reportData.monthlyTrends.map((trend, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t h-32 relative mb-2">
                  <div
                    className="bg-primary rounded-t absolute bottom-0 w-full"
                    style={{ height: `${(trend.revenue / Math.max(...reportData.monthlyTrends.map(t => t.revenue))) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">{trend.month}</span>
                <span className="text-xs font-medium text-gray-900">₹{trend.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Revenue Trends (Last 5 Months)</p>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{reportData.attendanceRate}%</p>
              <p className="text-sm text-gray-600">Average Attendance Rate</p>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${reportData.attendanceRate * 0.628} 62.8`}
                  className="text-primary"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}