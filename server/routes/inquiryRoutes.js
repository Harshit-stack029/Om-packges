import { Router } from 'express';
import {
  submitInquiry, getInquiries, getInquiryById,
  updateStatus, deleteInquiry,
} from '../controllers/inquiryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadInquiryAttachment } from '../middleware/uploadMiddleware.js';

const router = Router();

// Public — rate-limited by global limiter
router.post('/', uploadInquiryAttachment, submitInquiry);

// Admin
router.get('/',       protect, getInquiries);
router.get('/:id',    protect, getInquiryById);
router.patch('/:id/status', protect, updateStatus);
router.delete('/:id', protect, deleteInquiry);

export default router;
