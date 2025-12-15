import cron from 'node-cron'
import { sendRenewalReminders } from './renewalReminders'

const schedule = process.env.RENEWAL_CRON || '0 9 * * *' // default: daily at 09:00

console.log(`Starting scheduler. Running renewals at cron: ${schedule}`)

cron.schedule(schedule, async () => {
  console.log('Running scheduled renewal reminders')
  try {
    await sendRenewalReminders()
  } catch (err) {
    console.error('Scheduled renewal error:', err)
  }
})

// Keep process alive
process.stdin.resume()
