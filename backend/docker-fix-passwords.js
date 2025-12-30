const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function fixPasswords() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root123',
    database: 'hotel_booking'
  });

  try {
    const hash = await bcrypt.hash('password123', 10);
    console.log('Generated hash:', hash);
    
    await connection.execute(
      'UPDATE users SET password_hash = ? WHERE email IN (?, ?)',
      [hash, 'admin@gmail.com', 'letan@gmail.com']
    );
    
    console.log('Password updated successfully!');
    
    const [rows] = await connection.execute('SELECT email, password_hash FROM users');
    console.log('Users:', rows);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

fixPasswords();
