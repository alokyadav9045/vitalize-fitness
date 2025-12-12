import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import GalleryImage from '@/lib/models/GalleryImage'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    let query = {}
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      }
    }

    if (category) {
      query = { ...query, category }
    }

    const galleryImages = await GalleryImage.find(query).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      galleryImages
    })
  } catch (error) {
    console.error('Get gallery images error:', error)
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
      title,
      description,
      imageUrl,
      category,
      isActive
    } = body

    // Validate required fields
    if (!title || !imageUrl || !category) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const galleryImage = new GalleryImage({
      title,
      description,
      imageUrl,
      category,
      isActive: isActive ?? true
    })

    await galleryImage.save()

    return NextResponse.json({
      success: true,
      galleryImage
    }, { status: 201 })
  } catch (error) {
    console.error('Create gallery image error:', error)
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
      title,
      description,
      imageUrl,
      category,
      isActive
    } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Gallery image ID is required' },
        { status: 400 }
      )
    }

    const updatedGalleryImage = await GalleryImage.findByIdAndUpdate(
      id,
      {
        title,
        description,
        imageUrl,
        category,
        isActive
      },
      { new: true, runValidators: true }
    )

    if (!updatedGalleryImage) {
      return NextResponse.json(
        { success: false, message: 'Gallery image not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      galleryImage: updatedGalleryImage
    })
  } catch (error) {
    console.error('Update gallery image error:', error)
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
        { success: false, message: 'Gallery image ID is required' },
        { status: 400 }
      )
    }

    const deletedGalleryImage = await GalleryImage.findByIdAndDelete(id)

    if (!deletedGalleryImage) {
      return NextResponse.json(
        { success: false, message: 'Gallery image not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Gallery image deleted successfully'
    })
  } catch (error) {
    console.error('Delete gallery image error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}