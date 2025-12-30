const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hotel_booking_db', 'root', 'Vinh@17112004', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

async function fixReviewsTable() {
  try {
    await sequelize.authenticate();
    console.log('✓ Đã kết nối database');

    // Sửa cột booking_id thành nullable và bỏ unique constraint
    await sequelize.query('ALTER TABLE reviews MODIFY booking_id INT NULL');
    console.log('✓ Đã sửa booking_id thành nullable');

    // Bỏ unique constraint trên booking_id nếu có
    try {
      await sequelize.query('ALTER TABLE reviews DROP INDEX booking_id');
      console.log('✓ Đã bỏ unique constraint trên booking_id');
    } catch (err) {
      console.log('ℹ Không có unique constraint cần bỏ');
    }

    console.log('\n✅ Hoàn thành! Bây giờ có thể đánh giá phòng mà không cần booking');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
}

fixReviewsTable();
