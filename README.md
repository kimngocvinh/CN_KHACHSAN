# Hotel Booking System

Hệ thống quản lý đặt phòng khách sạn với React, TypeScript, Node.js, Express và MySQL.

## Tính năng

- 🔐 Đăng nhập/Đăng ký với JWT authentication
- 👥 3 loại người dùng: Admin, Lễ tân, Khách hàng
- 🏨 Quản lý phòng (CRUD)
- 📅 Quản lý đặt phòng
- 👤 Quản lý người dùng
- ⭐ Đánh giá phòng
- 📊 Dashboard thống kê

## Công nghệ sử dụng

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Zustand (State management)
- Tailwind CSS
- shadcn/ui components

### Backend
- Node.js
- Express
- TypeScript
- Sequelize ORM
- MySQL
- JWT Authentication
- bcryptjs

## Cài đặt

### Yêu cầu
- Node.js >= 16
- MySQL >= 8.0

### 1. Clone repository
```bash
git clone <repository-url>
cd KHACHSAN
```

### 2. Cài đặt Backend
```bash
cd backend
npm install
```

Tạo file `.env` từ `.env.example` và cập nhật thông tin:
```bash
cp .env.example .env
```

Chạy file `database.sql` để tạo database và tables.

### 3. Cài đặt Frontend
```bash
cd frontend
npm install
```

### 4. Chạy ứng dụng

**Backend:**
```bash
cd backend
npm run dev
```
Server chạy tại: http://localhost:8080

**Frontend:**
```bash
cd frontend
npm run dev
```
Website chạy tại: http://localhost:5173

## Tài khoản mặc định

Chạy script để tạo tài khoản mẫu:
```bash
cd backend
node seed-users.js
```

- **Admin**: admin@hotel.com / 123456
- **Lễ tân**: letan@hotel.com / 123456
- **Khách hàng**: customer@hotel.com / 123456

## Phân quyền

### Admin (role_id: 3)
- Quản lý phòng (thêm/sửa/xóa)
- Quản lý đặt phòng
- Quản lý người dùng
- Xem thống kê

### Lễ tân (role_id: 2)
- Cập nhật trạng thái phòng
- Quản lý đặt phòng
- Xem danh sách phòng

### Khách hàng (role_id: 1)
- Xem và tìm kiếm phòng
- Đặt phòng
- Xem lịch sử đặt phòng
- Đánh giá phòng

## API Endpoints

### Authentication
- POST `/api/v1/auth/register` - Đăng ký
- POST `/api/v1/auth/login` - Đăng nhập

### Rooms
- GET `/api/v1/rooms` - Lấy danh sách phòng
- GET `/api/v1/rooms/:id` - Lấy chi tiết phòng
- POST `/api/v1/rooms` - Tạo phòng mới (Admin)
- PUT `/api/v1/rooms/:id` - Cập nhật phòng (Admin)
- DELETE `/api/v1/rooms/:id` - Xóa phòng (Admin)

### Bookings
- GET `/api/v1/bookings` - Lấy danh sách đặt phòng
- POST `/api/v1/bookings` - Tạo đặt phòng mới
- PUT `/api/v1/bookings/:id` - Cập nhật đặt phòng
- DELETE `/api/v1/bookings/:id` - Hủy đặt phòng

### Users
- GET `/api/v1/users` - Lấy danh sách người dùng (Admin)
- GET `/api/v1/users/:id` - Lấy thông tin người dùng
- PUT `/api/v1/users/:id` - Cập nhật thông tin
- DELETE `/api/v1/users/:id` - Xóa người dùng (Admin)

## License

MIT
