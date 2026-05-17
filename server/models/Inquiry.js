import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    productInterest: { type: String, trim: true },
    quantity: { type: String, trim: true },
    message: { type: String, required: true },
    sourceUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'closed'],
      default: 'new',
    },
    adminNote: { type: String, trim: true },
    // attachment stored as buffer (memory storage) — not persisted to DB, emailed directly
  },
  { timestamps: true }
);

inquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Inquiry', inquirySchema);
