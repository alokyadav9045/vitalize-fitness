import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Attendance from '@/lib/models/Attendance'
import Member from '@/lib/models/Member'
import { broadcastEvent } from '@/lib/sse'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')
    const date = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = {}

    if (memberId) {
      query = { ...query, memberId }
    }

    if (date) {
      const targetDate = new Date(date)
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))
      query = { ...query, checkInTime: { $gte: startOfDay, $lte: endOfDay } }
    }

    if (startDate && endDate) {
      query = {
        ...query,
        checkInTime: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    }

    const attendance = await Attendance.find(query)
      .populate('memberId', 'name memberId')
      .sort({ checkInTime: -1 })

    return NextResponse.json({
      success: true,
      attendance
    })
  } catch (error) {
    console.error('Get attendance error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const {
      memberId,
      checkInTime,
      checkOutTime,
      status,
      notes
    } = body

    // Validate required fields
    if (!memberId) {
      return NextResponse.json(
        { success: false, message: 'Member ID is required' },
        { status: 400 }
      )
    }

    // Check if member exists
    const member = await Member.findById(memberId)
    if (!member) {
      return NextResponse.json(
        { success: false, message: 'Member not found' },
        { status: 404 }
      )
    }

    // Check if member is already checked in today (no checkout)
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const existingAttendance = await Attendance.findOne({
      memberId,
      checkInTime: { $gte: startOfDay, $lte: endOfDay },
      checkOutTime: null
    })

    if (existingAttendance) {
      return NextResponse.json(
        { success: false, message: 'Member is already checked in today' },
        { status: 400 }
      )
    }

    const attendance = new Attendance({
      memberId,
      date: checkInTime ? new Date(checkInTime) : new Date(),
      checkInTime: checkInTime ? new Date(checkInTime) : new Date(),
      checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
      status: status || 'Present',
      notes
    })

    await attendance.save()

    // Populate member info
    await attendance.populate('memberId', 'name memberId membershipType')

    // Broadcast real-time check-in event
    broadcastEvent({
      type: 'attendance_checkin',
      data: {
        checkin: {
          memberName: attendance.memberId.name,
          memberId: attendance.memberId.memberId,
          membershipType: attendance.memberId.membershipType || 'Standard',
          timestamp: attendance.checkInTime
        }
      },
      timestamp: new Date().toISOString()
    })

    // Send WhatsApp thank-you if enabled and member opted in
    try {
      const GymSettings = (await import('@/lib/models/GymSettings')).default
      const settings = await GymSettings.findOne()
      if (settings?.notifications?.attendanceAlerts && attendance.memberId?.phone && attendance.memberId?.whatsappOptIn) {
        const notifications = await import('@/lib/notifications')
        const token = notifications.createUnsubscribeToken(attendance.memberId._id.toString())
        const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || ''
        const unsubscribeLink = token ? `${base}/api/unsubscribe/whatsapp?memberId=${attendance.memberId._id}&token=${token}` : ''
        const msg = `Hi ${attendance.memberId.name}, thanks for checking in at Vitalize Fitness. ${unsubscribeLink ? `Unsubscribe: ${unsubscribeLink}` : ''}`
        const result = await notifications.sendWhatsApp(attendance.memberId.phone, msg)
        if (!result.success) console.error('Attendance WhatsApp failed:', result.message)
      }
    } catch (err) {
      console.error('Attendance notification error:', err)
    }

    return NextResponse.json({
      success: true,
      attendance
    }, { status: 201 })
  } catch (error) {
    console.error('Create attendance error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const {
      id,
      checkOutTime,
      notes
    } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Attendance ID is required' },
        { status: 400 }
      )
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id,
      {
        checkOutTime: checkOutTime ? new Date(checkOutTime) : new Date(),
        notes
      },
      { new: true, runValidators: true }
    ).populate('memberId', 'name memberId')

    if (!updatedAttendance) {
      return NextResponse.json(
        { success: false, message: 'Attendance record not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      attendance: updatedAttendance
    })
  } catch (error) {
    console.error('Update attendance error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Attendance ID is required' },
        { status: 400 }
      )
    }

    const deletedAttendance = await Attendance.findByIdAndDelete(id)

    if (!deletedAttendance) {
      return NextResponse.json(
        { success: false, message: 'Attendance record not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Attendance record deleted successfully'
    })
  } catch (error) {
    console.error('Delete attendance error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}