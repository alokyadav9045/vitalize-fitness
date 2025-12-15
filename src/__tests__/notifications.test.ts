import { jest } from '@jest/globals'

describe('Notifications', () => {
  it('should return gracefully when Twilio not configured', async () => {
    const notifications = await import('@/lib/notifications')
    const res = await notifications.sendWhatsApp('+1234567890', 'test')
    expect(res.success).toBe(false)
    expect(res.message).toBeDefined()
  })
})
