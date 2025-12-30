import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  updatePaymentStatus
} from '../controllers/booking.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, authorize(1), createBooking);
router.get('/my-bookings', authenticate, authorize(1), getMyBookings);
router.put('/:id/cancel', authenticate, authorize(1), cancelBooking);
router.get('/', authenticate, authorize(2, 3), getAllBookings);
router.put('/:id/status', authenticate, authorize(2, 3), updateBookingStatus);
router.put('/:id/payment-status', authenticate, authorize(2, 3), updatePaymentStatus);

export default router;
