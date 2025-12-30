import { Router } from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import roomRoutes from './room.route';
import bookingRoutes from './booking.route';
import reviewRoutes from './review.route';
import dashboardRoutes from './dashboard.route';
import supportRoutes from './support.route';
import promotionRoutes from './promotion.route';
import paymentRoutes from './payment.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/rooms', roomRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/support', supportRoutes);
router.use('/promotions', promotionRoutes);
router.use('/payment', paymentRoutes);

export default router;
