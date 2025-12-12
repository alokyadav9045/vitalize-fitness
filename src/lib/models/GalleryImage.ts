import mongoose from 'mongoose'

const galleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['equipment', 'classes', 'cardio', 'strength', 'yoga', 'facilities', 'training', 'crossfit']
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

export default mongoose.models.GalleryImage || mongoose.model('GalleryImage', galleryImageSchema)