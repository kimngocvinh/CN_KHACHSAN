const mysql = require('mysql2/promise');
require('dotenv').config();

async function createPromotions() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hotel_booking'
  });

  try {
    // Xóa khuyến mãi cũ nếu có
    await connection.execute('DELETE FROM promotions');
    
    // Tạo khuyến mãi mới
    const promotions = [
      {
        promo_code: 'NEWYEAR25',
        discount_percentage: 25,
        start_date: '2024-12-25',
        end_date: '2025-01-31',
        is_active: true
      },
      {
        promo_code: 'WELCOME10',
        discount_percentage: 10,
        start_date: '2024-01-01',
        end_date: '2025-12-31',
        is_active: true
      },
      {
        promo_code: 'SUMMER20',
        discount_percentage: 20,
        start_date: '2025-06-01',
        end_date: '2025-08-31',
        is_active: true
      }
    ];

    for (const promo of promotions) {
      await connection.execute(
        'INSERT INTO promotions (promo_code, discount_percentage, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?)',
        [promo.promo_code, promo.discount_percentage, promo.start_date, promo.end_date, promo.is_active]
      );
      console.log(`✓ Tạo mã ${promo.promo_code} - Giảm ${promo.discount_percentage}%`);
    }

    console.log('\n✓ Tạo khuyến mãi thành công!');
    console.log('- NEWYEAR25: Giảm 25% (25/12/2024 - 31/01/2025) - Đang hoạt động');
    console.log('- WELCOME10: Giảm 10% (01/01/2024 - 31/12/2025) - Đang hoạt động');
    console.log('- SUMMER20: Giảm 20% (01/06/2025 - 31/08/2025) - Chưa đến ngày');

  } catch (error) {
    console.error('Lỗi:', error.message);
  } finally {
    await connection.end();
  }
}

createPromotions();
