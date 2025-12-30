const mysql = require('mysql2/promise');

async function syncData() {
  const localConn = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Vinh@17112004',
    database: 'hotel_booking_db'
  });

  const dockerConn = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root123',
    database: 'hotel_booking'
  });

  try {
    console.log('Syncing data from local to Docker...\n');

    // 1. Sync room_types
    const [localRoomTypes] = await localConn.execute('SELECT * FROM room_types');
    for (const rt of localRoomTypes) {
      const id = rt.type_id || rt.room_type_id;
      try {
        await dockerConn.execute(
          'INSERT INTO room_types (room_type_id, type_name, description) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE type_name=VALUES(type_name), description=VALUES(description)',
          [id, rt.type_name, rt.description || null]
        );
      } catch (e) { console.log('RT error:', e.message); }
    }
    console.log('✓ Room types synced:', localRoomTypes.length);

    // 2. Sync rooms
    const [localRooms] = await localConn.execute('SELECT * FROM rooms');
    for (const r of localRooms) {
      try {
        await dockerConn.execute(
          'INSERT INTO rooms (room_id, room_number, room_type_id, price_per_night, capacity, description, status) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE room_number=VALUES(room_number), room_type_id=VALUES(room_type_id), price_per_night=VALUES(price_per_night), description=VALUES(description), status=VALUES(status)',
          [r.room_id, r.room_number, r.type_id || r.room_type_id, r.price_per_night, r.max_guests || r.capacity || 2, r.description || null, r.status || 'available']
        );
      } catch (e) { console.log('Room error:', e.message); }
    }
    console.log('✓ Rooms synced:', localRooms.length);

    // 3. Sync room_images
    const [localImages] = await localConn.execute('SELECT * FROM room_images');
    for (const img of localImages) {
      try {
        await dockerConn.execute(
          'INSERT INTO room_images (image_id, room_id, image_url, is_primary) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE image_url=VALUES(image_url)',
          [img.image_id, img.room_id, img.image_url, img.is_primary || 0]
        );
      } catch (e) { console.log('Image error:', e.message); }
    }
    console.log('✓ Room images synced:', localImages.length);

    // 4. Sync users (customers only)
    const [localUsers] = await localConn.execute("SELECT * FROM users WHERE role_id = 1");
    for (const u of localUsers) {
      try {
        await dockerConn.execute(
          'INSERT INTO users (user_id, full_name, email, password_hash, phone_number, address, id_card, role_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE full_name=VALUES(full_name)',
          [u.user_id, u.full_name, u.email, u.password_hash, u.phone_number || null, u.address || null, u.id_card || null, 1, u.created_at || new Date()]
        );
      } catch (e) { console.log('User error:', e.message); }
    }
    console.log('✓ Users synced:', localUsers.length);

    // 5. Sync promotions
    const [localPromos] = await localConn.execute('SELECT * FROM promotions');
    for (const p of localPromos) {
      try {
        const code = p.code || p.promo_code;
        const discount = p.discount_percent || p.discount_percentage;
        const isActive = p.is_active !== undefined ? p.is_active : 1;
        await dockerConn.execute(
          'INSERT INTO promotions (promotion_id, promo_code, discount_percentage, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE promo_code=VALUES(promo_code)',
          [p.promotion_id, code, discount, p.start_date, p.end_date, isActive]
        );
      } catch (e) { console.log('Promo error:', e.message); }
    }
    console.log('✓ Promotions synced:', localPromos.length);

    // 6. Sync bookings
    const [localBookings] = await localConn.execute('SELECT * FROM bookings');
    for (const b of localBookings) {
      try {
        await dockerConn.execute(
          'INSERT INTO bookings (booking_id, user_id, room_id, check_in_date, check_out_date, number_of_guests, total_price, status, payment_method, payment_status, booking_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status=VALUES(status)',
          [b.booking_id, b.user_id, b.room_id, b.check_in_date, b.check_out_date, b.number_of_guests || 1, b.total_price, b.status || 'pending', b.payment_method || 'cash', b.payment_status || 'unpaid', b.created_at || b.booking_date || new Date()]
        );
      } catch (e) { console.log('Booking error:', e.message); }
    }
    console.log('✓ Bookings synced:', localBookings.length);

    // 7. Sync reviews
    const [localReviews] = await localConn.execute('SELECT * FROM reviews');
    for (const r of localReviews) {
      try {
        await dockerConn.execute(
          'INSERT INTO reviews (review_id, user_id, room_id, booking_id, rating, comment, review_date) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE rating=VALUES(rating)',
          [r.review_id, r.user_id, r.room_id, r.booking_id || null, r.rating, r.comment || null, r.created_at || r.review_date || new Date()]
        );
      } catch (e) { console.log('Review error:', e.message); }
    }
    console.log('✓ Reviews synced:', localReviews.length);

    // 8. Sync support_requests (skip if table doesn't exist in local)
    try {
      const [localSupports] = await localConn.execute('SELECT * FROM support_requests');
      for (const s of localSupports) {
        try {
          await dockerConn.execute(
            'INSERT INTO support_requests (request_id, name, email, phone, subject, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status=VALUES(status)',
            [s.request_id, s.name, s.email, s.phone || null, s.subject, s.message, s.status || 'pending', s.created_at || new Date()]
          );
        } catch (e) { console.log('Support error:', e.message); }
      }
      console.log('✓ Support requests synced:', localSupports.length);
    } catch (e) {
      console.log('- Support requests table not found in local, skipping');
    }

    console.log('\n✅ All data synced successfully!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await localConn.end();
    await dockerConn.end();
  }
}

syncData();
