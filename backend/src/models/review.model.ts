import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';

interface ReviewAttributes {
  review_id: number;
  booking_id: number;
  user_id: number;
  room_id: number;
  rating: number;
  comment?: string;
  review_date?: Date;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'review_id' | 'review_date'> {}

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public review_id!: number;
  public booking_id!: number;
  public user_id!: number;
  public room_id!: number;
  public rating!: number;
  public comment?: string;
  public readonly review_date!: Date;
}

Review.init(
  {
    review_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    review_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'reviews',
    timestamps: false
  }
);

export default Review;
