import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import MembershipPlan from '@/lib/models/MembershipPlan'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const type = searchParams.get('type')

    let query = {}
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      }
    }

    if (type) {
      query = { ...query, type }
    }

    const plans = await MembershipPlan.find(query).sort({ price: 1 })

    return NextResponse.json({
      success: true,
      plans
    })
  } catch (error) {
    console.error('Get plans error:', error)
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
      description,
      type,
      duration,
      price,
      features,
      isActive
    } = body

    // Validate required fields
    if (!name || !type || !duration || !price) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate price
    if (price < 0) {
      return NextResponse.json(
        { success: false, message: 'Price must be positive' },
        { status: 400 }
      )
    }

    const plan = new MembershipPlan({
      name,
      description,
      type,
      duration,
      price,
      features,
      isActive: isActive ?? true
    })

    await plan.save()

    return NextResponse.json({
      success: true,
      plan
    }, { status: 201 })
  } catch (error) {
    console.error('Create plan error:', error)
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
      description,
      type,
      duration,
      price,
      features,
      isActive
    } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Plan ID is required' },
        { status: 400 }
      )
    }

    // Validate price if provided
    if (price !== undefined && price < 0) {
      return NextResponse.json(
        { success: false, message: 'Price must be positive' },
        { status: 400 }
      )
    }

    const updatedPlan = await MembershipPlan.findByIdAndUpdate(
      id,
      {
        name,
        description,
        type,
        duration,
        price,
        features,
        isActive
      },
      { new: true, runValidators: true }
    )

    if (!updatedPlan) {
      return NextResponse.json(
        { success: false, message: 'Plan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      plan: updatedPlan
    })
  } catch (error) {
    console.error('Update plan error:', error)
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
        { success: false, message: 'Plan ID is required' },
        { status: 400 }
      )
    }

    const deletedPlan = await MembershipPlan.findByIdAndDelete(id)

    if (!deletedPlan) {
      return NextResponse.json(
        { success: false, message: 'Plan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Plan deleted successfully'
    })
  } catch (error) {
    console.error('Delete plan error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}