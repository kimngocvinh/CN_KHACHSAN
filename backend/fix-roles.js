const mysql = require('mysql2/promise');

async function fixRoles() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root123',
    database: 'hotel_booking'
  });
  
  await conn.execute("UPDATE roles SET role_name = 'Quản trị viên' WHERE role_id = 3");
  await conn.execute("UPDATE roles SET role_name = 'Nhân viên lễ tân' WHERE role_id = 2");
  await conn.execute("UPDATE roles SET role_name = 'Khách hàng' WHERE role_id = 1");
  
  const [roles] = await conn.execute('SELECT * FROM roles');
  console.log('Updated roles:', roles);
  
  await conn.end();
}

fixRoles();
