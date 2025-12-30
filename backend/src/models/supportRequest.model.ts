import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';

interface SupportRequestAttributes {
  request_id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  created_at?: Date;
  updated_at?: Date;
}

interface SupportRequestCreationAttributes extends Optional<SupportRequestAttributes, 'request_id' | 'phone' | 'status' | 'created_at' | 'updated_at'> {}

class SupportRequest extends Model<SupportRequestAttributes, SupportRequestCreationAttributes> implements SupportRequestAttributes {
  public request_id!: number;
  public name!: string;
  public email!: string;
  public phone?: string;
  public subject!: string;
  public message!: string;
  public status!: 'pending' | 'processing' | 'resolved' | 'closed';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

SupportRequest.init(
  {
    request_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    subject: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'resolved', 'closed'),
      defaultValue: 'pending'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'support_requests',
    timestamps: false
  }
);

export default SupportRequest;
