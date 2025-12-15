import type { Twilio } from 'twilio'

let client: Twilio | null = null

function getClient() {
  if (client) return client
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN

  if (!sid || !token) return null

  // Lazy import to avoid requiring Twilio in environments without creds
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const twilio = require('twilio') as typeof import('twilio')
  client = twilio(sid, token)
  return client
}

export async function sendWhatsApp(to: string, body: string) {
  const c = getClient()
  const from = process.env.TWILIO_WHATSAPP_FROM

  if (!c || !from) {
    return { success: false, message: 'Twilio not configured' }
  }

  try {
    const message = await c.messages.create({
      from,
      to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
      body
    })
    return { success: true, sid: message.sid }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : String(error) }
  }
}

export async function sendSMS(to: string, body: string) {
  const c = getClient()
  const from = process.env.TWILIO_PHONE_NUMBER

  if (!c || !from) {
    return { success: false, message: 'Twilio SMS not configured' }
  }

  try {
    const message = await c.messages.create({ from, to, body })
    return { success: true, sid: message.sid }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : String(error) }
  }
}

export function createUnsubscribeToken(memberId: string) {
  const jwt = require('jsonwebtoken')
  const secret = process.env.JWT_SECRET
  if (!secret) return null
  return jwt.sign({ memberId, action: 'unsubscribe_whatsapp' }, secret, { expiresIn: '30d' })
}

export default { sendWhatsApp, sendSMS, createUnsubscribeToken }
