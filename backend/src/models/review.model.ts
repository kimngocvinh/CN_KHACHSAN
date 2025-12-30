import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';

interface ReviewAttributes {
  review_id: number;
  booking_id?: number;
  user_id: number;
  room_id: number;
  rating: number;
  comment?: string;
  created_at?: Date;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'review_id' | 'booking_id' | 'created_at'> {}

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public review_id!: number;
  public booking_id?: number;
  public user_id!: number;
  public room_id!: number;
  public rating!: number;
  public comment?: string;
  public readonly created_at!: Date;
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
      allowNull: true
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'review_date'
    }
  },
  {
    sequelize,
    tableName: 'reviews',
    timestamps: false
  }
);

export default Review;
