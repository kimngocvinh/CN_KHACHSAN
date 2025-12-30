import { Router } from 'express';
import {
  getAllPromotions,
  getActivePromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  validatePromoCode
} from '../controllers/promotion.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public - kiểm tra mã khuyến mãi
router.get('/validate/:code', validatePromoCode);

// Public - lấy danh sách khuyến mãi đang hoạt động
router.get('/active', getActivePromotions);

// Admin only - CRUD
router.get('/', authenticate, authorize(2, 3), getAllPromotions);
router.post('/', authenticate, authorize(3), createPromotion);
router.put('/:id', authenticate, authorize(3), updatePromotion);
router.delete('/:id', authenticate, authorize(3), deletePromotion);

export default router;
