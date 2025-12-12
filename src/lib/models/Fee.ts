import mongoose from 'mongoose'

const feeSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Net Banking'],
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  receiptNumber: {
    type: String,
    unique: true
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
})

// Auto-generate receipt number
feeSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Fee').countDocuments()
    this.receiptNumber = `RCP${String(count + 1).padStart(4, '0')}`
  }
  next()
})

export default mongoose.models.Fee || mongoose.model('Fee', feeSchema)