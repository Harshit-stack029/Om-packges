import { Router } from 'express';
import {
  subscribe, listSubscribers, exportSubscribers, deleteSubscriber,
} from '../controllers/newsletterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Public — rate-limited by global limiter
router.post('/', subscribe);

// Admin
router.get('/',         protect, listSubscribers);
router.get('/export',   protect, exportSubscribers);
router.delete('/:id',   protect, deleteSubscriber);

export default router;
