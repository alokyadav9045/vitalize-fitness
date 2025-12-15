import dbConnect from '@/lib/mongodb'
import Member from '@/lib/models/Member'
import GymSettings from '@/lib/models/GymSettings'
import { sendWhatsApp } from '@/lib/notifications'

export async function sendRenewalReminders(daysBefore = 7) {
  await dbConnect()

  const settings = await GymSettings.findOne()
  if (!settings?.notifications?.whatsappReminders) {
    console.log('WhatsApp reminders disabled in settings')
    return { sent: 0 }
  }

  const today = new Date()
  const start = new Date(today)
  const end = new Date(today)
  end.setDate(end.getDate() + daysBefore)

  const members = await Member.find({
    endDate: { $gte: today, $lte: end },
    whatsappOptIn: true
  })

  let sent = 0
  for (const m of members) {
    if (!m.phone) continue
    try {
      const res = await sendWhatsApp(m.phone, `Hi ${m.name}, your membership at Vitalize Fitness expires on ${new Date(m.endDate).toLocaleDateString()}. Renew now to avoid interruption.`)
      if (res.success) sent++
      else console.error('Failed to send to', m.phone, res.message)
    } catch (err) {
      console.error('Error sending reminder to', m.phone, err)
    }
  }

  console.log(`Renewal reminders finished. Sent: ${sent}`)
  return { sent }
}

// Run when invoked directly
if (require.main === module) {
  const days = parseInt(process.env.RENEWAL_DAYS || '7', 10)
  sendRenewalReminders(days).then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1) })
}
