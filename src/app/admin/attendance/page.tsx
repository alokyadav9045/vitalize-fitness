'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Search,
  TrendingUp
} from 'lucide-react'

interface Member {
  _id: string
  memberId: string
  name: string
  email: string
  phone: string
  membershipType: string
  status: string
}

interface AttendanceRecord {
  _id: string
  memberId: {
    _id: string
    name: string
    memberId: string
  }
  date: string
  checkInTime: string
  checkOutTime?: string
  status: 'Present' | 'Late' | 'Absent'
  createdAt: string
}

export default function Attendance() {
  const [members, setMembers] = useState<Member[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { isConnected, events } = useRealtimeUpdates()

  const loadAttendanceRecords = useCallback(async () => {
    try {
      const response = await fetch(`/api/attendance?date=${selectedDate}`)
      const data = await response.json()

      if (data.success) {
        setAttendanceRecords(data.attendance)
      } else {
        console.error('Failed to load attendance records:', data.message)
      }
    } catch (error) {
      console.error('Error loading attendance records:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedDate])

  // Handle real-time attendance updates
  useEffect(() => {
    const latestEvent = events[events.length - 1]
    if (latestEvent && latestEvent.type === 'attendance_checkin') {
      // Refresh attendance records when new check-in occurs
      loadAttendanceRecords()
    }
  }, [events, loadAttendanceRecords])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      const data = await response.json()

      if (data.success) {
        setMembers(data.members)
      } else {
        console.error('Failed to fetch members:', data.message)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    } else {
      fetchMembers()
      loadAttendanceRecords()
    }
  }, [router, loadAttendanceRecords])

  const markAttendance = async (member: Member, status: 'Present' | 'Late' | 'Absent') => {
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: member._id,
          checkInTime: new Date().toISOString(),
          status: status
        })
      })

      const data = await response.json()

      if (data.success) {
        await loadAttendanceRecords() // Refresh the records
      } else {
        console.error('Failed to mark attendance:', data.message)
        alert(data.message)
      }
    } catch (error) {
      console.error('Error marking attendance:', error)
      alert('Failed to mark attendance')
    }
  }

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.memberId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const presentCount = attendanceRecords.filter(r => r.status === 'Present' || r.status === 'Late').length
  const lateCount = attendanceRecords.filter(r => r.status === 'Late').length
  const absentCount = members.length - presentCount
  const attendanceRate = members.length > 0 ? Math.round((presentCount / members.length) * 100) : 0

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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Attendance Management</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Mark daily attendance for gym members</p>
            </div>
            <div className="flex flex-col xs:flex-row xs:items-center gap-3 xs:space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs sm:text-sm text-gray-600">
                  {isConnected ? 'Real-time' : 'Offline'}
                </span>
              </div>
              <div className="text-left xs:text-right">
                <p className="text-xs sm:text-sm text-gray-600">Present: {presentCount}</p>
                <p className="text-xs sm:text-sm text-gray-600">Late: {lateCount}</p>
                <p className="text-xs sm:text-sm text-gray-600">Absent: {absentCount}</p>
                <p className="text-xs sm:text-sm font-medium text-primary">Rate: {attendanceRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center text-gray-600 text-xs sm:text-sm mt-2 sm:mt-0">
              <Calendar className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              <span className="truncate">{new Date(selectedDate).toLocaleDateString('en-IN', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Mark Attendance</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Click Present/Absent buttons to mark attendance</p>
          </div>

          <div className="divide-y divide-gray-200 overflow-x-auto">
            {filteredMembers.map((member) => {
              const record = attendanceRecords.find(r => r.memberId.memberId === member.memberId)
              const status = record ? record.status : null
              const checkInTime = record ? new Date(record.checkInTime).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
              }) : null

              return (
                <div key={member._id} className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-gray-50">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="flex-shrink-0 h-8 sm:h-10 w-8 sm:w-10">
                      <div className="h-full w-full rounded-full bg-primary flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{member.name}</div>
                      <div className="text-xs text-gray-500 truncate">ID: {member.memberId}</div>
                      <div className="text-xs text-gray-500 hidden sm:block">{member.membershipType}</div>
                      {checkInTime && (
                        <div className="text-xs text-gray-400">@{checkInTime}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                    {status === 'Present' && (
                      <div className="flex items-center text-green-600 text-xs sm:text-sm">
                        <CheckCircle className="w-3 sm:w-5 h-3 sm:h-5 mr-1" />
                        <span className="hidden sm:inline font-medium">Present</span>
                      </div>
                    )}
                    {status === 'Late' && (
                      <div className="flex items-center text-yellow-600 text-xs sm:text-sm">
                        <Clock className="w-3 sm:w-5 h-3 sm:h-5 mr-1" />
                        <span className="hidden sm:inline font-medium">Late</span>
                      </div>
                    )}
                    {status === 'Absent' && (
                      <div className="flex items-center text-red-600 text-xs sm:text-sm">
                        <XCircle className="w-3 sm:w-5 h-3 sm:h-5 mr-1" />
                        <span className="hidden sm:inline font-medium">Absent</span>
                      </div>
                    )}
                    {status === null && (
                      <div className="flex items-center text-gray-400 text-xs sm:text-sm">
                        <Clock className="w-3 sm:w-5 h-3 sm:h-5 mr-1" />
                        <span className="hidden sm:inline">Not Marked</span>
                      </div>
                    )}

                    <div className="flex gap-1 sm:gap-2 flex-wrap justify-end sm:justify-start">
                      <button
                        onClick={() => markAttendance(member, 'Present')}
                        className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                          status === 'Present'
                            ? 'bg-green-100 text-green-800 border-2 border-green-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-800'
                        }`}
                      >
                        <span className="sm:hidden">P</span>
                        <span className="hidden sm:inline">Present</span>
                      </button>
                      <button
                        onClick={() => markAttendance(member, 'Late')}
                        className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                          status === 'Late'
                            ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800'
                        }`}
                      >
                        <span className="sm:hidden">L</span>
                        <span className="hidden sm:inline">Late</span>
                      </button>
                      <button
                        onClick={() => markAttendance(member, 'Absent')}
                        className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                          status === 'Absent'
                            ? 'bg-red-100 text-red-800 border-2 border-red-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-800'
                        }`}
                      >
                        <span className="sm:hidden">A</span>
                        <span className="hidden sm:inline">Absent</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? 'Try adjusting your search query.' : 'No active members available.'}
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-lg shadow p-3 sm:p-6">
            <div className="flex items-center flex-col sm:flex-row">
              <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-4 sm:w-6 h-4 sm:h-6 text-green-600" />
              </div>
              <div className="mt-2 sm:mt-0 sm:ml-4 text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Present Today</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{presentCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-6">
            <div className="flex items-center flex-col sm:flex-row">
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-full">
                <Clock className="w-4 sm:w-6 h-4 sm:h-6 text-yellow-600" />
              </div>
              <div className="mt-2 sm:mt-0 sm:ml-4 text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Late Today</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{lateCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-6">
            <div className="flex items-center flex-col sm:flex-row">
              <div className="p-2 sm:p-3 bg-red-100 rounded-full">
                <XCircle className="w-4 sm:w-6 h-4 sm:h-6 text-red-600" />
              </div>
              <div className="mt-2 sm:mt-0 sm:ml-4 text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Absent Today</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{absentCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-6 col-span-2 sm:col-span-1">
            <div className="flex items-center flex-col sm:flex-row">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                <TrendingUp className="w-4 sm:w-6 h-4 sm:h-6 text-blue-600" />
              </div>
              <div className="mt-2 sm:mt-0 sm:ml-4 text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{attendanceRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}