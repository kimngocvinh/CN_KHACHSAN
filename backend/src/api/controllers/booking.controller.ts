import { Response } from 'express';
import { Op } from 'sequelize';
import { Booking, Room, User } from '../../models';
import { AuthRequest } from '../middlewares/auth.middleware';
import { successResponse, errorResponse } from '../../utils/response';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId, checkInDate, checkOutDate, numberOfGuests } = req.body;
    const userId = req.user?.userId;

    const room = await Room.findByPk(roomId);
    if (!room) {
      return errorResponse(res, 'Không tìm thấy phòng', 'ROOM_NOT_FOUND', 404);
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const conflictBooking = await Booking.findOne({
      where: {
        room_id: roomId,
        status: { [Op.notIn]: ['cancelled'] },
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
      return errorResponse(res, 'Phòng đã được đặt trong khoảng thời gian này', 'ROOM_NOT_AVAILABLE');
    }

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = parseFloat(room.price_per_night.toString()) * nights;

    const booking = await Booking.create({
      user_id: userId!,
      room_id: roomId,
      check_in_date: checkIn,
      check_out_date: checkOut,
      number_of_guests: numberOfGuests,
      total_price: totalPrice
    });

    return successResponse(res, 'Đặt phòng thành công!', booking, 201);
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
        { model: User, as: 'user', attributes: ['full_name', 'email', 'phone_number'] },
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
