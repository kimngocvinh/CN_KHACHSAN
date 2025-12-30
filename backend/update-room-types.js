const mysql = require('mysql2/promise');

async function updateRoomTypes() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vinh@17112004',
    database: 'hotel_booking_db'
  });

  try {
    await conn.execute("UPDATE room_types SET type_name = 'Phòng Tiêu chuẩn' WHERE room_type_id = 1");
    await conn.execute("UPDATE room_types SET type_name = 'Phòng Cao cấp' WHERE room_type_id = 2");
    await conn.execute("UPDATE room_types SET type_name = 'Phòng Hạng sang' WHERE room_type_id = 3");
    await conn.execute("UPDATE room_types SET type_name = 'Phòng Gia đình' WHERE room_type_id = 4");
    console.log('✅ Đã đổi tên loại phòng sang tiếng Việt:');
    console.log('   1. Phòng Tiêu chuẩn (Standard)');
    console.log('   2. Phòng Cao cấp (Deluxe)');
    console.log('   3. Phòng Hạng sang (Suite)');
    console.log('   4. Phòng Gia đình (Family)');
  } catch (error) {
    console.error('Lỗi:', error.message);
  } finally {
    await conn.end();
  }
}

updateRoomTypes();
