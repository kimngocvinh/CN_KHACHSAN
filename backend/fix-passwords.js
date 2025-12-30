/**
 * Script to fix user passwords in the database
 * Run: node fix-passwords.js
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function fixPasswords() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Vinh@17112004',
    database: process.env.DB_NAME || 'hotel_booking_db'
  });

  try {
    // Generate proper hash for 'password123'
    const hash = await bcrypt.hash('password123', 10);
    console.log('Generated hash:', hash);

    // Update all users with the correct hash
    const [result] = await connection.execute(
      'UPDATE users SET password_hash = ?',
      [hash]
    );

    console.log(`✅ Updated ${result.affectedRows} users with password: password123`);

    // Show updated users
    const [users] = await connection.execute('SELECT user_id, email, role_id FROM users');
    console.log('\n📧 Users in database:');
    users.forEach(u => {
      const role = u.role_id === 1 ? 'Customer' : u.role_id === 2 ? 'Receptionist' : 'Admin';
      console.log(`   ${u.email} (${role})`);
    });
    console.log('\n🔑 Password for all: password123');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

fixPasswords();
