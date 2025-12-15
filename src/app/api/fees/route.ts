import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Fee from '@/lib/models/Fee'
import Member from '@/lib/models/Member'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = {}

    if (memberId) {
      query = { ...query, memberId }
    }

    if (status) {
      query = { ...query, status }
    }

    if (startDate && endDate) {
      query = {
        ...query,
        dueDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    }

    const fees = await Fee.find(query)
      .populate('memberId', 'name memberId email')
      .sort({ dueDate: -1 })

    return NextResponse.json({
      success: true,
      fees
    })
  } catch (error) {
    console.error('Get fees error:', error)
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
      amount,
      paymentMode,
      month,
      year,
      notes
    } = body

    // Validate required fields
    if (!memberId || !amount || !paymentMode || !month || !year) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
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

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Amount must be positive' },
        { status: 400 }
      )
    }

    const fee = new Fee({
      memberId,
      amount,
      paymentDate: new Date(),
      paymentMode,
      month,
      year,
      notes
    })

    await fee.save()

    // Populate member info
    await fee.populate('memberId', 'name memberId email phone')

    // Send notifications if enabled
    try {
      const GymSettings = (await import('@/lib/models/GymSettings')).default
      const settings = await GymSettings.findOne()

      if (settings?.notifications?.whatsappReminders && fee.memberId?.phone) {
        const notifications = await import('@/lib/notifications')
        // Ensure phone has country code and is in E.164 format
        const phone = fee.memberId.phone
        const token = notifications.createUnsubscribeToken(fee.memberId._id.toString())
        const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || ''
        const unsubscribeLink = token ? `${base}/api/unsubscribe/whatsapp?memberId=${fee.memberId._id}&token=${token}` : ''
        const message = `Hi ${fee.memberId.name}, we received your payment of ₹${fee.amount}. Thank you for choosing Vitalize Fitness! ${unsubscribeLink ? `Unsubscribe: ${unsubscribeLink}` : ''}`
        const result = await notifications.sendWhatsApp(phone, message)
        if (!result.success) {
          console.error('WhatsApp notification failed:', result.message)
        }
      }
    } catch (err) {
      console.error('Notification error:', err)
    }

    return NextResponse.json({
      success: true,
      fee
    }, { status: 201 })
  } catch (error) {
    console.error('Create fee error:', error)
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
      amount,
      description,
      dueDate,
      type,
      status,
      paymentDate,
      notes
    } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Fee ID is required' },
        { status: 400 }
      )
    }

    // Validate amount if provided
    if (amount !== undefined && amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Amount must be positive' },
        { status: 400 }
      )
    }

    const updateData: Partial<{
      amount: number
      description: string
      dueDate: Date
      type: string
      status: string
      paymentDate: Date
      notes: string
    }> = {}
    if (amount !== undefined) updateData.amount = amount
    if (description !== undefined) updateData.description = description
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate)
    if (type !== undefined) updateData.type = type
    if (status !== undefined) updateData.status = status
    if (paymentDate !== undefined) updateData.paymentDate = new Date(paymentDate)
    if (notes !== undefined) updateData.notes = notes

    const updatedFee = await Fee.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('memberId', 'name memberId email')

    if (!updatedFee) {
      return NextResponse.json(
        { success: false, message: 'Fee not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      fee: updatedFee
    })
  } catch (error) {
    console.error('Update fee error:', error)
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
        { success: false, message: 'Fee ID is required' },
        { status: 400 }
      )
    }

    const deletedFee = await Fee.findByIdAndDelete(id)

    if (!deletedFee) {
      return NextResponse.json(
        { success: false, message: 'Fee not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Fee deleted successfully'
    })
  } catch (error) {
    console.error('Delete fee error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}