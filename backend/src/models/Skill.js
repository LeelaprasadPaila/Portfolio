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

export default mongoose.model('Skill', skillSchema);
