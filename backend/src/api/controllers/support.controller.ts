import { Response, Request } from 'express';
import SupportRequest from '../../models/supportRequest.model';
import { successResponse, errorResponse } from '../../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createSupportRequest = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return errorResponse(res, 'Thiếu thông tin bắt buộc', 'MISSING_FIELDS', 400);
    }

    const supportRequest = await SupportRequest.create({
      name,
      email,
      phone,
      subject,
      message,
      status: 'pending'
    });

    return successResponse(res, 'Gửi yêu cầu hỗ trợ thành công! Chúng tôi sẽ liên hệ bạn sớm.', supportRequest, 201);
  } catch (error) {
    console.error('Create support request error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const getAllSupportRequests = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;

    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    const requests = await SupportRequest.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });

    return successResponse(res, 'Lấy danh sách yêu cầu hỗ trợ thành công.', requests);
  } catch (error) {
    console.error('Get support requests error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const updateSupportRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'processing', 'resolved', 'closed'].includes(status)) {
      return errorResponse(res, 'Trạng thái không hợp lệ', 'INVALID_STATUS', 400);
    }

    const request = await SupportRequest.findByPk(id);
    if (!request) {
      return errorResponse(res, 'Không tìm thấy yêu cầu hỗ trợ', 'NOT_FOUND', 404);
    }

    await request.update({ status });

    return successResponse(res, 'Cập nhật trạng thái thành công.', request);
  } catch (error) {
    console.error('Update support request status error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const deleteSupportRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const request = await SupportRequest.findByPk(id);
    if (!request) {
      return errorResponse(res, 'Không tìm thấy yêu cầu hỗ trợ', 'NOT_FOUND', 404);
    }

    await request.destroy();

    return successResponse(res, 'Xóa yêu cầu hỗ trợ thành công.', null);
  } catch (error) {
    console.error('Delete support request error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};
