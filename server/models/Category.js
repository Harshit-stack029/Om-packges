import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Category name is required'], trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, trim: true },
    icon: { type: String, trim: true },          // Lucide icon name or Cloudinary URL
    coverImage: { type: String },                 // Cloudinary URL
    coverImagePublicId: { type: String },         // For Cloudinary deletion
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model('Category', categorySchema);
