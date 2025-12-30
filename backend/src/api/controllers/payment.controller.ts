import { Request, Response } from 'express';
import { Booking } from '../../models';
import { AuthRequest } from '../middlewares/auth.middleware';
import { successResponse, errorResponse } from '../../utils/response';

// PayOS đã bị vô hiệu hóa - sử dụng QR ngân hàng thay thế
export const createPaymentLink = async (req: AuthRequest, res: Response) => {
  return errorResponse(res, 'PayOS đã bị vô hiệu hóa. Vui lòng sử dụng chuyển khoản ngân hàng.', 'PAYOS_DISABLED', 400);
};

export const payosWebhook = async (req: Request, res: Response) => {
  return res.json({ success: false, message: 'PayOS disabled' });
};

// Kiểm tra trạng thái thanh toán
export const checkPaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return errorResponse(res, 'Không tìm thấy đơn đặt phòng', 'BOOKING_NOT_FOUND', 404);
    }

    return successResponse(res, 'Lấy trạng thái thanh toán thành công', {
      paymentStatus: booking.payment_status,
      bookingStatus: booking.status
    });

  } catch (error) {
    console.error('Check payment status error:', error);
    return errorResponse(res, 'Lỗi kiểm tra trạng thái', 'SERVER_ERROR', 500);
  }
};
