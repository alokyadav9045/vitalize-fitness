'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'
import {
  Search,
  UserCheck,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff
} from 'lucide-react'

interface AttendanceRecord {
  _id: string
  memberId: {
    _id: string
    name: string
    memberId: string
    phone?: string
    membershipType?: string
  }
  checkInTime: string
  status: string
}

interface MemberData {
  _id: string
  name: string
  memberId: string
  phone?: string
  membershipType?: string
}

interface Member {
  id: string
  name: string
  memberId: string
  phone: string
  membership: string
}

export default function CheckIn() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Member[]>([])
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [checkInStatus, setCheckInStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [todayCheckIns, setTodayCheckIns] = useState<Member[]>([])
  const { isConnected } = useRealtimeUpdates()

  useEffect(() => {
    loadTodayCheckIns()
  }, [])

  const loadTodayCheckIns = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const response = await fetch(`/api/attendance?date=${today}`)
      const data = await response.json()

      if (data.success) {
        const checkIns = data.attendance.map((att: AttendanceRecord) => ({
          id: att.memberId._id,
          name: att.memberId.name,
          memberId: att.memberId.memberId,
          phone: att.memberId.phone || '',
          membership: att.memberId.membershipType || 'Standard'
        }))
        setTodayCheckIns(checkIns)
      }
    } catch (error) {
      console.error('Failed to load today\'s check-ins:', error)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/members?search=${encodeURIComponent(query)}`)
        const data = await response.json()

        if (data.success) {
          const results = data.members.map((member: MemberData) => ({
            id: member._id,
            name: member.name,
            memberId: member.memberId,
            phone: member.phone,
            membership: member.membershipType || 'Standard'
          }))
          setSearchResults(results)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setSearchResults([])
    }
  }

  const handleCheckIn = async (member: Member) => {
    setIsCheckingIn(true)
    setCheckInStatus('idle')

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: member.id
        })
      })

      const data = await response.json()

      if (data.success) {
        setTodayCheckIns(prev => [...prev, member])
        setCheckInStatus('success')
        setSelectedMember(null)
        setSearchQuery('')
        setSearchResults([])
      } else {
        setCheckInStatus('error')
        alert(data.message || 'Check-in failed')
      }
    } catch (error) {
      console.error('Check-in error:', error)
      setCheckInStatus('error')
      alert('Failed to check in member')
    } finally {
      setIsCheckingIn(false)
    }
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Daily Check-in</h1>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <>
                  <Wifi className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-red-600 font-medium">Offline</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-2" />
            <span className="mr-4">{currentDate}</span>
            <Clock className="w-5 h-5 mr-2" />
            <span>{currentTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Check-in Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Member Check-in</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Member
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, member ID, or phone..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Search Results */}
              {isLoading && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Search Results</h3>
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-gray-600">Searching...</span>
                  </div>
                </div>
              )}

              {searchResults.length > 0 && !isLoading && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Search Results</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedMember(member)}
                      >
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">ID: {member.memberId} | {member.membership}</p>
                        </div>
                        <UserCheck className="w-5 h-5 text-primary" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Member */}
              {selectedMember && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Member</h3>
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{selectedMember.name}</p>
                        <p className="text-sm text-gray-600">
                          ID: {selectedMember.memberId} | {selectedMember.membership}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCheckIn(selectedMember)}
                        disabled={isCheckingIn}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCheckingIn ? 'Checking in...' : 'Check In'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Message */}
              {checkInStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-700">Check-in successful!</span>
                  </div>
                </div>
              )}

              {checkInStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700">Check-in failed. Please try again.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Today's Check-ins */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Today&apos;s Check-ins</h2>

            {todayCheckIns.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No check-ins yet today</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {todayCheckIns.map((member, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.membership}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{todayCheckIns.length}</p>
                <p className="text-sm text-gray-600">Total Check-ins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}