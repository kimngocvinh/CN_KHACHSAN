import { Router } from 'express';
import { createSupportRequest, getAllSupportRequests, updateSupportRequestStatus, deleteSupportRequest } from '../controllers/support.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', createSupportRequest);
router.get('/', authenticate, authorize(2, 3), getAllSupportRequests);
router.put('/:id/status', authenticate, authorize(2, 3), updateSupportRequestStatus);
router.delete('/:id', authenticate, authorize(2, 3), deleteSupportRequest);

export default router;
