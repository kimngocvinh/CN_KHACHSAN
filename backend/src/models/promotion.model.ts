import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';

interface PromotionAttributes {
  promotion_id: number;
  promo_code: string;
  discount_percentage: number;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
}

interface PromotionCreationAttributes extends Optional<PromotionAttributes, 'promotion_id' | 'is_active'> {}

class Promotion extends Model<PromotionAttributes, PromotionCreationAttributes> implements PromotionAttributes {
  public promotion_id!: number;
  public promo_code!: string;
  public discount_percentage!: number;
  public start_date!: Date;
  public end_date!: Date;
  public is_active!: boolean;
}

Promotion.init(
  {
    promotion_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    promo_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    discount_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'promotions',
    timestamps: false
  }
);

export default Promotion;
