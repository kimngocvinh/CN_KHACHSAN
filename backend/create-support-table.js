const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hotel_booking_db', 'root', 'Vinh@17112004', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

async function createSupportRequestsTable() {
  try {
    await sequelize.authenticate();
    console.log('✓ Đã kết nối database');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS support_requests (
        request_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('pending', 'processing', 'resolved', 'closed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✓ Đã tạo bảng support_requests');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
}

createSupportRequestsTable();
