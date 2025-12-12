import mongoose from 'mongoose'

const memberSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  address: {
    type: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  membershipType: {
    type: String,
    enum: ['Basic', 'Premium', 'Elite'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Expired'],
    default: 'Active'
  },
  profileImage: {
    type: String
  }
}, {
  timestamps: true
})

// Auto-generate memberId
memberSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Member').countDocuments()
    this.memberId = `PG${String(count + 1).padStart(3, '0')}`
  }
  next()
})

export default mongoose.models.Member || mongoose.model('Member', memberSchema)