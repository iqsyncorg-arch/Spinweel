import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  resetLeads,
  exportLeadsCSV,
} from '../controllers/leadController.js';
import { validateLead } from '../middleware/validator.js';

const router = Router();

// Order matters: specific static paths before parameter :id
router.get('/', getLeads);
router.post('/', validateLead, createLead);
router.get('/export/csv', exportLeadsCSV);
router.delete('/reset', resetLeads);
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;

