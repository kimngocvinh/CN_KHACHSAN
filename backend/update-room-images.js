/**
 * Script để cập nhật hình ảnh phòng
 * Chạy: node update-room-images.js
 */

const mysql = require('mysql2/promise');

// URL ảnh placeholder từ Unsplash (ảnh khách sạn chất lượng cao)
const roomImages = [
  // Phòng 101 - Standard
  {
    room_id: 1,
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
    ]
  },
  // Phòng 102 - Standard
  {
    room_id: 2,
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800'
    ]
  },
  // Phòng 201 - Deluxe
  {
    room_id: 3,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
    ]
  },
  // Phòng 202 - Deluxe (view biển)
  {
    room_id: 4,
    images: [
      'https://images.unsplash.com/photo-1559508551-44bff1de756b?w=800',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
    ]
  },
  // Phòng 301 - Suite
  {
    room_id: 5,
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800',
      'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'
    ]
  },
  // Phòng 401 - Family
  {
    room_id: 6,
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800'
    ]
  }
];

async function updateImages() {
  let connection;
  
  try {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║      CẬP NHẬT HÌNH ẢNH PHÒNG - Update Room Images        ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Vinh@17112004',
      database: 'hotel_booking_db'
    });

    console.log('✓ Đã kết nối database\n');

    // Xóa ảnh cũ
    await connection.execute('DELETE FROM room_images');
    console.log('✓ Đã xóa ảnh cũ\n');

    let totalImages = 0;

    for (const roomData of roomImages) {
      for (let i = 0; i < roomData.images.length; i++) {
        const isPrimary = i === 0; // Ảnh đầu tiên là ảnh chính
        
        await connection.execute(
          'INSERT INTO room_images (room_id, image_url, is_primary) VALUES (?, ?, ?)',
          [roomData.room_id, roomData.images[i], isPrimary]
        );
        
        totalImages++;
      }
      
      console.log(`✓ Phòng ${roomData.room_id}: ${roomData.images.length} ảnh`);
    }

    console.log(`\n✅ Đã cập nhật ${totalImages} hình ảnh thành công!\n`);

  } catch (error) {
    console.error('✗ Lỗi:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateImages();
