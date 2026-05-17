import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadCategoryImage } from '../middleware/uploadMiddleware.js';

const router = Router();

// Public
router.get('/', getCategories);

// Admin — protected
router.get('/:id', protect, getCategoryById);
router.post('/', protect, uploadCategoryImage, createCategory);
router.put('/:id', protect, uploadCategoryImage, updateCategory);
router.delete('/:id', protect, deleteCategory);

export default router;
