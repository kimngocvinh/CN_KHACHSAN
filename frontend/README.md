# Hotel Booking Frontend

Frontend application cho hệ thống đặt phòng khách sạn, xây dựng với React + TypeScript + Vite + shadcn/ui.

## 🚀 Tính năng

### Khách hàng (Customer)
- ✅ Đăng ký, đăng nhập
- ✅ Tìm kiếm phòng với bộ lọc (ngày, số người, loại phòng)
- ✅ Xem chi tiết phòng
- ✅ Đặt phòng trực tuyến
- ✅ Xem lịch sử đặt phòng
- ✅ Hủy đặt phòng
- ✅ Đánh giá phòng
- ✅ Quản lý thông tin cá nhân

### Nhân viên lễ tân / Admin
- ✅ Dashboard với thống kê
- ✅ Quản lý phòng (CRUD)
- ✅ Cập nhật trạng thái phòng
- ✅ Quản lý đặt phòng
- ✅ Xác nhận, check-in, check-out
- ✅ Quản lý người dùng
- ✅ Xem đánh giá

## 🛠 Công nghệ

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **shadcn/ui** - UI Components
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Zustand** - State Management
- **React Hook Form** - Form Management
- **Axios** - HTTP Client
- **Lucide React** - Icons

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## 🔧 Cấu hình

Tạo file `.env` với nội dung:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

## 📁 Cấu trúc thư mục

```
frontend/
├── src/
│   ├── api/              # API configuration
│   │   └── axios.ts
│   ├── components/       # Reusable components
│   │   └── ui/          # shadcn/ui components
│   ├── layouts/         # Layout components
│   │   ├── MainLayout.tsx
│   │   └── AdminLayout.tsx
│   ├── pages/           # Page components
│   │   ├── auth/        # Authentication pages
│   │   ├── rooms/       # Room pages
│   │   ├── customer/    # Customer pages
│   │   └── admin/       # Admin pages
│   ├── store/           # State management
│   │   └── authStore.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── lib/             # Utilities
│   │   └── utils.ts
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── components.json      # shadcn/ui config
└── package.json
```

## 🎨 UI Components

Ứng dụng sử dụng shadcn/ui components:
- Button, Input, Label
- Card, Badge, Avatar
- Dialog, Select, Textarea
- Table, Dropdown Menu
- Calendar, Form

## 🔐 Authentication

- JWT token được lưu trong localStorage
- Axios interceptor tự động thêm token vào headers
- Protected routes kiểm tra authentication
- Auto redirect khi token hết hạn

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Adaptive navigation
- Touch-friendly UI

## 🚀 Deployment

```bash
# Build production
npm run build

# Output sẽ ở thư mục dist/
# Deploy dist/ lên hosting (Vercel, Netlify, etc.)
```

## 📝 API Integration

Tất cả API calls đều thông qua `src/api/axios.ts`:

```typescript
import api from '@/api/axios';

// GET request
const response = await api.get('/rooms');

// POST request
const response = await api.post('/bookings', data);

// PUT request
const response = await api.put('/users/profile', data);
```

## 🎯 Features Checklist

### ✅ Hoàn thành 100%

**Khách hàng:**
- [x] Đăng ký, đăng nhập, đăng xuất
- [x] Tìm kiếm phòng với filters
- [x] Xem chi tiết phòng
- [x] Đặt phòng
- [x] Xem lịch sử đặt phòng
- [x] Hủy đặt phòng
- [x] Đánh giá phòng
- [x] Cập nhật profile

**Admin/Receptionist:**
- [x] Dashboard
- [x] Quản lý phòng (CRUD)
- [x] Cập nhật trạng thái phòng
- [x] Quản lý đặt phòng
- [x] Xác nhận/Check-in/Check-out
- [x] Quản lý người dùng

## 🔗 Backend Integration

Frontend này được thiết kế để hoạt động với backend API tại:
`http://localhost:8080/api/v1`

Xem backend documentation tại: `../README.md`

## 👥 Contributors

- Kim Ngọc Vinh (110122202)

---

**Status:** ✅ Production Ready
**Version:** 1.0.0
**Last Updated:** 2024-11-10
