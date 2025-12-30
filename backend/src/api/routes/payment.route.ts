import { Router } from 'express';
import { createPaymentLink, payosWebhook, checkPaymentStatus } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Tạo link thanh toán
router.post('/create-payment', authenticate, createPaymentLink);

// Webhook từ PayOS (không cần auth)
router.post('/webhook', payosWebhook);

// Kiểm tra trạng thái thanh toán
router.get('/status/:bookingId', authenticate, checkPaymentStatus);

export default router;
