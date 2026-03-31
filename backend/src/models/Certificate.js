import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    description: String,
    image: String,
    issuer: String,
    issueDate: String,
    priority: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

certificateSchema.index({ category: 1, priority: -1 });

export default mongoose.model('Certificate', certificateSchema);
