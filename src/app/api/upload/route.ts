import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

function cloudinaryConfigured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
}

// Helper function to convert buffer to readable stream
function bufferToStream(buffer: Buffer) {
  const readable = new Readable()
  readable.push(buffer)
  readable.push(null)
  return readable
}

export async function POST(request: NextRequest) {
  try {
    if (!cloudinaryConfigured()) {
      return NextResponse.json({ success: false, message: 'Cloudinary not configured on server' }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'gallery', 'testimonial', 'trainer', 'partner'

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    if (!type || !['gallery', 'testimonial', 'trainer', 'partner'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid upload type' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `vitalize-fitness/${type}`,
          public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}`,
          resource_type: 'auto',
          transformation: type === 'gallery' ? [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ] : [
            { width: 400, height: 400, crop: 'fill' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      )

      bufferToStream(buffer).pipe(stream)
    })

    const uploadResult = await uploadPromise as {
      secure_url: string
      public_id: string
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, message: 'Upload failed' },
      { status: 500 }
    )
  }
}