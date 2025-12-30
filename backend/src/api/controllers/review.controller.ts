import { Response } from 'express';
import { Review, Booking, User } from '../../models';
import { AuthRequest } from '../middlewares/auth.middleware';
import { successResponse, errorResponse } from '../../utils/response';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId, rating, comment } = req.body;
    const userId = req.user?.userId;

    if (!roomId || !rating || !comment) {
      return errorResponse(res, 'Thiếu thông tin đánh giá', 'MISSING_FIELDS', 400);
    }

    // Tạo đánh giá trực tiếp cho phòng
    const review = await Review.create({
      user_id: userId!,
      room_id: roomId,
      rating,
      comment
    });

    // Load lại với thông tin user
    const reviewWithUser = await Review.findByPk(review.review_id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['full_name']
        }
      ]
    });

    return successResponse(res, 'Tạo đánh giá thành công!', reviewWithUser, 201);
  } catch (error) {
    console.error('Create review error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const getReviewsByRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId } = req.params;

    const reviews = await Review.findAll({
      where: { room_id: roomId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['full_name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return successResponse(res, 'Lấy danh sách đánh giá thành công.', reviews);
  } catch (error) {
    console.error('Get reviews by room error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const getAllReviews = async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['full_name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return successResponse(res, 'Lấy danh sách tất cả đánh giá thành công.', reviews);
  } catch (error) {
    console.error('Get all reviews error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};
