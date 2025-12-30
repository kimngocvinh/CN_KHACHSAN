# HƯỚNG DẪN KHỞI ĐỘNG HỆ THỐNG

## Cách 1: Sử dụng Script Tự Động (KHUYÊN DÙNG)

### Windows PowerShell
```powershell
cd E:\KHACHSAN
.\start-all.ps1
```

Script sẽ tự động:
- Dừng các process cũ
- Khởi động Backend (port 8080)
- Khởi động Frontend (port 5173)
- Mở trình duyệt tự động

---

## Cách 2: Khởi Động Thủ Công

### Bước 1: Khởi động Backend
Mở terminal mới:
```powershell
cd E:\KHACHSAN\backend
npm run dev
```

### Bước 2: Khởi động Frontend
Mở terminal mới khác:
```powershell
cd E:\KHACHSAN\frontend
npm run dev
```

### Bước 3: Truy cập
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

---

## Tài Khoản Đăng Nhập

### Lễ Tân
- Email: `letan@hotel.com`
- Mật khẩu: `123456`

### Quản Trị Viên
- Email: `admin@hotel.com`
- Mật khẩu: `123456`

### Khách Hàng
- Email: `customer@hotel.com`
- Mật khẩu: `123456`

---

## Khắc Phục Lỗi

### Lỗi: "Không thể kết nối Backend"
1. Kiểm tra Backend đang chạy: http://localhost:8080
2. Đợi 5 giây để Backend khởi động hoàn tất
3. Refresh lại trang (Ctrl + R)

### Lỗi: "Port đã được sử dụng"
```powershell
# Dừng tất cả process Node.js
Stop-Process -Name node -Force
```

### Lỗi: Frontend không hiển thị
1. Xóa cache trình duyệt (Ctrl + Shift + R)
2. Kiểm tra Console (F12) để xem lỗi cụ thể

---

## Lưu Ý Quan Trọng

⚠️ **KHI CHỈNH SỬA CODE:**
- Backend sẽ tự động restart (mất ~3-5 giây)
- Frontend sẽ tự động hot reload
- **KHÔNG CẦN** dừng và chạy lại server
- Nếu gặp lỗi kết nối, đợi 5 giây rồi refresh (F5)

⚠️ **HỆ THỐNG SẼ TỰ ĐỘNG RETRY:**
- Nếu Backend đang restart, Frontend sẽ tự động thử kết nối lại
- Timeout: 30 giây
- Retry delay: 2 giây

---

## Scripts Hữu Ích

### Cập nhật giá phòng
```powershell
cd E:\KHACHSAN\backend
node update-room-prices.js
```

### Cập nhật hình ảnh phòng
```powershell
cd E:\KHACHSAN\backend
node update-room-images.js
```

### Tạo tài khoản mẫu
```powershell
cd E:\KHACHSAN\backend
node seed-users.js
```

---

## Cấu Trúc Dự Án

```
E:\KHACHSAN\
├── backend/          # Backend API (Node.js + Express + MySQL)
│   ├── src/          # Source code
│   └── database.sql  # Database schema
├── frontend/         # Frontend (React + Vite + TypeScript)
│   └── src/          # Source code
└── start-all.ps1     # Script khởi động tự động
```

---

## Thông Tin Kỹ Thuật

- **Backend**: Node.js, Express, TypeScript, Sequelize, MySQL
- **Frontend**: React, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Database**: MySQL 8.0
- **Authentication**: JWT
- **API**: RESTful API

---

**Người phát triển**: Kim Ngoc Vinh (110122202)
**Dự án**: Hệ thống quản lý khách sạn
