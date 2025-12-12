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
              <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
              <p className="text-gray-600 mt-2">Mark daily attendance for gym members</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Real-time' : 'Offline'}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Present: {presentCount}</p>
                <p className="text-sm text-gray-600">Late: {lateCount}</p>
                <p className="text-sm text-gray-600">Absent: {absentCount}</p>
                <p className="text-sm font-medium text-primary">Rate: {attendanceRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{new Date(selectedDate).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search members by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Mark Attendance</h3>
            <p className="text-sm text-gray-600">Click Present/Absent buttons to mark attendance</p>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredMembers.map((member) => {
              const record = attendanceRecords.find(r => r.memberId.memberId === member.memberId)
              const status = record ? record.status : null
              const checkInTime = record ? new Date(record.checkInTime).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
              }) : null

              return (
                <div key={member._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">ID: {member.memberId} | {member.membershipType}</div>
                      {checkInTime && (
                        <div className="text-xs text-gray-400">Checked in at {checkInTime}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {status === 'Present' && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" />
                        <span className="text-sm font-medium">Present</span>
                      </div>
                    )}
                    {status === 'Late' && (
                      <div className="flex items-center text-yellow-600">
                        <Clock className="w-5 h-5 mr-1" />
                        <span className="text-sm font-medium">Late</span>
                      </div>
                    )}
                    {status === 'Absent' && (
                      <div className="flex items-center text-red-600">
                        <XCircle className="w-5 h-5 mr-1" />
                        <span className="text-sm font-medium">Absent</span>
                      </div>
                    )}
                    {status === null && (
                      <div className="flex items-center text-gray-400">
                        <Clock className="w-5 h-5 mr-1" />
                        <span className="text-sm">Not Marked</span>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => markAttendance(member, 'Present')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          status === 'Present'
                            ? 'bg-green-100 text-green-800 border-2 border-green-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-800'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markAttendance(member, 'Late')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          status === 'Late'
                            ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => markAttendance(member, 'Absent')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          status === 'Absent'
                            ? 'bg-red-100 text-red-800 border-2 border-red-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-800'
                        }`}
                      >
                        Absent
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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Present Today</p>
                <p className="text-2xl font-bold text-gray-900">{presentCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Late Today</p>
                <p className="text-2xl font-bold text-gray-900">{lateCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Absent Today</p>
                <p className="text-2xl font-bold text-gray-900">{absentCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{attendanceRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}