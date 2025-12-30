const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hotel_booking_db', 'root', 'Vinh@17112004', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

async function checkReviews() {
  try {
    await sequelize.authenticate();
    console.log('✓ Đã kết nối database');

    // Kiểm tra cấu trúc bảng reviews
    const [results] = await sequelize.query('DESCRIBE reviews');
    console.log('\n📋 Cấu trúc bảng reviews:');
    console.table(results);

    // Lấy tất cả reviews
    const [reviews] = await sequelize.query('SELECT * FROM reviews ORDER BY review_date DESC LIMIT 10');
    console.log('\n📝 Danh sách reviews:');
    console.table(reviews);

    process.exit(0);
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
}

checkReviews();
