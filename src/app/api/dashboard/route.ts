import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Member from '@/lib/models/Member'
import Attendance from '@/lib/models/Attendance'
import Fee from '@/lib/models/Fee'
import Testimonial from '@/lib/models/Testimonial'
import GalleryImage from '@/lib/models/GalleryImage'

export async function GET() {
  try {
    await dbConnect()

    // Get current date and date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const endOfYear = new Date(now.getFullYear(), 11, 31)

    // Run all queries in parallel for better performance
    const [
      totalMembers,
      activeMembers,
      thisMonthMembers,
      thisYearMembers,
      todayAttendance,
      thisMonthAttendance,
      pendingFees,
      overdueFees,
      totalRevenue,
      thisMonthRevenue,
      activeTestimonials,
      activeGalleryImages
    ] = await Promise.all([
      // Member statistics
      Member.countDocuments(),
      Member.countDocuments({ endDate: { $gte: now } }),
      Member.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
      Member.countDocuments({ createdAt: { $gte: startOfYear, $lte: endOfYear } }),

      // Attendance statistics
      Attendance.countDocuments({
        checkInTime: {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        }
      }),
      Attendance.countDocuments({
        checkInTime: { $gte: startOfMonth, $lte: endOfMonth }
      }),

      // Fee statistics
      Fee.countDocuments({ status: 'pending' }),
      Fee.countDocuments({
        status: 'pending',
        dueDate: { $lt: now }
      }),

      // Revenue statistics
      Fee.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Fee.aggregate([
        {
          $match: {
            status: 'paid',
            paymentDate: { $gte: startOfMonth, $lte: endOfMonth }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),

      // Content statistics
      Testimonial.countDocuments({ isActive: true }),
      GalleryImage.countDocuments({ isActive: true })
    ])

    // Extract revenue values
    const totalRevenueAmount = totalRevenue.length > 0 ? totalRevenue[0].total : 0
    const thisMonthRevenueAmount = thisMonthRevenue.length > 0 ? thisMonthRevenue[0].total : 0

    // Calculate membership expiry warnings (next 30 days)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const expiringMembers = await Member.countDocuments({
      endDate: { $gte: now, $lte: thirtyDaysFromNow }
    })

    const dashboardData = {
      members: {
        total: totalMembers,
        active: activeMembers,
        thisMonth: thisMonthMembers,
        thisYear: thisYearMembers,
        expiringSoon: expiringMembers
      },
      attendance: {
        today: todayAttendance,
        thisMonth: thisMonthAttendance
      },
      fees: {
        pending: pendingFees,
        overdue: overdueFees
      },
      revenue: {
        total: totalRevenueAmount,
        thisMonth: thisMonthRevenueAmount
      },
      content: {
        testimonials: activeTestimonials,
        galleryImages: activeGalleryImages
      }
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    })
  } catch (error) {
    console.error('Get dashboard data error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}