import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Testimonial from '@/lib/models/Testimonial'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const rating = searchParams.get('rating')

    let query = {}
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } }
        ]
      }
    }

    if (rating) {
      query = { ...query, rating: parseInt(rating) }
    }

    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      testimonials
    })
  } catch (error) {
    console.error('Get testimonials error:', error)
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
      role,
      content,
      message,
      rating,
      image,
      isActive
    } = body

    // Support both 'message' and 'content' from clients
    const testimonialMessage = content ?? message

    // Validate required fields
    if (!name || !role || !testimonialMessage || !rating) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (name, role, message, rating)' },
        { status: 400 }
      )
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const testimonial = new Testimonial({
      name,
      role,
      content: testimonialMessage,
      rating,
      image,
      isActive: isActive ?? true
    })

    await testimonial.save()

    return NextResponse.json({
      success: true,
      testimonial
    }, { status: 201 })
  } catch (error) {
    console.error('Create testimonial error:', error)
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
      role,
      content,
      message,
      rating,
      image,
      isActive
    } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Testimonial ID is required' },
        { status: 400 }
      )
    }

    // Support both 'message' and 'content'
    const testimonialMessage = content ?? message

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      {
        name,
        role,
        content: testimonialMessage,
        rating,
        image,
        isActive
      },
      { new: true, runValidators: true }
    )

    if (!updatedTestimonial) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      testimonial: updatedTestimonial
    })
  } catch (error) {
    console.error('Update testimonial error:', error)
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
        { success: false, message: 'Testimonial ID is required' },
        { status: 400 }
      )
    }

    const deletedTestimonial = await Testimonial.findByIdAndDelete(id)

    if (!deletedTestimonial) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    })
  } catch (error) {
    console.error('Delete testimonial error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}