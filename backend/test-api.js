/**
 * Script test toàn bộ API của Hotel Booking System
 * Chạy: node test-api.js
 */

const BASE_URL = 'http://localhost:8080/api/v1';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test data storage
const testData = {
  customerToken: '',
  receptionistToken: '',
  adminToken: '',
  customerId: 0,
  roomId: 0,
  bookingId: 0,
  reviewId: 0
};

// Helper function to make HTTP requests
async function request(method, endpoint, data = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

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

// Test result logger
function logTest(testName, passed, message = '') {
  const icon = passed ? '✓' : '✗';
  const color = passed ? colors.green : colors.red;
  console.log(`${color}${icon} ${testName}${colors.reset}${message ? ': ' + message : ''}`);
}

function logSection(title) {
  console.log(`\n${colors.cyan}${'='.repeat(60)}`);
  console.log(`${title}`);
  console.log(`${'='.repeat(60)}${colors.reset}\n`);
}

// Test functions
async function testHealthCheck() {
  logSection('1. HEALTH CHECK');
  const { status, data } = await request('GET', '/../../');
  logTest('Server is running', status === 200, data?.message);
}

async function testAuthRegister() {
  logSection('2. AUTHENTICATION - REGISTER');

  // Test register customer
  const customerData = {
    fullName: 'Test Customer',
    email: `customer_${Date.now()}@test.com`,
    password: 'password123',
    phoneNumber: '0912345678'
  };

  const { status, data } = await request('POST', '/auth/register', customerData);
  const passed = status === 201 && data.success;
  
  if (passed) {
    testData.customerToken = data.data.accessToken;
    testData.customerId = data.data.user.userId;
  }

  logTest('Register customer account', passed, data.message);

  // Test duplicate email
  const { status: status2, data: data2 } = await request('POST', '/auth/register', customerData);
  logTest('Prevent duplicate email', status2 === 400, data2.message);
}

async function testAuthLogin() {
  logSection('3. AUTHENTICATION - LOGIN');

  // Login with sample data from database
  const loginData = {
    email: 'nguyen.van.an@email.com',
    password: 'password123'
  };

  const { status, data } = await request('POST', '/auth/login', loginData);
  const passed = status === 200 && data.success;

  if (passed) {
    testData.customerToken = data.data.accessToken;
  }

  logTest('Login with valid credentials', passed, data.message);

  // Test invalid credentials
  const { status: status2, data: data2 } = await request('POST', '/auth/login', {
    email: 'wrong@email.com',
    password: 'wrongpassword'
  });
  logTest('Reject invalid credentials', status2 === 401, data2.message);

  // Login as receptionist
  const { status: status3, data: data3 } = await request('POST', '/auth/login', {
    email: 'le.minh.tuan@reception.com',
    password: 'password123'
  });
  if (status3 === 200) {
    testData.receptionistToken = data3.data.accessToken;
  }
  logTest('Login as receptionist', status3 === 200);

  // Login as admin
  const { status: status4, data: data4 } = await request('POST', '/auth/login', {
    email: 'tram.hoang.nam@admin.com',
    password: 'password123'
  });
  if (status4 === 200) {
    testData.adminToken = data4.data.accessToken;
  }
  logTest('Login as admin', status4 === 200);
}

async function testUserProfile() {
  logSection('4. USER PROFILE');

  // Get profile
  const { status, data } = await request('GET', '/users/profile', null, testData.customerToken);
  logTest('Get user profile', status === 200 && data.success, data.data?.fullName);

  // Update profile
  const updateData = {
    fullName: 'Updated Name',
    phoneNumber: '0999888777'
  };
  const { status: status2, data: data2 } = await request('PUT', '/users/profile', updateData, testData.customerToken);
  logTest('Update user profile', status2 === 200 && data2.success);

  // Test without token
  const { status: status3 } = await request('GET', '/users/profile');
  logTest('Reject request without token', status3 === 401);
}

async function testRooms() {
  logSection('5. ROOMS');

  // Get all rooms
  const { status, data } = await request('GET', '/rooms');
  const passed = status === 200 && Array.isArray(data.data);
  
  if (passed && data.data.length > 0) {
    testData.roomId = data.data[0].room_id;
  }

  logTest('Get all rooms', passed, `Found ${data.data?.length || 0} rooms`);

  // Get room by ID
  if (testData.roomId) {
    const { status: status2, data: data2 } = await request('GET', `/rooms/${testData.roomId}`);
    logTest('Get room by ID', status2 === 200 && data2.success, data2.data?.room_number);
  }

  // Search rooms with filters
  const { status: status3, data: data3 } = await request('GET', '/rooms?capacity=2&checkIn=2025-12-24&checkOut=2025-12-26');
  logTest('Search rooms with filters', status3 === 200, `Found ${data3.data?.length || 0} available rooms`);

  // Create room (Admin only)
  const newRoom = {
    roomNumber: `TEST${Date.now()}`,
    typeId: 1,
    pricePerNight: 1000000,
    capacity: 2,
    description: 'Test room'
  };
  const { status: status4, data: data4 } = await request('POST', '/rooms', newRoom, testData.adminToken);
  logTest('Create room (Admin)', status4 === 201 && data4.success);

  // Test create room without admin token
  const { status: status5 } = await request('POST', '/rooms', newRoom, testData.customerToken);
  logTest('Prevent non-admin from creating room', status5 === 403);
}

async function testBookings() {
  logSection('6. BOOKINGS');

  // Create booking
  const bookingData = {
    roomId: testData.roomId || 1,
    checkInDate: '2025-12-24',
    checkOutDate: '2025-12-26',
    numberOfGuests: 2
  };

  const { status, data } = await request('POST', '/bookings', bookingData, testData.customerToken);
  const passed = status === 201 && data.success;

  if (passed) {
    testData.bookingId = data.data.booking_id;
  }

  logTest('Create booking', passed, `Total: ${data.data?.total_price || 0} VND`);

  // Get my bookings
  const { status: status2, data: data2 } = await request('GET', '/bookings/my-bookings', null, testData.customerToken);
  logTest('Get my bookings', status2 === 200 && Array.isArray(data2.data), `Found ${data2.data?.length || 0} bookings`);

  // Get all bookings (Admin/Receptionist)
  const { status: status3, data: data3 } = await request('GET', '/bookings', null, testData.adminToken);
  logTest('Get all bookings (Admin)', status3 === 200 && Array.isArray(data3.data));

  // Test booking without authentication
  const { status: status4 } = await request('POST', '/bookings', bookingData);
  logTest('Prevent booking without authentication', status4 === 401);

  // Update booking status (Admin)
  if (testData.bookingId) {
    const { status: status5, data: data5 } = await request('PUT', `/bookings/${testData.bookingId}/status`, 
      { status: 'confirmed' }, testData.adminToken);
    logTest('Update booking status (Admin)', status5 === 200 && data5.success);
  }

  // Cancel booking
  if (testData.bookingId) {
    const { status: status6, data: data6 } = await request('PUT', `/bookings/${testData.bookingId}/cancel`, 
      null, testData.customerToken);
    logTest('Cancel booking', status6 === 200 && data6.success);
  }
}

async function testReviews() {
  logSection('7. REVIEWS');

  // Get reviews for a room
  const { status, data } = await request('GET', `/reviews/room/${testData.roomId || 3}`);
  logTest('Get reviews for room', status === 200 && Array.isArray(data.data), `Found ${data.data?.length || 0} reviews`);

  // Create review (requires checked_out booking)
  const reviewData = {
    bookingId: 1, // Using sample booking from database
    rating: 5,
    comment: 'Excellent service and clean room!'
  };

  const { status: status2, data: data2 } = await request('POST', '/reviews', reviewData, testData.customerToken);
  logTest('Create review', status2 === 201 || status2 === 400, data2.message);
}

async function testAdminFeatures() {
  logSection('8. ADMIN FEATURES');

  // Get all users (Admin only)
  const { status, data } = await request('GET', '/users?page=1&limit=10', null, testData.adminToken);
  logTest('Get all users (Admin)', status === 200 && data.success, `Total: ${data.data?.pagination?.totalItems || 0} users`);

  // Test non-admin access
  const { status: status2 } = await request('GET', '/users', null, testData.customerToken);
  logTest('Prevent non-admin from accessing user list', status2 === 403);

  // Update room status
  if (testData.roomId) {
    const { status: status3, data: data3 } = await request('PUT', `/rooms/${testData.roomId}/status`, 
      { status: 'cleaning' }, testData.receptionistToken);
    logTest('Update room status (Receptionist)', status3 === 200 && data3.success);
  }
}

async function testErrorHandling() {
  logSection('9. ERROR HANDLING');

  // Test invalid endpoint
  const { status } = await request('GET', '/invalid-endpoint');
  logTest('Handle invalid endpoint', status === 404 || status === 0);

  // Test invalid room ID
  const { status: status2 } = await request('GET', '/rooms/99999');
  logTest('Handle invalid room ID', status2 === 404);

  // Test invalid booking ID
  const { status: status3 } = await request('PUT', '/bookings/99999/cancel', null, testData.customerToken);
  logTest('Handle invalid booking ID', status3 === 404);

  // Test malformed request
  const { status: status4 } = await request('POST', '/auth/register', { email: 'invalid' }, null);
  logTest('Handle malformed request', status4 === 400 || status4 === 500);
}

// Main test runner
async function runAllTests() {
  console.log(`${colors.blue}
╔════════════════════════════════════════════════════════════╗
║         HOTEL BOOKING API - FULL TEST SUITE               ║
║                                                            ║
║  Testing all endpoints and features...                    ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

  const startTime = Date.now();

  try {
    await testHealthCheck();
    await testAuthRegister();
    await testAuthLogin();
    await testUserProfile();
    await testRooms();
    await testBookings();
    await testReviews();
    await testAdminFeatures();
    await testErrorHandling();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n${colors.blue}${'='.repeat(60)}`);
    console.log(`${colors.green}✓ All tests completed in ${duration}s${colors.reset}`);
    console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}\n`);

    console.log(`${colors.yellow}Test Data Summary:${colors.reset}`);
    console.log(`- Customer Token: ${testData.customerToken ? 'Generated ✓' : 'Failed ✗'}`);
    console.log(`- Admin Token: ${testData.adminToken ? 'Generated ✓' : 'Failed ✗'}`);
    console.log(`- Room ID: ${testData.roomId || 'N/A'}`);
    console.log(`- Booking ID: ${testData.bookingId || 'N/A'}`);

  } catch (error) {
    console.error(`\n${colors.red}✗ Test suite failed: ${error.message}${colors.reset}`);
    console.error(error.stack);
  }
}

// Run tests
runAllTests();
