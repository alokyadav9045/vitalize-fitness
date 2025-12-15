import mongoose from 'mongoose'

const gymSettingsSchema = new mongoose.Schema({
  gymName: {
    type: String,
    required: true,
    default: 'Vitalize Fitness'
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  openingHours: {
    monday: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '22:00' }
    },
    tuesday: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '22:00' }
    },
    wednesday: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '22:00' }
    },
    thursday: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '22:00' }
    },
    friday: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '22:00' }
    },
    saturday: {
      open: { type: String, default: '07:00' },
      close: { type: String, default: '20:00' }
    },
    sunday: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '18:00' }
    }
  },
  membershipFees: {
    basic: { type: Number, required: true, default: 999 },
    premium: { type: Number, required: true, default: 1999 },
    elite: { type: Number, required: true, default: 2999 }
  },
  notifications: {
    emailReminders: { type: Boolean, default: true },
    smsReminders: { type: Boolean, default: false },
    whatsappReminders: { type: Boolean, default: false },
    paymentNotifications: { type: Boolean, default: true },
    attendanceAlerts: { type: Boolean, default: true }
  },
  systemSettings: {
    autoBackup: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    maxMembers: { type: Number, default: 1000 },
    sessionTimeout: { type: Number, default: 30 }
  }
}, {
  timestamps: true
})

// Ensure only one settings document exists
gymSettingsSchema.pre('save', async function(next) {
  if (this.isNew) {
    const existing = await mongoose.model('GymSettings').findOne()
    if (existing) {
      throw new Error('Only one gym settings document can exist')
    }
  }
  next()
})

export default mongoose.models.GymSettings || mongoose.model('GymSettings', gymSettingsSchema)