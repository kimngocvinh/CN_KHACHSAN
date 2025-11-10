import { Response } from 'express';
import { User, Role } from '../../models';
import { AuthRequest } from '../middlewares/auth.middleware';
import { successResponse, errorResponse } from '../../utils/response';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.user?.userId, {
      attributes: ['user_id', 'full_name', 'email', 'phone_number']
    });

    if (!user) {
      return errorResponse(res, 'Không tìm thấy người dùng', 'USER_NOT_FOUND', 404);
    }

    return successResponse(res, 'Lấy thông tin thành công.', {
      userId: user.user_id,
      fullName: user.full_name,
      email: user.email,
      phoneNumber: user.phone_number
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, phoneNumber } = req.body;
    const user = await User.findByPk(req.user?.userId);

    if (!user) {
      return errorResponse(res, 'Không tìm thấy người dùng', 'USER_NOT_FOUND', 404);
    }

    if (fullName) user.full_name = fullName;
    if (phoneNumber) user.phone_number = phoneNumber;

    await user.save();

    return successResponse(res, 'Cập nhật thông tin thành công.', {
      userId: user.user_id,
      fullName: user.full_name,
      email: user.email,
      phoneNumber: user.phone_number
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const roleFilter = req.query.role ? parseInt(req.query.role as string) : undefined;

    const offset = (page - 1) * limit;
    const where: any = {};
    if (roleFilter) where.role_id = roleFilter;

    const { count, rows } = await User.findAndCountAll({
      where,
      limit,
      offset,
      attributes: ['user_id', 'full_name', 'email', 'phone_number', 'role_id', 'created_at'],
      include: [{ model: Role, as: 'role', attributes: ['role_name'] }]
    });

    return successResponse(res, 'Lấy danh sách người dùng thành công.', {
      users: rows,
      pagination: {
        currentPage: page,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};
