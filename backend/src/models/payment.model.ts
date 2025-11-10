import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';

interface PaymentAttributes {
  payment_id: number;
  booking_id: number;
  amount: number;
  payment_method: 'cash' | 'credit_card' | 'online_banking';
  payment_date?: Date;
  status: 'pending' | 'completed' | 'failed';
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'payment_id' | 'payment_date' | 'status'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public payment_id!: number;
  public booking_id!: number;
  public amount!: number;
  public payment_method!: 'cash' | 'credit_card' | 'online_banking';
  public readonly payment_date!: Date;
  public status!: 'pending' | 'completed' | 'failed';
}

Payment.init(
  {
    payment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    payment_method: {
      type: DataTypes.ENUM('cash', 'credit_card', 'online_banking'),
      allowNull: false
    },
    payment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    }
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: false
  }
);

export default Payment;
