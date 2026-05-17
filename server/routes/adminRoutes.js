import { Router } from 'express';
import { getStats } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', protect, getStats);

export default router;
