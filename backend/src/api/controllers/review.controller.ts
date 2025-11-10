import { Response } from 'express';
import { Review, Booking, User } from '../../models';
import { AuthRequest } from '../middlewares/auth.middleware';
import { successResponse, errorResponse } from '../../utils/response';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const userId = req.user?.userId;

    const booking = await Booking.findOne({
      where: { booking_id: bookingId, user_id: userId }
    });

    if (!booking) {
      return errorResponse(res, 'Không tìm thấy đơn đặt phòng', 'BOOKING_NOT_FOUND', 404);
    }

    if (booking.status !== 'checked_out') {
      return errorResponse(res, 'Chỉ có thể đánh giá sau khi hoàn thành đặt phòng', 'INVALID_STATUS');
    }

    const existingReview = await Review.findOne({ where: { booking_id: bookingId } });
    if (existingReview) {
      return errorResponse(res, 'Đã đánh giá đơn đặt phòng này rồi', 'REVIEW_EXISTS');
    }

    const review = await Review.create({
      booking_id: bookingId,
      user_id: userId!,
      room_id: booking.room_id,
      rating,
      comment
    });

    return successResponse(res, 'Tạo đánh giá thành công!', review, 201);
  } catch (error) {
    console.error('Create review error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const getReviewsByRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId } = req.params;

    const reviews = await Review.findAll({
      include: [
        {
          model: Booking,
          as: 'booking',
          where: { room_id: roomId },
          attributes: ['booking_id', 'room_id']
        },
        {
          model: User,
          as: 'user',
          attributes: ['full_name']
        }
      ],
      order: [['review_date', 'DESC']]
    });

    return successResponse(res, 'Lấy danh sách đánh giá thành công.', reviews);
  } catch (error) {
    console.error('Get reviews by room error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};
