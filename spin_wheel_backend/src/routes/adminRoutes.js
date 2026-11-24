import { Router } from 'express';
import {
  loginAdmin,
  verifyAdminSession,
  getTargetIndex,
  setTargetIndex,
  getDashboardStats,
  getAdminSettings,
  updateAdminSettings,
} from '../controllers/adminController.js';
import { validateTargetIndex } from '../middleware/validator.js';

const router = Router();

router.post('/login', loginAdmin);
router.get('/me', verifyAdminSession);
router.get('/target', getTargetIndex);
router.post('/target', validateTargetIndex, setTargetIndex);
router.get('/stats', getDashboardStats);
router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);

export default router;

