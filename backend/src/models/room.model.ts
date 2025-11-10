import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';

interface RoomAttributes {
  room_id: number;
  room_number: string;
  room_type_id: number;
  price_per_night: number;
  capacity: number;
  description?: string;
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
}

interface RoomCreationAttributes extends Optional<RoomAttributes, 'room_id' | 'status'> {}

class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
  public room_id!: number;
  public room_number!: string;
  public room_type_id!: number;
  public price_per_night!: number;
  public capacity!: number;
  public description?: string;
  public status!: 'available' | 'occupied' | 'cleaning' | 'maintenance';
}

Room.init(
  {
    room_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    room_number: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    room_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price_per_night: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'cleaning', 'maintenance'),
      defaultValue: 'available'
    }
  },
  {
    sequelize,
    tableName: 'rooms',
    timestamps: false
  }
);

export default Room;
