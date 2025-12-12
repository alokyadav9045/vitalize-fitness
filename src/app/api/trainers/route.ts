import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Trainer from '@/lib/models/Trainer'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const specialization = searchParams.get('specialization')

    let query = {}
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { bio: { $regex: search, $options: 'i' } },
          { specializations: { $in: [new RegExp(search, 'i')] } }
        ]
      }
    }

    if (specialization) {
      query = { ...query, specializations: specialization }
    }

    const trainers = await Trainer.find(query).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      trainers
    })
  } catch (error) {
    console.error('Get trainers error:', error)
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
      bio,
      image,
      specializations,
      experience,
      certifications,
      contactInfo,
      isActive
    } = body

    // Validate required fields
    if (!name || !bio || !specializations || specializations.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const trainer = new Trainer({
      name,
      bio,
      image,
      specializations,
      experience,
      certifications,
      contactInfo,
      isActive: isActive ?? true
    })

    await trainer.save()

    return NextResponse.json({
      success: true,
      trainer
    }, { status: 201 })
  } catch (error) {
    console.error('Create trainer error:', error)
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
      bio,
      image,
      specializations,
      experience,
      certifications,
      contactInfo,
      isActive
    } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Trainer ID is required' },
        { status: 400 }
      )
    }

    const updatedTrainer = await Trainer.findByIdAndUpdate(
      id,
      {
        name,
        bio,
        image,
        specializations,
        experience,
        certifications,
        contactInfo,
        isActive
      },
      { new: true, runValidators: true }
    )

    if (!updatedTrainer) {
      return NextResponse.json(
        { success: false, message: 'Trainer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      trainer: updatedTrainer
    })
  } catch (error) {
    console.error('Update trainer error:', error)
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
        { success: false, message: 'Trainer ID is required' },
        { status: 400 }
      )
    }

    const deletedTrainer = await Trainer.findByIdAndDelete(id)

    if (!deletedTrainer) {
      return NextResponse.json(
        { success: false, message: 'Trainer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Trainer deleted successfully'
    })
  } catch (error) {
    console.error('Delete trainer error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}