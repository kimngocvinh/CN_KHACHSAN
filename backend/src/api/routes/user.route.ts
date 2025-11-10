import { Router } from 'express';
import { getProfile, updateProfile, getAllUsers } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/', authenticate, authorize(3), getAllUsers);

export default router;
