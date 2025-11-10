import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, Role } from '../../models';
import { generateToken } from '../../utils/jwt';
import { successResponse, errorResponse } from '../../utils/response';

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    // Validation
    if (!password || typeof password !== 'string') {
      return errorResponse(res, 'Mật khẩu không hợp lệ', 'INVALID_PASSWORD');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 'Email đã được sử dụng', 'EMAIL_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name: fullName,
      email,
      password_hash: hashedPassword,
      phone_number: phoneNumber,
      role_id: 1
    });

    const role = await Role.findByPk(user.role_id);
    const token = generateToken(user.user_id, user.role_id);

    return successResponse(res, 'Đăng ký tài khoản thành công!', {
      user: {
        userId: user.user_id,
        fullName: user.full_name,
        email: user.email,
        role: role?.role_name
      },
      accessToken: token
    }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi khi đăng ký', 'SERVER_ERROR', 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 'Email hoặc mật khẩu không đúng', 'INVALID_CREDENTIALS', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return errorResponse(res, 'Email hoặc mật khẩu không đúng', 'INVALID_CREDENTIALS', 401);
    }

    const role = await Role.findByPk(user.role_id);
    const token = generateToken(user.user_id, user.role_id);

    return successResponse(res, 'Đăng nhập thành công!', {
      user: {
        userId: user.user_id,
        fullName: user.full_name,
        email: user.email,
        role: role?.role_name
      },
      accessToken: token
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi khi đăng nhập', 'SERVER_ERROR', 500);
  }
};
