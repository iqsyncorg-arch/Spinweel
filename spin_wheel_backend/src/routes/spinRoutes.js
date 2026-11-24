import { Router } from 'express';
import { executeSpin, clearLeadSpin, verifyVoucher } from '../controllers/spinController.js';

const router = Router();

router.post('/', executeSpin);
router.post('/clear-spin', clearLeadSpin);
router.post('/verify', verifyVoucher);

export default router;
