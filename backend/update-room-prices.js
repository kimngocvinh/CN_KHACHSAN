/**
 * Script để cập nhật giá phòng cho phù hợp với thị trường
 * Chạy: node update-room-prices.js
 */

const mysql = require('mysql2/promise');

const prices = [
  { room_id: 1, price: 500000.00, name: 'Standard 101' },
  { room_id: 2, price: 550000.00, name: 'Standard 102' },
  { room_id: 3, price: 900000.00, name: 'Deluxe 201' },
  { room_id: 4, price: 1200000.00, name: 'Deluxe 202 (View biển)' },
  { room_id: 5, price: 2000000.00, name: 'Suite 301' },
  { room_id: 6, price: 1500000.00, name: 'Family 401' }
];

async function updatePrices() {
  let connection;
  
  try {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║         CẬP NHẬT GIÁ PHÒNG - Update Room Prices          ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Vinh@17112004',
      database: 'hotel_booking_db'
    });

    console.log('✓ Đã kết nối database\n');

    for (const room of prices) {
      const [result] = await connection.execute(
        'UPDATE rooms SET price_per_night = ? WHERE room_id = ?',
        [room.price, room.room_id]
      );

      if (result.affectedRows > 0) {
        const priceFormatted = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(room.price);
        
        console.log(`✓ ${room.name}: ${priceFormatted}/đêm`);
      }
    }

    console.log('\n✅ Cập nhật giá phòng thành công!\n');
    console.log('Bảng giá mới:');
    console.log('  • Standard (101-102):  500K - 550K/đêm');
    console.log('  • Deluxe (201-202):    900K - 1.2M/đêm');
    console.log('  • Suite (301):         2M/đêm');
    console.log('  • Family (401):        1.5M/đêm\n');

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
