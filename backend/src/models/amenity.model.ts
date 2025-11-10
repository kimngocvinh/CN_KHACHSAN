import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';

interface AmenityAttributes {
  amenity_id: number;
  amenity_name: string;
}

interface AmenityCreationAttributes extends Optional<AmenityAttributes, 'amenity_id'> {}

class Amenity extends Model<AmenityAttributes, AmenityCreationAttributes> implements AmenityAttributes {
  public amenity_id!: number;
  public amenity_name!: string;
}

Amenity.init(
  {
    amenity_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    amenity_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    tableName: 'amenities',
    timestamps: false
  }
);

export default Amenity;
