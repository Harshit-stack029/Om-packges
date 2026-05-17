import mongoose from 'mongoose';
import slugify from 'slugify';

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, trim: true, maxlength: 300 },
    content: { type: String, required: true },
    coverImage: { type: String },
    coverImagePublicId: { type: String },
    author: { type: String, default: 'OM Packaging Team' },
    tags: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    readTime: { type: Number, default: 1 },
  },
  { timestamps: true }
);

blogPostSchema.pre('save', async function () {
  if (!this.isModified('title') && this.slug) return;

  const base = slugify(this.title, { lower: true, strict: true });
  let slug = base;
  let count = 1;
  while (await mongoose.model('BlogPost').exists({ slug, _id: { $ne: this._id } })) {
    slug = `${base}-${count++}`;
  }
  this.slug = slug;

  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/<[^>]*>/g, '').substring(0, 200).trim();
  }

  if (this.content) {
    const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

export default mongoose.model('BlogPost', blogPostSchema);
