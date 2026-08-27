import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Internship', 'Experience', 'Research', 'Leadership', 'Education'],
      required: [true, 'Type is required'],
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
    },
    duration: String,
    desc: String,
    image: String,
    link: String,
    priority: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    technologies: {
      type: [String],
      default: [],
    },
    achievements: {
      type: [String],
      default: [],
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

internshipSchema.index({ type: 1, priority: -1 });

export default mongoose.model('Internship', internshipSchema);
