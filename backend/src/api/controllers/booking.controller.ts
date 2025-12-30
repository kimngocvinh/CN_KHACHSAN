import { Response } from 'express';
import { Op } from 'sequelize';
import { Booking, Room, User } from '../../models';
import Promotion from '../../models/promotion.model';
import { AuthRequest } from '../middlewares/auth.middleware';
import { successResponse, errorResponse } from '../../utils/response';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId, checkInDate, checkOutDate, numberOfGuests, promoCode, paymentMethod } = req.body;
    const userId = req.user?.userId;

    console.log('Booking request:', { roomId, checkInDate, checkOutDate, numberOfGuests, userId, promoCode, paymentMethod });

    // Validation
    if (!roomId || !checkInDate || !checkOutDate || !numberOfGuests) {
      return errorResponse(res, 'Vui lòng điền đầy đủ thông tin', 'MISSING_FIELDS', 400);
    }

    const room = await Room.findByPk(roomId);
    if (!room) {
      return errorResponse(res, 'Không tìm thấy phòng', 'ROOM_NOT_FOUND', 404);
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate dates
    if (checkIn >= checkOut) {
      return errorResponse(res, 'Ngày trả phòng phải sau ngày nhận phòng', 'INVALID_DATES', 400);
    }

    const conflictBooking = await Booking.findOne({
      where: {
        room_id: roomId,
        status: { [Op.notIn]: ['cancelled', 'checked_out'] },
        [Op.or]: [
          { check_in_date: { [Op.between]: [checkIn, checkOut] } },
          { check_out_date: { [Op.between]: [checkIn, checkOut] } },
          {
            [Op.and]: [
              { check_in_date: { [Op.lte]: checkIn } },
              { check_out_date: { [Op.gte]: checkOut } }
            ]
          }
        ]
      }
    });

    if (conflictBooking) {
      return errorResponse(res, 'Phòng đã được đặt trong khoảng thời gian này', 'ROOM_NOT_AVAILABLE', 400);
    }

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    let totalPrice = parseFloat(room.price_per_night.toString()) * nights;
    let discountPercentage = 0;
    let appliedPromoCode = null;

    // Kiểm tra mã khuyến mãi
    if (promoCode) {
      const today = new Date();
      const promotion = await Promotion.findOne({
        where: {
          promo_code: promoCode,
          is_active: true,
          start_date: { [Op.lte]: today },
          end_date: { [Op.gte]: today }
        }
      });

      if (promotion) {
        discountPercentage = promotion.discount_percentage;
        totalPrice = totalPrice * (1 - discountPercentage / 100);
        appliedPromoCode = promoCode;
      }
    }

    const booking = await Booking.create({
      user_id: userId!,
      room_id: roomId,
      check_in_date: checkIn,
      check_out_date: checkOut,
      number_of_guests: numberOfGuests,
      total_price: totalPrice,
      payment_method: paymentMethod || 'cash',
      payment_status: paymentMethod === 'payos' ? 'pending' : 'unpaid'
    });

    // Nếu chọn chuyển khoản, trả về thông tin để hiển thị QR
    if (paymentMethod === 'payos') {
      return successResponse(res, 'Đặt phòng thành công! Vui lòng chuyển khoản theo thông tin bên dưới.', {
        ...booking.toJSON(),
        discountApplied: discountPercentage > 0,
        discountPercentage,
        appliedPromoCode,
        paymentMethod: 'bank_transfer',
        bankInfo: {
          bankName: 'MB',
          accountNumber: '0392762050',
          accountName: 'KIM NGOC VINH',
          amount: Math.round(totalPrice),
          content: `DATPHONG ${booking.booking_id}`
        }
      }, 201);
    }

    return successResponse(res, 'Đặt phòng thành công! Vui lòng thanh toán khi nhận phòng.', {
      ...booking.toJSON(),
      discountApplied: discountPercentage > 0,
      discountPercentage,
      appliedPromoCode
    }, 201);
  } catch (error) {
    console.error('Create booking error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const bookings = await Booking.findAll({
      where: { user_id: userId },
      include: [
        { model: Room, as: 'room', attributes: ['room_number', 'price_per_night'] }
      ],
      order: [['booking_date', 'DESC']]
    });

    return successResponse(res, 'Lấy lịch sử đặt phòng thành công.', bookings);
  } catch (error) {
    console.error('Get my bookings error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const booking = await Booking.findOne({
      where: { booking_id: id, user_id: userId }
    });

    if (!booking) {
      return errorResponse(res, 'Không tìm thấy đơn đặt phòng', 'BOOKING_NOT_FOUND', 404);
    }

    if (!['pending', 'confirmed'].includes(booking.status)) {
      return errorResponse(res, 'Không thể hủy đơn đặt phòng này', 'CANNOT_CANCEL');
    }

    booking.status = 'cancelled';
    await booking.save();

    return successResponse(res, 'Hủy đơn đặt phòng thành công.', booking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { status, date } = req.query;
    const where: any = {};

    if (status) where.status = status;
    if (date) {
      const searchDate = new Date(date as string);
      where.check_in_date = { [Op.lte]: searchDate };
      where.check_out_date = { [Op.gte]: searchDate };
    }

    const bookings = await Booking.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['full_name', 'email', 'phone_number', 'address', 'id_card'] },
        { model: Room, as: 'room', attributes: ['room_number', 'price_per_night'] }
      ],
      order: [['booking_date', 'DESC']]
    });

    return successResponse(res, 'Lấy danh sách đặt phòng thành công.', bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return errorResponse(res, 'Không tìm thấy đơn đặt phòng', 'BOOKING_NOT_FOUND', 404);
    }

    booking.status = status;
    await booking.save();

    return successResponse(res, 'Cập nhật trạng thái đặt phòng thành công.', booking);
  } catch (error) {
    console.error('Update booking status error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const updatePaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return errorResponse(res, 'Không tìm thấy đơn đặt phòng', 'BOOKING_NOT_FOUND', 404);
    }

    booking.payment_status = paymentStatus;
    
    // Nếu đã thanh toán, tự động xác nhận đơn
    if (paymentStatus === 'paid' && booking.status === 'pending') {
      booking.status = 'confirmed';
    }
    
    await booking.save();

    return successResponse(res, 'Cập nhật trạng thái thanh toán thành công.', booking);
  } catch (error) {
    console.error('Update payment status error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};
