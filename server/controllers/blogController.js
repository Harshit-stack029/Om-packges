import BlogPost from '../models/BlogPost.js';
import cloudinary from '../config/cloudinary.js';

// GET /api/blog — public, published only
export const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 9, tag, search } = req.query;
    const filter = { isPublished: true };
    if (tag) filter.tags = tag;
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];

    const total = await BlogPost.countDocuments(filter);
    const posts = await BlogPost.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-content');

    res.json({ success: true, data: posts, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// GET /api/blog/:slug — public
export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
};

// GET /api/blog/admin/all — admin
export const getPostsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };

    const total = await BlogPost.countDocuments(filter);
    const posts = await BlogPost.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-content');

    res.json({ success: true, data: posts, total, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// GET /api/blog/admin/:id — admin
export const getPostById = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
};

// POST /api/blog — admin
export const createPost = async (req, res, next) => {
  try {
    const { title, excerpt, content, author, tags, isPublished } = req.body;
    const post = new BlogPost({
      title, excerpt, content, author,
      tags: tags ? JSON.parse(tags) : [],
      isPublished: isPublished === 'true' || isPublished === true,
    });
    if (req.file) {
      post.coverImage = req.file.path;
      post.coverImagePublicId = req.file.filename;
    }
    await post.save();
    res.status(201).json({ success: true, data: post });
  } catch (err) { next(err); }
};

// PUT /api/blog/:id — admin
export const updatePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    const { title, excerpt, content, author, tags, isPublished } = req.body;
    if (title !== undefined) post.title = title;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (content !== undefined) post.content = content;
    if (author !== undefined) post.author = author;
    if (tags !== undefined) post.tags = JSON.parse(tags);
    if (isPublished !== undefined) post.isPublished = isPublished === 'true' || isPublished === true;

    if (req.file) {
      if (post.coverImagePublicId) {
        await cloudinary.uploader.destroy(post.coverImagePublicId).catch(() => {});
      }
      post.coverImage = req.file.path;
      post.coverImagePublicId = req.file.filename;
    }

    await post.save();
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
};

// DELETE /api/blog/:id — admin
export const deletePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
    if (post.coverImagePublicId) {
      await cloudinary.uploader.destroy(post.coverImagePublicId).catch(() => {});
    }
    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted.' });
  } catch (err) { next(err); }
};
