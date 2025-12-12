import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import Admin from '@/lib/models/Admin'
import logger from '@/lib/logger'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { username, password } = await request.json()

    // Find admin user
    const admin = await Admin.findOne({ username, isActive: true })
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { username: admin.username, role: admin.role },
      JWT_SECRET!,
      { expiresIn: '24h' }
    )

    return NextResponse.json({
      success: true,
      token,
      admin: {
        username: admin.username,
        name: admin.name,
        role: admin.role
      }
    })
  } catch (error) {
    logger.error('Login error:', { error: error instanceof Error ? error.message : String(error), username: 'unknown' })
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}