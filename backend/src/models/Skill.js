import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    title: String,
    icon: String,
    skills: [String],
  },
  { timestamps: true }
);

// Index for faster queries
skillSchema.index({ category: 1 });

export default mongoose.model('Skill', skillSchema);
