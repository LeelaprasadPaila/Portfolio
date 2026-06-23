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
    description: {
      type: String,
      default: '',
    },
    image: String,
    issuer: String,
    issueDate: String,
    expiryDate: String,
    key: String, // License key or certification number for licensed certificates
    certLink: String, // Link to view the certificate online
    priority: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

certificateSchema.index({ category: 1, priority: -1 });

export default mongoose.model('Certificate', certificateSchema);
