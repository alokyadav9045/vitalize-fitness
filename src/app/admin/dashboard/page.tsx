'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  UserCheck,
  Wifi,
  WifiOff
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    todayCheckIns: 0,
    monthlyRevenue: 0,
    activeMembers: 0,
    pendingFees: 0,
    expiringMembers: 0
  })
  const [recentCheckins, setRecentCheckins] = useState([
    { name: 'John Doe', time: '10:30 AM', membership: 'Premium' },
    { name: 'Jane Smith', time: '10:15 AM', membership: 'Basic' },
    { name: 'Mike Johnson', time: '9:45 AM', membership: 'Elite' },
    { name: 'Sarah Wilson', time: '9:30 AM', membership: 'Premium' }
  ])
  const { isConnected, events } = useRealtimeUpdates()

  useEffect(() => {
    fetchStats()
  }, [])

  // Handle real-time updates
  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events[events.length - 1]

      switch (latestEvent.type) {
        case 'dashboard_update':
          if (latestEvent.data.stats) {
            setStats(prev => ({ ...prev, ...latestEvent.data.stats }))
          }
          break
        case 'attendance_checkin':
          // Update check-in count and add to recent check-ins
          setStats(prev => ({ ...prev, todayCheckIns: prev.todayCheckIns + 1 }))

          if (latestEvent.data.checkin) {
            const newCheckin = {
              name: latestEvent.data.checkin.memberName,
              time: new Date(latestEvent.data.checkin.timestamp).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              }),
              membership: latestEvent.data.checkin.membershipType
            }

            setRecentCheckins(prev => [newCheckin, ...prev.slice(0, 3)])
          }
          break
        case 'member_update':
          // Refresh stats when member data changes
          fetchStats()
          break
      }
    }
  }, [events])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard')
      const data = await response.json()

      if (data.success) {
        setStats({
          totalMembers: data.data.members.total,
          todayCheckIns: data.data.attendance.today,
          monthlyRevenue: data.data.revenue.thisMonth,
          activeMembers: data.data.members.active,
          pendingFees: data.data.fees.pending,
          expiringMembers: data.data.members.expiringSoon
        })
      } else {
        console.error('Failed to fetch dashboard data:', data.message)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const statCards = [
    {
      name: 'Total Members',
      value: stats.totalMembers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Today\'s Check-ins',
      value: stats.todayCheckIns.toString(),
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      name: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      name: 'Active Members',
      value: stats.activeMembers.toLocaleString(),
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      name: 'Pending Fees',
      value: stats.pendingFees.toString(),
      icon: Calendar,
      color: 'bg-red-500'
    },
    {
      name: 'Expiring Soon',
      value: stats.expiringMembers.toString(),
      icon: UserCheck,
      color: 'bg-orange-500'
    }
  ]

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Connection Status */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between px-0 sm:px-0">
          <div className="flex items-center space-x-2 text-xs sm:text-sm">
            {isConnected ? (
              <>
                <Wifi className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0" />
                <span className="text-green-600 font-medium">Live Updates Active</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 sm:w-5 h-4 sm:h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-600 font-medium">Connecting...</span>
              </>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
          {statCards.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`p-2 sm:p-3 rounded-full ${stat.color} flex-shrink-0`}>
                  <stat.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Recent Check-ins</h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {recentCheckins.map((checkin, index) => (
                <div key={index} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-b-0 gap-2">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                      {checkin.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{checkin.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{checkin.membership}</p>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 flex-shrink-0 whitespace-nowrap">{checkin.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}