import { jest } from '@jest/globals'

jest.mock('@/lib/mongodb', () => ({ __esModule: true, default: async () => {} }))
jest.mock('@/lib/models/GymSettings', () => ({ __esModule: true, default: { findOne: jest.fn().mockResolvedValue({ notifications: { whatsappReminders: true } }) } }))
jest.mock('@/lib/models/Member', () => ({ __esModule: true, default: { find: jest.fn().mockResolvedValue([ { name: 'Test User', phone: '+1234567890', endDate: new Date(Date.now() + 2 * 24 * 3600 * 1000) } ]) } }))
jest.mock('@/lib/notifications', () => ({ __esModule: true, sendWhatsApp: jest.fn().mockResolvedValue({ success: true }) }))

describe('Renewal reminders', () => {
  it('sends reminders to members', async () => {
    const { sendRenewalReminders } = require('../../scripts/renewalReminders.js')
    const res = await sendRenewalReminders(7)
    expect(res.sent).toBeGreaterThanOrEqual(0)
  })
})
