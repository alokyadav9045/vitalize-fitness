import mongoose from 'mongoose'

const trainerSchema = new mongoose.Schema({
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
  specializations: [{
    type: String,
    enum: ['Personal Training', 'Group Fitness', 'Yoga', 'Pilates', 'CrossFit', 'Nutrition', 'Strength Training', 'Cardio Training', 'Martial Arts', 'Sports Performance', 'Meditation', 'HIIT', 'Functional Training']
  }],
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  bio: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  certifications: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export default mongoose.models.Trainer || mongoose.model('Trainer', trainerSchema)