import { Router } from 'express';
import { getGallery, getTags, createItem, updateItem, deleteItem } from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadGalleryImage } from '../middleware/uploadMiddleware.js';

const router = Router();

// Public
router.get('/', getGallery);
router.get('/tags', getTags);

// Admin
router.post('/', protect, uploadGalleryImage, createItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

export default router;
