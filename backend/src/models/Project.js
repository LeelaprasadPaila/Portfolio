import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    desc: String,
    image: String,
    link: String,
    githubLink: String,
    videoUrl: String,
    meta: String,
    priority: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for faster queries
projectSchema.index({ category: 1, priority: -1 });

export default mongoose.model('Project', projectSchema);
