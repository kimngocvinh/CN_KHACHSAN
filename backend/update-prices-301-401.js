/**
 * Script cập nhật giá phòng 301 và 401
 * Chạy: node update-prices-301-401.js
 */

const mysql = require('mysql2/promise');

async function updatePrices() {
  let connection;
  
  try {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║           CẬP NHẬT GIÁ PHÒNG 301 & 401                    ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Vinh@17112004',
      database: 'hotel_booking_db'
    });

    console.log('✓ Đã kết nối database\n');

    // Cập nhật phòng 301 (Suite) - giảm từ 2M xuống 1.2M
    await connection.execute(
      'UPDATE rooms SET price_per_night = ? WHERE room_id = ?',
      [1200000.00, 5]
    );
    console.log('✓ Phòng 301 (Suite): 1.200.000 ₫/đêm');

    // Cập nhật phòng 401 (Family) - giảm từ 1.5M xuống 900K
    await connection.execute(
      'UPDATE rooms SET price_per_night = ? WHERE room_id = ?',
      [900000.00, 6]
    );
    console.log('✓ Phòng 401 (Family): 900.000 ₫/đêm');

    console.log('\n✅ Cập nhật giá thành công!\n');
    console.log('Bảng giá mới:');
    console.log('  • Standard (101-102):  500K - 550K/đêm');
    console.log('  • Deluxe (201-202):    900K - 1.2M/đêm');
    console.log('  • Suite (301):         1.2M/đêm ⬇️');
    console.log('  • Family (401):        900K/đêm ⬇️\n');

  } catch (error) {
    console.error('✗ Lỗi:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updatePrices();
