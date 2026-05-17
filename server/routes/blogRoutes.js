import { Router } from 'express';
import {
  getPosts, getPostBySlug, getPostsAdmin, getPostById,
  createPost, updatePost, deletePost,
} from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadBlogCover } from '../middleware/uploadMiddleware.js';

const router = Router();

// Public
router.get('/', getPosts);
router.get('/slug/:slug', getPostBySlug);

// Admin
router.get('/admin/all', protect, getPostsAdmin);
router.get('/admin/:id', protect, getPostById);
router.post('/', protect, uploadBlogCover, createPost);
router.put('/:id', protect, uploadBlogCover, updatePost);
router.delete('/:id', protect, deletePost);

export default router;
