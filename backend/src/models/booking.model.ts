import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';

interface BookingAttributes {
  booking_id: number;
  user_id: number;
  room_id: number;
  check_in_date: Date;
  check_out_date: Date;
  number_of_guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  payment_method?: 'cash' | 'payos';
  payment_status?: 'unpaid' | 'pending' | 'paid';
  booking_date?: Date;
}

interface BookingCreationAttributes extends Optional<BookingAttributes, 'booking_id' | 'status' | 'payment_method' | 'payment_status' | 'booking_date'> {}

class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public booking_id!: number;
  public user_id!: number;
  public room_id!: number;
  public check_in_date!: Date;
  public check_out_date!: Date;
  public number_of_guests!: number;
  public total_price!: number;
  public status!: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  public payment_method!: 'cash' | 'payos';
  public payment_status!: 'unpaid' | 'pending' | 'paid';
  public readonly booking_date!: Date;
}

Booking.init(
  {
    booking_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    check_in_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    check_out_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    number_of_guests: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'),
      defaultValue: 'pending'
    },
    payment_method: {
      type: DataTypes.ENUM('cash', 'payos'),
      defaultValue: 'cash'
    },
    payment_status: {
      type: DataTypes.ENUM('unpaid', 'pending', 'paid'),
      defaultValue: 'unpaid'
    },
    booking_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'bookings',
    timestamps: false
  }
);

export default Booking;
