import { Router } from 'express';
import {
  getCertificates, getCertificatesAdmin,
  createCertificate, updateCertificate, deleteCertificate,
} from '../controllers/certificateController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadCertificate } from '../middleware/uploadMiddleware.js';

const router = Router();

// Public
router.get('/', getCertificates);

// Admin
router.get('/admin/all', protect, getCertificatesAdmin);
router.post('/', protect, uploadCertificate, createCertificate);
router.put('/:id', protect, uploadCertificate, updateCertificate);
router.delete('/:id', protect, deleteCertificate);

export default router;
