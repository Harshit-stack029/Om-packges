import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    fileUrl: { type: String, required: true },
    filePublicId: { type: String, required: true },
    fileType: { type: String, enum: ['image', 'pdf'], required: true },
    issuedBy: { type: String, trim: true },
    issuedDate: { type: Date },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

certificateSchema.index({ isActive: 1, order: 1 });

export default mongoose.model('Certificate', certificateSchema);
