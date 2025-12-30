import { Router } from 'express';
import { createReview, getReviewsByRoom, getAllReviews } from '../controllers/review.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, authorize(1), createReview);
router.get('/', getAllReviews);
router.get('/room/:roomId', getReviewsByRoom);

export default router;
