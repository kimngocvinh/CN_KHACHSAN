const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function updateUsers() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vinh@17112004',
    database: 'hotel_booking_db'
  });

  try {
    const hash = await bcrypt.hash('123456', 10);

    // Cập nhật Admin
    await connection.execute(
      'UPDATE users SET email = ?, password_hash = ? WHERE role_id = 3',
      ['admin@gmail.com', hash]
    );
    console.log('✅ Admin: admin@gmail.com / 123456');

    // Cập nhật Lễ tân
    await connection.execute(
      'UPDATE users SET email = ?, password_hash = ? WHERE role_id = 2',
      ['letan@gmail.com', hash]
    );
    console.log('✅ Lễ tân: letan@gmail.com / 123456');

  } catch (error) {
    console.error('Lỗi:', error.message);
  } finally {
    await connection.end();
  }
}

updateUsers();
