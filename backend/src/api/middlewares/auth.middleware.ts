import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../utils/jwt';
import { errorResponse } from '../../utils/response';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    roleId: number;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Token không hợp lệ', 'UNAUTHORIZED', 401);
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return errorResponse(res, 'Token không hợp lệ hoặc đã hết hạn', 'UNAUTHORIZED', 401);
  }

  req.user = {
    userId: decoded.userId,
    roleId: decoded.roleId
  };

  next();
};

export const authorize = (...allowedRoles: number[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, 'Chưa xác thực', 'UNAUTHORIZED', 401);
    }

    if (!allowedRoles.includes(req.user.roleId)) {
      return errorResponse(res, 'Không có quyền truy cập', 'FORBIDDEN', 403);
    }

    next();
  };
};
