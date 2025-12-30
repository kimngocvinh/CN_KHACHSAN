import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Promotion from '../../models/promotion.model';
import { successResponse, errorResponse } from '../../utils/response';

export const getAllPromotions = async (req: Request, res: Response) => {
  try {
    const promotions = await Promotion.findAll({
      order: [['promotion_id', 'DESC']]
    });
    return successResponse(res, 'Lấy danh sách khuyến mãi thành công', promotions);
  } catch (error) {
    console.error('Get promotions error:', error);
    return errorResponse(res, 'Lỗi khi lấy danh sách khuyến mãi', 'SERVER_ERROR', 500);
  }
};

export const getActivePromotions = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const promotions = await Promotion.findAll({
      where: {
        is_active: true,
        start_date: { [Op.lte]: today },
        end_date: { [Op.gte]: today }
      },
      order: [['discount_percentage', 'DESC']]
    });
    return successResponse(res, 'Lấy danh sách khuyến mãi đang hoạt động', promotions);
  } catch (error) {
    console.error('Get active promotions error:', error);
    return errorResponse(res, 'Lỗi khi lấy danh sách khuyến mãi', 'SERVER_ERROR', 500);
  }
};

export const createPromotion = async (req: Request, res: Response) => {
  try {
    const { promoCode, discountPercentage, startDate, endDate } = req.body;

    // Kiểm tra mã đã tồn tại
    const existing = await Promotion.findOne({ where: { promo_code: promoCode } });
    if (existing) {
      return errorResponse(res, 'Mã khuyến mãi đã tồn tại', 'CODE_EXISTS', 400);
    }

    const promotion = await Promotion.create({
      promo_code: promoCode,
      discount_percentage: discountPercentage,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      is_active: true
    });

    return successResponse(res, 'Tạo khuyến mãi thành công', promotion, 201);
  } catch (error) {
    console.error('Create promotion error:', error);
    return errorResponse(res, 'Lỗi khi tạo khuyến mãi', 'SERVER_ERROR', 500);
  }
};

export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { promoCode, discountPercentage, startDate, endDate, isActive } = req.body;

    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
      return errorResponse(res, 'Không tìm thấy khuyến mãi', 'NOT_FOUND', 404);
    }

    if (promoCode) promotion.promo_code = promoCode;
    if (discountPercentage) promotion.discount_percentage = discountPercentage;
    if (startDate) promotion.start_date = new Date(startDate);
    if (endDate) promotion.end_date = new Date(endDate);
    if (isActive !== undefined) promotion.is_active = isActive;

    await promotion.save();

    return successResponse(res, 'Cập nhật khuyến mãi thành công', promotion);
  } catch (error) {
    console.error('Update promotion error:', error);
    return errorResponse(res, 'Lỗi khi cập nhật khuyến mãi', 'SERVER_ERROR', 500);
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
      return errorResponse(res, 'Không tìm thấy khuyến mãi', 'NOT_FOUND', 404);
    }

    await promotion.destroy();

    return successResponse(res, 'Xóa khuyến mãi thành công', null);
  } catch (error) {
    console.error('Delete promotion error:', error);
    return errorResponse(res, 'Lỗi khi xóa khuyến mãi', 'SERVER_ERROR', 500);
  }
};

export const validatePromoCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const today = new Date();

    // Tìm mã khuyến mãi
    const promotion = await Promotion.findOne({
      where: { promo_code: code }
    });

    if (!promotion) {
      return errorResponse(res, 'Mã khuyến mãi không tồn tại', 'CODE_NOT_FOUND', 400);
    }

    if (!promotion.is_active) {
      return errorResponse(res, 'Mã khuyến mãi đã bị vô hiệu hóa', 'CODE_DISABLED', 400);
    }

    const startDate = new Date(promotion.start_date);
    const endDate = new Date(promotion.end_date);

    if (today < startDate) {
      return errorResponse(res, `Mã khuyến mãi chưa có hiệu lực. Bắt đầu từ ${startDate.toLocaleDateString('vi-VN')}`, 'CODE_NOT_STARTED', 400);
    }

    if (today > endDate) {
      return errorResponse(res, `Mã khuyến mãi đã hết hạn từ ${endDate.toLocaleDateString('vi-VN')}`, 'CODE_EXPIRED', 400);
    }

    return successResponse(res, 'Mã khuyến mãi hợp lệ', {
      discountPercentage: promotion.discount_percentage
    });
  } catch (error) {
    console.error('Validate promo code error:', error);
    return errorResponse(res, 'Lỗi khi kiểm tra mã', 'SERVER_ERROR', 500);
  }
};
