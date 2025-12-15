import { jest } from '@jest/globals'

// Mock next/server to avoid runtime Request/Response issues
jest.mock('next/server', () => ({
  NextRequest: class {},
  NextResponse: {
    json: (payload: any, opts?: any) => ({ status: opts?.status || 200, body: payload })
  }
}))

// Mock DB and models
jest.mock('@/lib/mongodb', () => ({ __esModule: true, default: async () => {} }))
jest.mock('@/lib/models/GymSettings', () => ({ __esModule: true, default: { findOne: jest.fn().mockResolvedValue({ notifications: { whatsappReminders: true } }) } }))
jest.mock('@/lib/models/Member', () => ({ __esModule: true, default: { findById: jest.fn().mockResolvedValue({ _id: 'm1', name: 'Test User', phone: '+1234567890', whatsappOptIn: true }) } }))
jest.mock('@/lib/models/Fee', () => ({ __esModule: true, default: jest.fn().mockImplementation(function (data) {
  // minimal Fee instance mock
  const instance: any = {
    ...data,
    memberId: { _id: 'm1', name: 'Test User', phone: '+1234567890', whatsappOptIn: true },
    save: jest.fn().mockResolvedValue(undefined),
    populate: jest.fn().mockImplementation(async function () { return this })
  }
  return instance
}) }))

// Mock Twilio factory
const mockCreate = jest.fn().mockResolvedValue({ sid: 'SM123' })
jest.mock('twilio', () => {
  return jest.fn().mockImplementation(() => ({ messages: { create: mockCreate } }))
})

describe('Fees notifications integration', () => {
  it('calls Twilio when fee is created and notifications enabled', async () => {
    process.env.TWILIO_ACCOUNT_SID = 'AC123'
    process.env.TWILIO_AUTH_TOKEN = 'auth'
    process.env.TWILIO_WHATSAPP_FROM = 'whatsapp:+1415'
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret'

    const fees = await import('@/app/api/fees/route')

    // Mock request object for NextRequest: must have json() and url
    const req = {
      json: async () => ({ memberId: 'm1', amount: 1000, paymentMode: 'Cash', month: 12, year: 2025 }),
      url: 'http://localhost/api/fees'
    }

    const res = await fees.POST(req as any)
    expect(res.status).toBe(201)
    // Ensure Twilio create was called
    expect(mockCreate).toHaveBeenCalled()
  })
})
