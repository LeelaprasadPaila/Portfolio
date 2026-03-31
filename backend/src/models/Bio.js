import mongoose from 'mongoose';

const bioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'AI Native Engineer',
    },
    intro: {
      type: String,
      default: '',
    },
    birthday: String,
    phone: String,
    city: String,
    degree: String,
    email: String,
    freelance: String,
    quote: String,
  },
  { timestamps: true }
);

export default mongoose.model('Bio', bioSchema);
