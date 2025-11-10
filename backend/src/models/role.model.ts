import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';

interface RoleAttributes {
  role_id: number;
  role_name: string;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'role_id'> {}

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public role_id!: number;
  public role_name!: string;
}

Role.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    role_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: false
  }
);

export default Role;
