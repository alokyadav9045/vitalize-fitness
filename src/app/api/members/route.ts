import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Member from '@/lib/models/Member'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let query = {}
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { memberId: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }
    }

    const members = await Member.find(query).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      members
    })
  } catch (error) {
    console.error('Get members error:', error)
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
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      membershipType,
      startDate,
      endDate
    } = body

    // Validate required fields
    if (!name || !email || !phone || !membershipType || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingMember = await Member.findOne({ email })
    if (existingMember) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      )
    }

    const member = new Member({
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      membershipType,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    })

    await member.save()

    return NextResponse.json({
      success: true,
      member
    }, { status: 201 })
  } catch (error) {
    console.error('Create member error:', error)
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
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      membershipType,
      startDate,
      endDate
    } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Member ID is required' },
        { status: 400 }
      )
    }

    // Check if email already exists for another member
    const existingMember = await Member.findOne({ email, _id: { $ne: id } })
    if (existingMember) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      )
    }

    const updatedMember = await Member.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        dateOfBirth,
        gender,
        address,
        emergencyContact,
        membershipType,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined
      },
      { new: true, runValidators: true }
    )

    if (!updatedMember) {
      return NextResponse.json(
        { success: false, message: 'Member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      member: updatedMember
    })
  } catch (error) {
    console.error('Update member error:', error)
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
        { success: false, message: 'Member ID is required' },
        { status: 400 }
      )
    }

    const deletedMember = await Member.findByIdAndDelete(id)

    if (!deletedMember) {
      return NextResponse.json(
        { success: false, message: 'Member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Member deleted successfully'
    })
  } catch (error) {
    console.error('Delete member error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}