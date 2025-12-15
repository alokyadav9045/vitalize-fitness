import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Member from '@/lib/models/Member'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const { memberId, amount, reason } = body

    if (!memberId || !amount) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
    }

    const member = await Member.findById(memberId)
    if (!member) return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 })

    try {
      const notifications = await import('@/lib/notifications')
      const token = notifications.createUnsubscribeToken(member._id.toString())
      const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || ''
      const unsubscribeLink = token ? `${base}/api/unsubscribe/whatsapp?memberId=${member._id}&token=${token}` : ''

      const msg = `Hi ${member.name}, we were unable to process your payment of ₹${amount}. Reason: ${reason || 'Unknown'}. Please retry or contact us. ${unsubscribeLink ? `Unsubscribe: ${unsubscribeLink}` : ''}`

      if (member.whatsappOptIn && member.phone) {
        const res = await notifications.sendWhatsApp(member.phone, msg)
        if (!res.success) console.error('Failed to send payment-failure WhatsApp:', res.message)
      }
    } catch (err) {
      console.error('Payment failure notify error:', err)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Payment failure error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
