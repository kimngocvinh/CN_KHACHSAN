const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hotel_booking_db', 'root', 'Vinh@17112004', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

async function updateRoom202Image() {
  try {
    await sequelize.authenticate();
    console.log('✓ Đã kết nối database');

    // Cập nhật hình ảnh phòng 202
    await sequelize.query(`
      UPDATE room_images 
      SET image_url = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
      WHERE room_id = 2 AND is_primary = 1
    `);

    console.log('✓ Đã cập nhật hình ảnh phòng 202');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
}

updateRoom202Image();
