export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import Member from '@/lib/models/Member'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const memberId = url.searchParams.get('memberId')
    const token = url.searchParams.get('token')

    if (!memberId || !token) {
      return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) return NextResponse.json({ success: false, message: 'Server not configured' }, { status: 500 })

    let payload: unknown
    try {
      // jwt.verify can return string or object; treat as unknown and validate below
      payload = jwt.verify(token, secret)
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 })
    }

    // validate shape before using
    if (typeof payload !== 'object' || payload === null) {
      return NextResponse.json({ success: false, message: 'Invalid token payload' }, { status: 400 })
    }

    const p = payload as { memberId?: string; action?: string }
    if (p.memberId !== memberId || p.action !== 'unsubscribe_whatsapp') {
      return NextResponse.json({ success: false, message: 'Invalid token payload' }, { status: 400 })
    }

    await Member.findByIdAndUpdate(memberId, { whatsappOptIn: false })

    return new NextResponse(`
      <html>
        <body style="font-family: Arial, sans-serif; padding: 2rem;">
          <h2>You're unsubscribed</h2>
          <p>You will no longer receive WhatsApp notifications from Vitalize Fitness.</p>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
