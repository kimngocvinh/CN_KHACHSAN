import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';

interface RoomImageAttributes {
  image_id: number;
  room_id: number;
  image_url: string;
  is_primary?: boolean;
}

interface RoomImageCreationAttributes extends Optional<RoomImageAttributes, 'image_id' | 'is_primary'> {}

class RoomImage extends Model<RoomImageAttributes, RoomImageCreationAttributes> implements RoomImageAttributes {
  public image_id!: number;
  public room_id!: number;
  public image_url!: string;
  public is_primary?: boolean;
}

RoomImage.init(
  {
    image_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'room_images',
    timestamps: false
  }
);

export default RoomImage;
