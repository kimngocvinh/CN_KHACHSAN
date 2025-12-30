import sequelize from '../config/db.config';
import User from './user.model';
import Role from './role.model';
import Room from './room.model';
import RoomType from './roomType.model';
import Booking from './booking.model';
import Review from './review.model';
import RoomImage from './roomImage.model';
import Amenity from './amenity.model';
import Payment from './payment.model';
import Promotion from './promotion.model';
import SupportRequest from './supportRequest.model';

// Define associations
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id' });

Room.belongsTo(RoomType, { foreignKey: 'room_type_id', as: 'roomType' });
RoomType.hasMany(Room, { foreignKey: 'room_type_id' });

Room.hasMany(RoomImage, { foreignKey: 'room_id', as: 'images' });
RoomImage.belongsTo(Room, { foreignKey: 'room_id' });

Room.belongsToMany(Amenity, { through: 'room_amenities', foreignKey: 'room_id', as: 'amenities' });
Amenity.belongsToMany(Room, { through: 'room_amenities', foreignKey: 'amenity_id' });

Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Booking.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });
User.hasMany(Booking, { foreignKey: 'user_id' });
Room.hasMany(Booking, { foreignKey: 'room_id' });

Review.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Review.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });
Booking.hasOne(Review, { foreignKey: 'booking_id', as: 'review' });

Payment.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });
Booking.hasMany(Payment, { foreignKey: 'booking_id', as: 'payments' });

export {
  sequelize,
  User,
  Role,
  Room,
  RoomType,
  Booking,
  Review,
  RoomImage,
  Amenity,
  Payment,
  Promotion,
  SupportRequest
};
