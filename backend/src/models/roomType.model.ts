import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';

interface RoomTypeAttributes {
  room_type_id: number;
  type_name: string;
  description?: string;
}

interface RoomTypeCreationAttributes extends Optional<RoomTypeAttributes, 'room_type_id'> {}

class RoomType extends Model<RoomTypeAttributes, RoomTypeCreationAttributes> implements RoomTypeAttributes {
  public room_type_id!: number;
  public type_name!: string;
  public description?: string;
}

RoomType.init(
  {
    room_type_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    type_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'room_types',
    timestamps: false
  }
);

export default RoomType;
