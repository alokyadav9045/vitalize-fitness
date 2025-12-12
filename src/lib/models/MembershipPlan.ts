import mongoose from 'mongoose'

const membershipPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Basic', 'Premium', 'Elite']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 1 // in months
  },
  features: [{
    type: String,
    required: true
  }],
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  popular: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default mongoose.models.MembershipPlan || mongoose.model('MembershipPlan', membershipPlanSchema)