import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkInTime: {
    type: Date,
    required: true
  },
  checkOutTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Present', 'Late', 'Absent'],
    default: 'Present'
  }
}, {
  timestamps: true
})

// Compound index to prevent duplicate attendance for same member on same date
attendanceSchema.index({ memberId: 1, date: 1 }, { unique: true })

export default mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema)