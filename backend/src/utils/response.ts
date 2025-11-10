import { Response } from 'express';

export const successResponse = (res: Response, message: string, data: any = null, statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res: Response, message: string, error?: string, statusCode: number = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(error && { error })
  });
};
