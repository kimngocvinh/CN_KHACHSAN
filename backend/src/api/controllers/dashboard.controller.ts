import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Booking from '../../models/booking.model';
import User from '../../models/user.model';
import Room from '../../models/room.model';
import { successResponse, errorResponse } from '../../utils/response';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Tổng doanh thu tháng này
    const currentMonthBookings = await Booking.findAll({
      where: {
        booking_date: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth]
        },
        status: {
          [Op.in]: ['confirmed', 'checked_in', 'checked_out']
        }
      }
    });

    const totalRevenue = currentMonthBookings.reduce((sum, booking) => 
      sum + parseFloat(booking.total_price.toString()), 0
    );

    // Doanh thu tháng trước
    const lastMonthBookings = await Booking.findAll({
      where: {
        booking_date: {
          [Op.between]: [firstDayOfLastMonth, lastDayOfLastMonth]
        },
        status: {
          [Op.in]: ['confirmed', 'checked_in', 'checked_out']
        }
      }
    });

    const lastMonthRevenue = lastMonthBookings.reduce((sum, booking) => 
      sum + parseFloat(booking.total_price.toString()), 0
    );

    const revenueGrowth = lastMonthRevenue > 0 
      ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : 0;

    // Tổng số đặt phòng tháng này
    const totalBookings = currentMonthBookings.length;
    const lastMonthTotalBookings = lastMonthBookings.length;
    const bookingGrowth = lastMonthTotalBookings > 0
      ? ((totalBookings - lastMonthTotalBookings) / lastMonthTotalBookings * 100).toFixed(1)
      : 0;

    // Tỷ lệ lấp đầy
    const totalRooms = await Room.count();
    const occupiedRooms = await Room.count({
      where: { status: 'occupied' }
    });
    const occupancyRate = totalRooms > 0 
      ? ((occupiedRooms / totalRooms) * 100).toFixed(1)
      : 0;

    // Khách hàng mới trong tháng
    const newCustomers = await User.count({
      where: {
        created_at: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth]
        },
        role_id: 1 // Khách hàng
      }
    });

    // Hoạt động gần đây
    const recentActivities: any = await Booking.findAll({
      limit: 5,
      order: [['booking_date', 'DESC']],
      include: [
        {
          model: Room,
          as: 'room',
          attributes: ['room_number']
        }
      ]
    });

    const activities = recentActivities.map((booking: any) => {
      let activityType = 'new_booking';
      let color = 'green';
      
      if (booking.status === 'checked_in') {
        activityType = 'check_in';
        color = 'blue';
      } else if (booking.status === 'checked_out') {
        activityType = 'check_out';
        color = 'gray';
      }

      const timeAgo = getTimeAgo(new Date(booking.booking_date));

      return {
        type: activityType,
        color,
        roomNumber: booking.room?.room_number || 'N/A',
        time: timeAgo,
        description: getActivityDescription(activityType, booking.room?.room_number)
      };
    });

    // Thống kê theo loại phòng
    const roomTypeStats: any = await Booking.findAll({
      where: {
        booking_date: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth]
        },
        status: {
          [Op.in]: ['confirmed', 'checked_in', 'checked_out']
        }
      },
      include: [
        {
          model: Room,
          as: 'room',
          attributes: ['room_type_id'],
          include: [
            {
              association: 'roomType',
              attributes: ['type_name']
            }
          ]
        }
      ]
    });

    const roomTypeMap = new Map();
    roomTypeStats.forEach((booking: any) => {
      const typeName = booking.room?.roomType?.type_name || 'Unknown';
      if (!roomTypeMap.has(typeName)) {
        roomTypeMap.set(typeName, 0);
      }
      roomTypeMap.set(typeName, roomTypeMap.get(typeName) + 1);
    });

    const totalBookingsForTypes = Array.from(roomTypeMap.values()).reduce((a, b) => a + b, 0);
    const popularRooms = Array.from(roomTypeMap.entries())
      .map(([name, count]) => ({
        name: `Phòng ${name}`,
        bookings: count,
        percentage: totalBookingsForTypes > 0 
          ? ((count / totalBookingsForTypes) * 100).toFixed(0)
          : 0
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 3);

    // Dữ liệu doanh thu theo tháng (6 tháng gần nhất)
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthBookings = await Booking.findAll({
        where: {
          booking_date: {
            [Op.between]: [monthStart, monthEnd]
          },
          status: {
            [Op.in]: ['confirmed', 'checked_in', 'checked_out']
          }
        }
      });

      const monthRevenue = monthBookings.reduce((sum, booking) => 
        sum + parseFloat(booking.total_price.toString()), 0
      );

      const monthNames = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
      
      monthlyRevenue.push({
        month: monthNames[monthStart.getMonth()],
        revenue: monthRevenue,
        bookings: monthBookings.length
      });
    }

    const data = {
      totalRevenue,
      revenueGrowth: parseFloat(revenueGrowth as string),
      totalBookings,
      bookingGrowth: parseFloat(bookingGrowth as string),
      occupancyRate: parseFloat(occupancyRate as string),
      newCustomers,
      recentActivities: activities,
      popularRooms,
      monthlyRevenue
    };

    return successResponse(res, 'Lấy thống kê thành công', data);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return errorResponse(res, 'Lỗi khi lấy thống kê', undefined, 500);
  }
};

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} phút trước`;
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else {
    return `${diffDays} ngày trước`;
  }
}

function getActivityDescription(type: string, roomNumber?: string): string {
  switch (type) {
    case 'new_booking':
      return `Đặt phòng mới`;
    case 'check_in':
      return `Check-in`;
    case 'check_out':
      return `Check-out`;
    default:
      return 'Hoạt động';
  }
}
