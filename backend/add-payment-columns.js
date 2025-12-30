const mysql = require('mysql2/promise');
require('dotenv').config();

async function addPaymentColumns() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hotel_booking'
  });

  try {
    // Kiểm tra và thêm cột payment_method
    try {
      await connection.execute(`
        ALTER TABLE bookings 
        ADD COLUMN payment_method ENUM('cash', 'payos') DEFAULT 'cash'
      `);
      console.log('✓ Đã thêm cột payment_method');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('- Cột payment_method đã tồn tại');
      } else {
        throw e;
      }
    }

    // Kiểm tra và thêm cột payment_status
    try {
      await connection.execute(`
        ALTER TABLE bookings 
        ADD COLUMN payment_status ENUM('unpaid', 'pending', 'paid') DEFAULT 'unpaid'
      `);
      console.log('✓ Đã thêm cột payment_status');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('- Cột payment_status đã tồn tại');
      } else {
        throw e;
      }
    }

    console.log('\n✓ Hoàn thành cập nhật database!');

  } catch (error) {
    console.error('Lỗi:', error.message);
  } finally {
    await connection.end();
  }
}

addPaymentColumns();
