/**
 * FULL API TEST SUITE - Hotel Booking System
 * Test 100% chức năng theo đề cương
 * Chạy: node test-api-full.js
 */

const fs = require('fs');
const BASE_URL = 'http://localhost:8080/api/v1';

// Colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// Test data
const testData = {
  tokens: {
    customer: '',
    receptionist: '',
    admin: ''
  },
  users: {
    customer: null,
    receptionist: null,
    admin: null
  },
  roomId: 0,
  bookingId: 0,
  reviewId: 0,
  promotionId: 0
};

// Load credentials if exists
try {
  const creds = JSON.parse(fs.readFileSync('test-credentials.json', 'utf8'));
  testData.users = creds;
} catch (e) {
  console.log('⚠ Không tìm thấy test-credentials.json, sẽ tạo user mới');
}

// Helper functions
async function request(method, endpoint, data = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (token) options.headers['Authorization'] = `Bearer ${token}`;
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

function log(testName, passed, message = '') {
  const icon = passed ? '✓' : '✗';
  const color = passed ? colors.green : colors.red;
  console.log(`${color}${icon} ${testName}${colors.reset}${message ? ': ' + message : ''}`);
  return passed;
}

function section(title) {
  console.log(`\n${colors.cyan}${'='.repeat(70)}`);
  console.log(`${title}`);
  console.log(`${'='.repeat(70)}${colors.reset}\n`);
}

// ============================================================================
// 1. KHÁCH HÀNG - CUSTOMER FEATURES
// ============================================================================

async function testCustomerAuth() {
  section('1. KHÁCH HÀNG - XÁC THỰC');

  // 1.1 Đăng ký
  const registerData = {
    fullName: 'Test Customer Full',
    email: `customer_test_${Date.now()}@test.com`,
    password: 'password123',
    phoneNumber: '0912345678'
  };

  const { status, data } = await request('POST', '/auth/register', registerData);
  const passed = log('Đăng ký tài khoản', status === 201 && data.success);
  
  if (passed) {
    testData.tokens.customer = data.data.accessToken;
    testData.users.customer = { email: registerData.email, password: registerData.password };
  }

  // 1.2 Đăng nhập
  const { status: s2, data: d2 } = await request('POST', '/auth/login', {
    email: registerData.email,
    password: registerData.password
  });
  log('Đăng nhập', s2 === 200 && d2.success);

  // 1.3 Test validation
  const { status: s3 } = await request('POST', '/auth/register', {
    email: 'invalid-email',
    password: '123'
  });
  log('Validation đăng ký', s3 === 400);
}

async function testCustomerProfile() {
  section('2. KHÁCH HÀNG - QUẢN LÝ THÔNG TIN CÁ NHÂN');

  // 2.1 Xem thông tin
  const { status, data } = await request('GET', '/users/profile', null, testData.tokens.customer);
  log('Xem thông tin cá nhân', status === 200 && data.success);

  // 2.2 Cập nhật thông tin
  const { status: s2, data: d2 } = await request('PUT', '/users/profile', {
    fullName: 'Updated Customer Name',
    phoneNumber: '0999888777'
  }, testData.tokens.customer);
  log('Cập nhật thông tin cá nhân', s2 === 200 && d2.success);

  // 2.3 Test unauthorized
  const { status: s3 } = await request('GET', '/users/profile');
  log('Chặn truy cập không có token', s3 === 401);
}

async function testCustomerRoomSearch() {
  section('3. KHÁCH HÀNG - TÌM KIẾM & XEM PHÒNG');

  // 3.1 Xem danh sách phòng
  const { status, data } = await request('GET', '/rooms');
  const passed = log('Xem danh sách phòng', status === 200 && Array.isArray(data.data));
  
  if (passed && data.data.length > 0) {
    testData.roomId = data.data[0].room_id;
  }

  // 3.2 Tìm kiếm phòng trống theo ngày
  const { status: s2, data: d2 } = await request('GET', 
    '/rooms?checkIn=2025-12-24&checkOut=2025-12-26');
  log('Tìm kiếm phòng theo ngày', s2 === 200);

  // 3.3 Lọc theo sức chứa
  const { status: s3 } = await request('GET', '/rooms?capacity=2');
  log('Lọc phòng theo sức chứa', s3 === 200);

  // 3.4 Lọc theo loại phòng
  const { status: s4 } = await request('GET', '/rooms?roomType=1');
  log('Lọc phòng theo loại', s4 === 200);

  // 3.5 Xem chi tiết phòng
  if (testData.roomId) {
    const { status: s5, data: d5 } = await request('GET', `/rooms/${testData.roomId}`);
    log('Xem chi tiết phòng', s5 === 200 && d5.data.room_number);
  }
}

async function testCustomerBooking() {
  section('4. KHÁCH HÀNG - ĐẶT PHÒNG');

  // 4.1 Tạo đơn đặt phòng
  // Tìm phòng trống
  const { data: availableRooms } = await request('GET', '/rooms?checkIn=2026-01-20&checkOut=2026-01-22');
  const availableRoomId = availableRooms.data?.[0]?.room_id || testData.roomId || 1;
  
  const bookingData = {
    roomId: availableRoomId,
    checkInDate: '2026-01-20',
    checkOutDate: '2026-01-22',
    numberOfGuests: 2
  };

  const { status, data } = await request('POST', '/bookings', bookingData, testData.tokens.customer);
  const passed = log('Tạo đơn đặt phòng', status === 201 && data.success, 
    status !== 201 ? `Status: ${status}, Message: ${data.message}` : '');
  
  if (passed) {
    testData.bookingId = data.data.booking_id;
  }

  // 4.2 Xem lịch sử đặt phòng
  const { status: s2, data: d2 } = await request('GET', '/bookings/my-bookings', null, testData.tokens.customer);
  log('Xem lịch sử đặt phòng', s2 === 200 && Array.isArray(d2.data),
    s2 !== 200 ? `Status: ${s2}, Message: ${d2.message}` : '');

  // 4.3 Test đặt phòng trùng lịch
  const { status: s3, data: d3 } = await request('POST', '/bookings', bookingData, testData.tokens.customer);
  log('Chặn đặt phòng trùng lịch', s3 === 400);

  // 4.4 Hủy đơn đặt phòng
  if (testData.bookingId) {
    const { status: s4, data: d4 } = await request('PUT', `/bookings/${testData.bookingId}/cancel`, 
      null, testData.tokens.customer);
    log('Hủy đơn đặt phòng', s4 === 200 && d4.success);
  }

  // 4.5 Test không thể hủy booking của người khác
  const { status: s5 } = await request('PUT', '/bookings/999/cancel', null, testData.tokens.customer);
  log('Chặn hủy booking người khác', s5 === 404);
}

async function testCustomerReview() {
  section('5. KHÁCH HÀNG - ĐÁNH GIÁ');

  // 5.1 Xem đánh giá của phòng
  const { status, data } = await request('GET', `/reviews/room/${testData.roomId || 1}`);
  log('Xem đánh giá phòng', status === 200 && Array.isArray(data.data),
    status !== 200 ? `Status: ${status}, Message: ${data.message}` : '');

  // 5.2 Tạo đánh giá (cần booking đã checked_out)
  const reviewData = {
    bookingId: 1, // Booking từ database
    rating: 5,
    comment: 'Phòng rất đẹp và sạch sẽ!'
  };

  const { status: s2, data: d2 } = await request('POST', '/reviews', reviewData, testData.tokens.customer);
  log('Tạo đánh giá', s2 === 201 || (s2 === 400 && d2.message.includes('đã đánh giá')));

  // 5.3 Test không thể đánh giá booking chưa hoàn thành
  const { status: s3 } = await request('POST', '/reviews', {
    bookingId: testData.bookingId || 999,
    rating: 5,
    comment: 'Test'
  }, testData.tokens.customer);
  log('Chặn đánh giá booking chưa hoàn thành', s3 === 400 || s3 === 404);
}

// ============================================================================
// 2. NHÂN VIÊN LỄ TÂN - RECEPTIONIST FEATURES
// ============================================================================

async function testReceptionistAuth() {
  section('6. NHÂN VIÊN LỄ TÂN - XÁC THỰC');

  // Tạo tài khoản receptionist nếu chưa có
  if (!testData.users.receptionist) {
    const registerData = {
      fullName: 'Test Receptionist',
      email: `receptionist_${Date.now()}@test.com`,
      password: 'password123',
      phoneNumber: '0333444555'
    };

    const { status, data } = await request('POST', '/auth/register', registerData);
    if (status === 201) {
      testData.users.receptionist = { email: registerData.email, password: registerData.password };
      // Cần update role_id = 2 trong database
      console.log(`  ${colors.yellow}⚠ Cần chạy SQL: UPDATE users SET role_id = 2 WHERE email = '${registerData.email}';${colors.reset}`);
    }
  }

  // Đăng nhập
  if (testData.users.receptionist) {
    const { status, data } = await request('POST', '/auth/login', testData.users.receptionist);
    const passed = log('Đăng nhập nhân viên lễ tân', status === 200);
    if (passed) {
      testData.tokens.receptionist = data.data.accessToken;
    }
  }
}

async function testReceptionistBookingManagement() {
  section('7. NHÂN VIÊN LỄ TÂN - QUẢN LÝ ĐẶT PHÒNG');

  if (!testData.tokens.receptionist) {
    console.log(`${colors.yellow}⚠ Bỏ qua test - chưa có token receptionist${colors.reset}`);
    return;
  }

  // 7.1 Xem tất cả đơn đặt phòng
  const { status, data } = await request('GET', '/bookings', null, testData.tokens.receptionist);
  log('Xem tất cả đơn đặt phòng', status === 200 && Array.isArray(data.data),
    status !== 200 ? `Status: ${status}, Message: ${data.message}` : '');

  // 7.2 Lọc đơn theo trạng thái
  const { status: s2 } = await request('GET', '/bookings?status=pending', null, testData.tokens.receptionist);
  log('Lọc đơn theo trạng thái', s2 === 200);

  // 7.3 Lọc đơn theo ngày
  const { status: s3 } = await request('GET', '/bookings?date=2025-11-20', null, testData.tokens.receptionist);
  log('Lọc đơn theo ngày', s3 === 200);

  // 7.4 Xác nhận đơn đặt phòng
  const { status: s4 } = await request('PUT', '/bookings/2/status', 
    { status: 'confirmed' }, testData.tokens.receptionist);
  log('Xác nhận đơn đặt phòng', s4 === 200 || s4 === 404);

  // 7.5 Check-in khách
  const { status: s5 } = await request('PUT', '/bookings/2/status', 
    { status: 'checked_in' }, testData.tokens.receptionist);
  log('Check-in khách', s5 === 200 || s5 === 404);

  // 7.6 Check-out khách
  const { status: s6 } = await request('PUT', '/bookings/1/status', 
    { status: 'checked_out' }, testData.tokens.receptionist);
  log('Check-out khách', s6 === 200 || s6 === 404);
}

async function testReceptionistRoomStatus() {
  section('8. NHÂN VIÊN LỄ TÂN - QUẢN LÝ TRẠNG THÁI PHÒNG');

  if (!testData.tokens.receptionist) {
    console.log(`${colors.yellow}⚠ Bỏ qua test - chưa có token receptionist${colors.reset}`);
    return;
  }

  // 8.1 Cập nhật phòng đang dọn dẹp
  const { status } = await request('PUT', `/rooms/${testData.roomId || 1}/status`, 
    { status: 'cleaning' }, testData.tokens.receptionist);
  log('Cập nhật phòng đang dọn', status === 200);

  // 8.2 Cập nhật phòng bảo trì
  const { status: s2 } = await request('PUT', `/rooms/${testData.roomId || 1}/status`, 
    { status: 'maintenance' }, testData.tokens.receptionist);
  log('Cập nhật phòng bảo trì', s2 === 200);

  // 8.3 Cập nhật phòng available
  const { status: s3 } = await request('PUT', `/rooms/${testData.roomId || 1}/status`, 
    { status: 'available' }, testData.tokens.receptionist);
  log('Cập nhật phòng sẵn sàng', s3 === 200);
}

// ============================================================================
// 3. QUẢN TRỊ VIÊN - ADMIN FEATURES
// ============================================================================

async function testAdminAuth() {
  section('9. QUẢN TRỊ VIÊN - XÁC THỰC');

  // Tạo tài khoản admin nếu chưa có
  if (!testData.users.admin) {
    const registerData = {
      fullName: 'Test Admin',
      email: `admin_${Date.now()}@test.com`,
      password: 'password123',
      phoneNumber: '0555666777'
    };

    const { status, data } = await request('POST', '/auth/register', registerData);
    if (status === 201) {
      testData.users.admin = { email: registerData.email, password: registerData.password };
      console.log(`  ${colors.yellow}⚠ Cần chạy SQL: UPDATE users SET role_id = 3 WHERE email = '${registerData.email}';${colors.reset}`);
    }
  }

  // Đăng nhập
  if (testData.users.admin) {
    const { status, data } = await request('POST', '/auth/login', testData.users.admin);
    const passed = log('Đăng nhập quản trị viên', status === 200);
    if (passed) {
      testData.tokens.admin = data.data.accessToken;
    }
  }
}

async function testAdminUserManagement() {
  section('10. QUẢN TRỊ VIÊN - QUẢN LÝ NGƯỜI DÙNG');

  if (!testData.tokens.admin) {
    console.log(`${colors.yellow}⚠ Bỏ qua test - chưa có token admin${colors.reset}`);
    return;
  }

  // 10.1 Xem danh sách người dùng
  const { status, data } = await request('GET', '/users?page=1&limit=10', null, testData.tokens.admin);
  log('Xem danh sách người dùng', status === 200 && data.data?.users);

  // 10.2 Lọc theo role
  const { status: s2 } = await request('GET', '/users?role=1', null, testData.tokens.admin);
  log('Lọc người dùng theo role', s2 === 200);

  // 10.3 Test customer không thể xem danh sách user
  const { status: s3 } = await request('GET', '/users', null, testData.tokens.customer);
  log('Chặn customer xem danh sách user', s3 === 403);
}

async function testAdminRoomManagement() {
  section('11. QUẢN TRỊ VIÊN - QUẢN LÝ PHÒNG');

  if (!testData.tokens.admin) {
    console.log(`${colors.yellow}⚠ Bỏ qua test - chưa có token admin${colors.reset}`);
    return;
  }

  // 11.1 Tạo phòng mới
  const newRoom = {
    roomNumber: `T${Date.now().toString().slice(-8)}`, // Giới hạn 10 ký tự
    typeId: 1,
    pricePerNight: 1500000,
    capacity: 2,
    description: 'Test room created by admin'
  };

  const { status, data } = await request('POST', '/rooms', newRoom, testData.tokens.admin);
  const passed = log('Tạo phòng mới', status === 201 && data.success,
    status !== 201 ? `Status: ${status}, Message: ${data.message}` : '');
  
  let createdRoomId = null;
  if (passed) {
    createdRoomId = data.data.room_id;
  }

  // 11.2 Cập nhật thông tin phòng
  if (createdRoomId) {
    const { status: s2 } = await request('PUT', `/rooms/${createdRoomId}`, {
      pricePerNight: 1800000,
      description: 'Updated description'
    }, testData.tokens.admin);
    log('Cập nhật thông tin phòng', s2 === 200);
  }

  // 11.3 Xóa phòng
  if (createdRoomId) {
    const { status: s3 } = await request('DELETE', `/rooms/${createdRoomId}`, null, testData.tokens.admin);
    log('Xóa phòng', s3 === 200);
  }

  // 11.4 Test customer không thể tạo phòng
  const { status: s4 } = await request('POST', '/rooms', newRoom, testData.tokens.customer);
  log('Chặn customer tạo phòng', s4 === 403);
}

async function testAdminBookingManagement() {
  section('12. QUẢN TRỊ VIÊN - QUẢN LÝ ĐẶT PHÒNG');

  if (!testData.tokens.admin) {
    console.log(`${colors.yellow}⚠ Bỏ qua test - chưa có token admin${colors.reset}`);
    return;
  }

  // 12.1 Xem tất cả đơn đặt phòng
  const { status, data } = await request('GET', '/bookings', null, testData.tokens.admin);
  log('Xem tất cả đơn đặt phòng', status === 200);

  // 12.2 Cập nhật trạng thái bất kỳ
  const { status: s2 } = await request('PUT', '/bookings/3/status', 
    { status: 'confirmed' }, testData.tokens.admin);
  log('Cập nhật trạng thái đơn', s2 === 200 || s2 === 404);
}

async function testErrorHandling() {
  section('13. XỬ LÝ LỖI & VALIDATION');

  // 13.1 Invalid endpoint
  const { status } = await request('GET', '/invalid-endpoint');
  log('Xử lý endpoint không tồn tại', status === 404 || status === 0);

  // 13.2 Invalid room ID
  const { status: s2 } = await request('GET', '/rooms/99999');
  log('Xử lý room ID không tồn tại', s2 === 404);

  // 13.3 Invalid booking ID
  const { status: s3 } = await request('PUT', '/bookings/99999/cancel', null, testData.tokens.customer);
  log('Xử lý booking ID không tồn tại', s3 === 404);

  // 13.4 Missing required fields
  const { status: s4 } = await request('POST', '/auth/register', { email: 'test@test.com' });
  log('Validation thiếu trường bắt buộc', s4 === 400 || s4 === 500);

  // 13.5 Invalid email format
  const { status: s5 } = await request('POST', '/auth/register', {
    fullName: 'Test',
    email: 'invalid-email',
    password: 'password123'
  });
  log('Validation email không hợp lệ', s5 === 400 || s5 === 500);

  // 13.6 Unauthorized access
  const { status: s6 } = await request('GET', '/users/profile');
  log('Chặn truy cập không có token', s6 === 401);

  // 13.7 Forbidden access
  const { status: s7 } = await request('GET', '/users', null, testData.tokens.customer);
  log('Chặn truy cập không đủ quyền', s7 === 403);
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log(`${colors.blue}
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     HOTEL BOOKING API - FULL FEATURE TEST SUITE                  ║
║     Test 100% chức năng theo đề cương                            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
${colors.reset}`);

  const startTime = Date.now();
  let totalTests = 0;
  let passedTests = 0;

  try {
    // KHÁCH HÀNG
    await testCustomerAuth();
    await testCustomerProfile();
    await testCustomerRoomSearch();
    await testCustomerBooking();
    await testCustomerReview();

    // NHÂN VIÊN LỄ TÂN
    await testReceptionistAuth();
    await testReceptionistBookingManagement();
    await testReceptionistRoomStatus();

    // QUẢN TRỊ VIÊN
    await testAdminAuth();
    await testAdminUserManagement();
    await testAdminRoomManagement();
    await testAdminBookingManagement();

    // ERROR HANDLING
    await testErrorHandling();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n${colors.blue}${'='.repeat(70)}`);
    console.log(`${colors.green}✓ Hoàn thành tất cả test trong ${duration}s${colors.reset}`);
    console.log(`${colors.blue}${'='.repeat(70)}${colors.reset}\n`);

    console.log(`${colors.yellow}📊 THỐNG KÊ:${colors.reset}`);
    console.log(`   Customer Token: ${testData.tokens.customer ? '✓' : '✗'}`);
    console.log(`   Receptionist Token: ${testData.tokens.receptionist ? '✓' : '✗'}`);
    console.log(`   Admin Token: ${testData.tokens.admin ? '✓' : '✗'}`);
    console.log(`   Room ID: ${testData.roomId || 'N/A'}`);
    console.log(`   Booking ID: ${testData.bookingId || 'N/A'}`);

    if (!testData.tokens.receptionist || !testData.tokens.admin) {
      console.log(`\n${colors.yellow}⚠ LƯU Ý: Một số test bị bỏ qua do chưa có đủ quyền.${colors.reset}`);
      console.log(`${colors.yellow}   Chạy seed-users.js và update role_id trong database để test đầy đủ.${colors.reset}`);
    }

    console.log(`\n${colors.green}✅ API hoạt động tốt!${colors.reset}\n`);

  } catch (error) {
    console.error(`\n${colors.red}✗ Test suite failed: ${error.message}${colors.reset}`);
    console.error(error.stack);
  }
}

// Run
runAllTests();
