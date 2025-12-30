const mysql = require('mysql2/promise');

async function clearOldImages() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vinh@17112004',
    database: 'hotel_booking_db'
  });

  try {
    // Xóa các ảnh cũ không tồn tại (bắt đầu bằng /images/)
    const [result] = await connection.execute(
      "DELETE FROM room_images WHERE image_url LIKE '/images/%'"
    );
    console.log(`✅ Đã xóa ${result.affectedRows} ảnh cũ không tồn tại`);
  } catch (error) {
    console.error('Lỗi:', error.message);
  } finally {
    await connection.end();
  }
}

clearOldImages();
