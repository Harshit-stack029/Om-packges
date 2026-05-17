import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductField,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadProductImages } from '../middleware/uploadMiddleware.js';

const router = Router();

// Public
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);

// Admin
router.get('/admin/all', protect, getProductsAdmin);
router.get('/admin/:id', protect, getProductById);
router.post('/', protect, uploadProductImages, createProduct);
router.put('/:id', protect, uploadProductImages, updateProduct);
router.patch('/:id/toggle', protect, toggleProductField);
router.delete('/:id', protect, deleteProduct);

export default router;
