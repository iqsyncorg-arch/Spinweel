import { Router } from 'express';
import { getPrizes, getPrizeById, updatePrize } from '../controllers/prizeController.js';

const router = Router();

router.get('/', getPrizes);
router.get('/:id', getPrizeById);
router.put('/:id', updatePrize);

export default router;

