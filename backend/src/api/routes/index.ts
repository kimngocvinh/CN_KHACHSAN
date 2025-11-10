import { Router } from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import roomRoutes from './room.route';
import bookingRoutes from './booking.route';
import reviewRoutes from './review.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/rooms', roomRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);

export default router;
