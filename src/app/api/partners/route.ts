import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Partner from '@/lib/models/Partner'

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
          { description: { $regex: search, $options: 'i' } }
        ]
      }
    }

    const partners = await Partner.find(query).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      partners
    })
  } catch (error) {
    console.error('Get partners error:', error)
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
      logo,
      website,
      isActive
    } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      )
    }

    const partner = new Partner({
      name,
      description,
      logo,
      website,
      isActive: isActive ?? true
    })

    await partner.save()

    return NextResponse.json({
      success: true,
      partner
    }, { status: 201 })
  } catch (error) {
    console.error('Create partner error:', error)
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
      logo,
      website,
      isActive
    } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Partner ID is required' },
        { status: 400 }
      )
    }

    const updatedPartner = await Partner.findByIdAndUpdate(
      id,
      {
        name,
        description,
        logo,
        website,
        isActive
      },
      { new: true, runValidators: true }
    )

    if (!updatedPartner) {
      return NextResponse.json(
        { success: false, message: 'Partner not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      partner: updatedPartner
    })
  } catch (error) {
    console.error('Update partner error:', error)
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
        { success: false, message: 'Partner ID is required' },
        { status: 400 }
      )
    }

    const deletedPartner = await Partner.findByIdAndDelete(id)

    if (!deletedPartner) {
      return NextResponse.json(
        { success: false, message: 'Partner not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Partner deleted successfully'
    })
  } catch (error) {
    console.error('Delete partner error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}