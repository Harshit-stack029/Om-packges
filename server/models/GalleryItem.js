import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    tag: { type: String, trim: true, default: 'General' },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

galleryItemSchema.index({ tag: 1 });
galleryItemSchema.index({ isFeatured: -1, order: 1 });

export default mongoose.model('GalleryItem', galleryItemSchema);
