import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    source: {
      type: String,
      trim: true,
      default: 'footer',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

subscriberSchema.index({ isActive: 1, createdAt: -1 });

export default mongoose.model('Subscriber', subscriberSchema);
