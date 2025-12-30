import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { register, login } from '../controllers/auth.controller';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Middleware xử lý validation errors
const handleValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }
  next();
};

router.post(
  '/register',
  [
    body('fullName').notEmpty().withMessage('Họ tên không được để trống'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    body('phoneNumber').optional()
  ],
  handleValidation,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').notEmpty().withMessage('Mật khẩu không được để trống')
  ],
  handleValidation,
  login
);

export default router;
