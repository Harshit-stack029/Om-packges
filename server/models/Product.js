import mongoose from 'mongoose';
import slugify from 'slugify';

const specSchema = new mongoose.Schema(
  { key: { type: String, required: true }, value: { type: String, required: true } },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  { url: { type: String, required: true }, publicId: { type: String, required: true } },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, unique: true, lowercase: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, 'Category is required'] },
    description: { type: String },
    shortDescription: { type: String },
    images: [imageSchema],
    specifications: [specSchema],
    features: [String],
    applications: [String],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.pre('save', async function (next) {
  if (!this.isModified('name')) return next();

  let base = slugify(this.name, { lower: true, strict: true });
  let slug = base;
  let count = 1;

  while (await mongoose.model('Product').exists({ slug, _id: { $ne: this._id } })) {
    slug = `${base}-${count++}`;
  }
  this.slug = slug;
  next();
});

// Virtual — image URLs only (for public API)
productSchema.virtual('imageUrls').get(function () {
  return this.images.map((img) => img.url);
});

export default mongoose.model('Product', productSchema);
