const mysql = require('mysql2/promise');
require('dotenv').config();

async function addUserFields() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hotel_booking'
  });

  try {
    // Thêm cột address
    try {
      await connection.execute(`ALTER TABLE users ADD COLUMN address VARCHAR(500)`);
      console.log('✓ Đã thêm cột address');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('- Cột address đã tồn tại');
      } else {
        throw e;
      }
    }

    // Thêm cột id_card (căn cước)
    try {
      await connection.execute(`ALTER TABLE users ADD COLUMN id_card VARCHAR(20)`);
      console.log('✓ Đã thêm cột id_card');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('- Cột id_card đã tồn tại');
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

addUserFields();
