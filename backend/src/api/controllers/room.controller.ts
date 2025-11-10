import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Room, RoomType, RoomImage, Amenity, Booking } from '../../models';
import { successResponse, errorResponse } from '../../utils/response';

export const getRooms = async (req: Request, res: Response) => {
  try {
    const { checkIn, checkOut, capacity, roomType } = req.query;
    const where: any = {};

    if (capacity) where.capacity = { [Op.gte]: parseInt(capacity as string) };
    if (roomType) where.room_type_id = parseInt(roomType as string);

    let rooms = await Room.findAll({
      where,
      include: [
        { model: RoomType, as: 'roomType', attributes: ['type_name'] },
        { model: RoomImage, as: 'images', attributes: ['image_url'] },
        { model: Amenity, as: 'amenities', attributes: ['amenity_name'], through: { attributes: [] } }
      ]
    });

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn as string);
      const checkOutDate = new Date(checkOut as string);

      const bookedRoomIds = await Booking.findAll({
        where: {
          status: { [Op.notIn]: ['cancelled'] },
          [Op.or]: [
            {
              check_in_date: { [Op.between]: [checkInDate, checkOutDate] }
            },
            {
              check_out_date: { [Op.between]: [checkInDate, checkOutDate] }
            },
            {
              [Op.and]: [
                { check_in_date: { [Op.lte]: checkInDate } },
                { check_out_date: { [Op.gte]: checkOutDate } }
              ]
            }
          ]
        },
        attributes: ['room_id']
      });

      const bookedIds = bookedRoomIds.map(b => b.room_id);
      rooms = rooms.filter(room => !bookedIds.includes(room.room_id));
    }

    return successResponse(res, 'Lấy danh sách phòng thành công.', rooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const getRoomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const room = await Room.findByPk(id, {
      include: [
        { model: RoomType, as: 'roomType', attributes: ['type_name', 'description'] },
        { model: RoomImage, as: 'images', attributes: ['image_url'] },
        { model: Amenity, as: 'amenities', attributes: ['amenity_name'], through: { attributes: [] } }
      ]
    });

    if (!room) {
      return errorResponse(res, 'Không tìm thấy phòng', 'ROOM_NOT_FOUND', 404);
    }

    return successResponse(res, 'Lấy thông tin phòng thành công.', room);
  } catch (error) {
    console.error('Get room by id error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { roomNumber, typeId, pricePerNight, capacity, description } = req.body;

    // Validation
    if (!roomNumber || !typeId || !pricePerNight || !capacity) {
      return errorResponse(res, 'Thiếu thông tin bắt buộc', 'MISSING_FIELDS');
    }

    const room = await Room.create({
      room_number: roomNumber,
      room_type_id: typeId,
      price_per_night: pricePerNight,
      capacity,
      description
    });

    return successResponse(res, 'Tạo phòng thành công.', room, 201);
  } catch (error) {
    console.error('Create room error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roomNumber, typeId, pricePerNight, capacity, description } = req.body;

    const room = await Room.findByPk(id);
    if (!room) {
      return errorResponse(res, 'Không tìm thấy phòng', 'ROOM_NOT_FOUND', 404);
    }

    if (roomNumber) room.room_number = roomNumber;
    if (typeId) room.room_type_id = typeId;
    if (pricePerNight) room.price_per_night = pricePerNight;
    if (capacity) room.capacity = capacity;
    if (description !== undefined) room.description = description;

    await room.save();

    return successResponse(res, 'Cập nhật phòng thành công.', room);
  } catch (error) {
    console.error('Update room error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const room = await Room.findByPk(id);
    if (!room) {
      return errorResponse(res, 'Không tìm thấy phòng', 'ROOM_NOT_FOUND', 404);
    }

    await room.destroy();

    return successResponse(res, 'Xóa phòng thành công.', null);
  } catch (error) {
    console.error('Delete room error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};

export const updateRoomStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const room = await Room.findByPk(id);
    if (!room) {
      return errorResponse(res, 'Không tìm thấy phòng', 'ROOM_NOT_FOUND', 404);
    }

    room.status = status;
    await room.save();

    return successResponse(res, 'Cập nhật trạng thái phòng thành công.', room);
  } catch (error) {
    console.error('Update room status error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi', 'SERVER_ERROR', 500);
  }
};
