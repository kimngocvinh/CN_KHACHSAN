/**
 * Script để tạo các user mẫu trong database
 * Chạy: node seed-users.js
 */

const BASE_URL = 'http://localhost:8080/api/v1';

const users = [
  {
    fullName: 'Khách Hàng',
    email: 'customer@hotel.com',
    password: '123456',
    phoneNumber: '0912345678',
    role: 'Khách hàng',
    roleId: 1
  },
  {
    fullName: 'Lễ Tân',
    email: 'letan@hotel.com',
    password: '123456',
    phoneNumber: '0333444555',
    role: 'Nhân viên lễ tân',
    roleId: 2
  },
  {
    fullName: 'Quản Trị Viên',
    email: 'admin@hotel.com',
    password: '123456',
    phoneNumber: '0555666777',
    role: 'Quản trị viên',
    roleId: 3
  }
];

async function registerUser(userData) {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    
    if (response.status === 201) {
      console.log(`✓ Đăng ký thành công: ${userData.fullName} (${userData.email})`);
      return { success: true, data: result.data };
    } else if (response.status === 400 && result.error === 'EMAIL_EXISTS') {
      console.log(`⚠ Email đã tồn tại: ${userData.email}`);
      return { success: false, exists: true };
    } else {
      console.log(`✗ Lỗi đăng ký ${userData.email}: ${result.message}`);
      return { success: false, error: result.message };
    }
  } catch (error) {
    console.error(`✗ Lỗi kết nối: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function updateUserRole(userId, roleId) {
  const mysql = require('mysql2/promise');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Vinh@17112004',
      database: 'hotel_booking_db'
    });

    await connection.execute(
      'UPDATE users SET role_id = ? WHERE user_id = ?',
      [roleId, userId]
    );

    await connection.end();
    console.log(`  ✓ Updated role_id = ${roleId} for user_id = ${userId}`);
    return true;
  } catch (error) {
    console.log(`  ✗ Failed to update role: ${error.message}`);
    return false;
  }
}

async function seedUsers() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║           SEED USERS - Tạo dữ liệu người dùng mẫu         ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const results = [];
  const createdUsers = {
    customer: null,
    receptionist: null,
    admin: null
  };

  for (const user of users) {
    const result = await registerUser(user);
    results.push({ ...user, ...result });
    
    if (result.success) {
      const userId = result.data.user.userId;
      
      // Update role nếu không phải customer
      if (user.roleId !== 1) {
        await updateUserRole(userId, user.roleId);
      }

      // Lưu thông tin user để ghi vào file
      if (user.roleId === 1) createdUsers.customer = { email: user.email, password: user.password };
      if (user.roleId === 2) createdUsers.receptionist = { email: user.email, password: user.password };
      if (user.roleId === 3) createdUsers.admin = { email: user.email, password: user.password };
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('KẾT QUẢ SEED USERS');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success).length;
  const existing = results.filter(r => r.exists).length;
  const failed = results.filter(r => !r.success && !r.exists).length;

  console.log(`✓ Đăng ký thành công: ${successful}`);
  console.log(`⚠ Đã tồn tại: ${existing}`);
  console.log(`✗ Thất bại: ${failed}`);

  if (successful > 0) {
    // Ghi thông tin vào file để test-api.js sử dụng
    const fs = require('fs');
    fs.writeFileSync('test-credentials.json', JSON.stringify(createdUsers, null, 2));
    
    console.log('\n✅ Đã lưu thông tin đăng nhập vào test-credentials.json');
    console.log('\n📧 Thông tin đăng nhập:');
    if (createdUsers.customer) console.log(`   Customer: ${createdUsers.customer.email}`);
    if (createdUsers.receptionist) console.log(`   Receptionist: ${createdUsers.receptionist.email}`);
    if (createdUsers.admin) console.log(`   Admin: ${createdUsers.admin.email}`);
    console.log(`   Password: password123`);
  }

  console.log('\n✅ Hoàn thành! Bây giờ có thể chạy: node test-api.js\n');
}

// Chạy seed
seedUsers();
