Chắc chắn rồi. Dựa trên đề cương đã nêu (sử dụng **NodeJS/ExpressJS** và **MySQL**), đây là đề xuất chi tiết về bộ công nghệ và kiến trúc cho phần backend.

Lựa chọn **NodeJS** và **ExpressJS** là một lựa chọn rất phổ biến và mạnh mẽ để xây dựng API cho các ứng dụng web hiện đại.

### **Tại sao NodeJS/ExpressJS là lựa chọn tốt?**

*   **Hiệu năng cao:** NodeJS hoạt động dựa trên mô hình bất đồng bộ (asynchronous) và non-blocking I/O, rất phù hợp để xử lý nhiều yêu cầu đồng thời, ví dụ như nhiều khách hàng cùng lúc tìm và đặt phòng.
*   **Hệ sinh thái NPM khổng lồ:** Bạn có thể dễ dàng tìm và cài đặt các thư viện (packages) để giải quyết hầu hết mọi vấn đề: xác thực người dùng, kết nối cơ sở dữ liệu, xử lý hình ảnh, v.v.
*   **Chung một ngôn ngữ (JavaScript/TypeScript):** Nếu frontend dùng ReactJS, việc sử dụng NodeJS cho backend có nghĩa là bạn có thể sử dụng cùng một ngôn ngữ lập trình cho cả hai phía, giúp việc phát triển đồng bộ và dễ dàng hơn.
*   **Dễ học và phát triển nhanh:** ExpressJS là một framework tối giản, giúp bạn nhanh chóng xây dựng các API RESTful mà không bị ràng buộc bởi các cấu trúc phức tạp.

---

### **Đề xuất Bộ công nghệ Backend hoàn chỉnh (Backend Stack)**

Đây là một bộ công nghệ hoàn chỉnh và hiện đại để xây dựng backend cho dự án này.

| Hạng mục | Công nghệ đề xuất | Mục đích và Lý do lựa chọn |
| :--- | :--- | :--- |
| **Nền tảng** | **Node.js** | Môi trường chạy JavaScript phía máy chủ. |
| **Framework** | **Express.js** | Framework web tối giản, linh hoạt và mạnh mẽ để xây dựng API. Đây là lựa chọn đã có trong đề cương. |
| **Ngôn ngữ** | **TypeScript** | **(Rất khuyến khích)** Nâng cấp từ JavaScript, cung cấp kiểu dữ liệu tĩnh (static typing), giúp phát hiện lỗi sớm, tăng tính bảo mật và dễ dàng bảo trì code khi dự án lớn hơn. |
| **Kết nối CSDL (ORM)** | **Sequelize** hoặc **TypeORM** | - **ORM (Object-Relational Mapping)** giúp bạn tương tác với database (MySQL) bằng các đối tượng và phương thức của JavaScript/TypeScript thay vì viết các câu lệnh SQL thô, giúp code sạch sẽ và an toàn hơn.<br>- **Sequelize** rất phổ biến và có cộng đồng lớn.<br>- **TypeORM** tích hợp rất tốt với TypeScript. |
| **Xác thực & Phân quyền** | **JSON Web Tokens (JWT)** + **bcrypt.js** | - **bcrypt.js**: Dùng để mã hóa mật khẩu người dùng trước khi lưu vào database, đảm bảo an toàn.<br>- **JWT**: Sau khi người dùng đăng nhập thành công, backend sẽ tạo ra một token (JWT) và gửi về cho frontend. Frontend sẽ gửi kèm token này trong mỗi yêu cầu tiếp theo để xác thực danh tính. Rất phù hợp cho API stateless. |
| **Validation Dữ liệu** | **express-validator** hoặc **Zod** | Không bao giờ tin tưởng dữ liệu từ client. Các thư viện này giúp bạn kiểm tra và xác thực dữ liệu đầu vào (ví dụ: email có đúng định dạng, mật khẩu đủ mạnh, giá tiền phải là số) trước khi xử lý, ngăn chặn lỗi và các cuộc tấn công. |
| **Biến môi trường** | **dotenv** | Giúp quản lý các thông tin nhạy cảm (như mật khẩu database, khóa bí mật JWT) trong một file `.env` riêng biệt, không đưa trực tiếp vào code. |
| **Xử lý CORS** | **cors** | Middleware bắt buộc phải có. Vì frontend và backend chạy trên các port khác nhau, bạn cần `cors` để cho phép trình duyệt gửi yêu cầu từ frontend tới backend. |
| **Logging** | **Morgan** | Một middleware đơn giản để ghi lại (log) các yêu cầu HTTP đến server. Rất hữu ích trong quá trình phát triển và gỡ lỗi. |
| **Upload file** | **Multer** | Middleware để xử lý việc tải lên các file, ví dụ như hình ảnh cho phòng khách sạn. |

---

### **Kiến trúc Thư mục Đề xuất (Project Structure)**

Một cấu trúc thư mục được tổ chức tốt sẽ giúp dự án dễ dàng quản lý và mở rộng. Đây là một cấu trúc phổ biến và hiệu quả:

```
/project-backend
|-- /src
|   |-- /api
|   |   |-- /routes          // Định nghĩa các endpoints (VD: /users, /rooms)
|   |   |   |-- auth.route.ts
|   |   |   |-- user.route.ts
|   |   |   |-- room.route.ts
|   |   |   |-- booking.route.ts
|   |   |
|   |   |-- /controllers     // Xử lý logic request/response
|   |   |   |-- auth.controller.ts
|   |   |   |-- user.controller.ts
|   |   |
|   |   |-- /services        // Chứa logic nghiệp vụ chính (VD: tính toán giá tiền)
|   |   |   |-- booking.service.ts
|   |   |
|   |   |-- /middlewares     // Các hàm xử lý trung gian (VD: kiểm tra token, phân quyền)
|   |       |-- auth.middleware.ts
|   |
|   |-- /config              // Chứa các file cấu hình (database, biến môi trường)
|   |   |-- db.config.ts
|   |   |-- index.ts
|   |
|   |-- /models              // Định nghĩa schema cho database (sử dụng Sequelize/TypeORM)
|   |   |-- user.model.ts
|   |   |-- room.model.ts
|   |   |-- booking.model.ts
|   |
|   |-- /utils               // Các hàm tiện ích dùng chung
|       |-- logger.ts
|
|-- .env                     // File chứa biến môi trường (KHÔNG commit lên Git)
|-- .gitignore
|-- package.json
|-- tsconfig.json            // File cấu hình TypeScript
|-- server.ts                // File khởi tạo và chạy server Express
```

### **Luồng công việc đề xuất để bắt đầu**

1.  **Thiết lập dự án:** Cài đặt Node.js, khởi tạo dự án (`npm init`), cài đặt Express và TypeScript.
2.  **Kết nối Database:** Cấu hình Sequelize/TypeORM để kết nối đến cơ sở dữ liệu MySQL của bạn.
3.  **Xây dựng Models:** Dựa trên file SQL đã tạo, định nghĩa các model tương ứng (User, Room, Booking...) bằng Sequelize/TypeORM.
4.  **Xây dựng API xác thực:** Tạo các route và controller cho việc Đăng ký (`/register`), Đăng nhập (`/login`). Triển khai mã hóa mật khẩu với `bcrypt` và tạo token với `JWT`.
5.  **Xây dựng Middleware xác thực:** Tạo một middleware để kiểm tra JWT token trong header của các yêu cầu. Middleware này sẽ bảo vệ các API yêu cầu người dùng phải đăng nhập.
6.  **Triển khai các API CRUD:** Xây dựng các API còn lại cho việc quản lý Phòng, Đặt phòng, Người dùng... theo đúng các chức năng đã liệt kê trong đề cương.
7.  **Kiểm thử API:** Sử dụng các công cụ như **Postman** hoặc **Insomnia** để gửi yêu cầu và kiểm tra các API của bạn hoạt động đúng như mong đợi.

Bộ công nghệ này không chỉ phù hợp với đề cương mà còn là một stack hiện đại, mạnh mẽ và có khả năng mở rộng tốt cho dự án của bạn.

Tuyệt vời! Đây là một tài liệu đặc tả API (API Specification) chi tiết và chuyên nghiệp, được xây dựng dựa trên tất cả các thông tin bạn đã cung cấp. Đội ngũ backend có thể sử dụng tài liệu này như một "bản thiết kế" để xây dựng toàn bộ hệ thống API.

Tài liệu được trình bày theo chuẩn RESTful API, dễ đọc và dễ triển khai.

---

### **TÀI LIỆU ĐẶC TẢ API - WEBSITE ĐẶT PHÒNG KHÁCH SẠN**

**Version:** 1.0
**Ngày tạo:** 23/10/2023
**Người tạo:** Kim Ngọc Vinh (Dựa trên đề cương)

---

### **I. TỔNG QUAN**

#### **1. Base URL**

Tất cả các API sẽ có tiền tố là:
*   Môi trường phát triển: `http://localhost:8080/api/v1`
*   Môi trường production: `https://api.yourdomain.com/api/v1`

#### **2. Xác thực (Authentication)**

*   Hệ thống sử dụng **JSON Web Token (JWT)** để xác thực.
*   Sau khi đăng nhập thành công, API sẽ trả về một `accessToken`.
*   Đối với các yêu cầu cần xác thực, client phải gửi `accessToken` trong header: `Authorization: Bearer <your_token>`.

#### **3. Phân quyền (Authorization)**

Hệ thống có 3 vai trò chính, được kiểm tra thông qua middleware:

*   **Public:** Không cần đăng nhập.
*   **Customer:** Yêu cầu đăng nhập với vai trò `Khách hàng` (`role_id` = 1).
*   **Receptionist:** Yêu cầu đăng nhập với vai trò `Nhân viên lễ tân` (`role_id` = 2).
*   **Admin:** Yêu cầu đăng nhập với vai trò `Quản trị viên` (`role_id` = 3).

#### **4. Định dạng Response**

*   **Thành công (2xx):**

```json
{
  "success": true,
  "message": "Mô tả thành công",
  "data": { ... } // Dữ liệu trả về (object hoặc array)
}
```

*   **Thất bại (4xx, 5xx):**

```json
{
  "success": false,
  "message": "Mô tả lỗi",
  "error": "ERROR_CODE" // (Tùy chọn) Mã lỗi để frontend xử lý
}
```

---

### **II. DANH SÁCH API CHI TIẾT**

#### **Module 1: Xác thực (Auth)**
*   **Base Path:** `/auth`

**1.1. Đăng ký tài khoản**
*   **Endpoint:** `POST /register`
*   **Description:** Cho phép người dùng mới tạo tài khoản.
*   **Permission:** `Public`
*   **Request Body:**

```json
{
  "fullName": "Nguyễn Văn An",
  "email": "nguyen.van.an@email.com",
  "password": "password123",
  "phoneNumber": "0912345678"
}
```

*   **Success Response (201 Created):**

```json
{
  "success": true,
  "message": "Đăng ký tài khoản thành công!",
  "data": {
    "user": {
      "userId": 1,
      "fullName": "Nguyễn Văn An",
      "email": "nguyen.van.an@email.com",
      "role": "Khách hàng"
    },
    "accessToken": "your.jwt.token"
  }
}
```

**1.2. Đăng nhập**
*   **Endpoint:** `POST /login`
*   **Description:** Xác thực người dùng và trả về token.
*   **Permission:** `Public`
*   **Request Body:**

```json
{
  "email": "nguyen.van.an@email.com",
  "password": "password123"
}
```

*   **Success Response (200 OK):** (Tương tự response của API đăng ký)

---

#### **Module 2: Người dùng (Users)**
*   **Base Path:** `/users`

**2.1. Lấy thông tin cá nhân**
*   **Endpoint:** `GET /profile`
*   **Description:** Lấy thông tin của người dùng đang đăng nhập.
*   **Permission:** `Customer`, `Receptionist`, `Admin`
*   **Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Lấy thông tin thành công.",
  "data": {
    "userId": 1,
    "fullName": "Nguyễn Văn An",
    "email": "nguyen.van.an@email.com",
    "phoneNumber": "0912345678"
  }
}
```

**2.2. Cập nhật thông tin cá nhân**
*   **Endpoint:** `PUT /profile`
*   **Description:** Cập nhật thông tin của người dùng đang đăng nhập.
*   **Permission:** `Customer`, `Receptionist`, `Admin`
*   **Request Body:**

```json
{
  "fullName": "Nguyễn Văn An Mới",
  "phoneNumber": "0999888777"
}
```

*   **Success Response (200 OK):** (Trả về thông tin user đã cập nhật)

**2.3. Lấy danh sách người dùng (Admin)**
*   **Endpoint:** `GET /`
*   **Description:** Lấy danh sách tất cả người dùng. Hỗ trợ phân trang.
*   **Permission:** `Admin`
*   **Query Params:** `?page=1&limit=10&role=1`
*   **Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Lấy danh sách người dùng thành công.",
  "data": {
    "users": [ ... ],
    "pagination": {
      "currentPage": 1,
      "limit": 10,
      "totalItems": 100,
      "totalPages": 10
    }
  }
}
```

---

#### **Module 3: Phòng và Các loại phòng (Rooms & Room Types)**
*   **Base Path:** `/rooms`

**3.1. Tìm kiếm và Lấy danh sách phòng**
*   **Endpoint:** `GET /`
*   **Description:** Lấy danh sách phòng, có thể lọc theo phòng trống trong khoảng ngày, loại phòng, sức chứa.
*   **Permission:** `Public`
*   **Query Params:** `?checkIn=2025-12-24&checkOut=2025-12-26&capacity=2&roomType=1`
*   **Success Response (200 OK):** (Trả về danh sách các phòng thỏa mãn điều kiện)

**3.2. Lấy chi tiết phòng**
*   **Endpoint:** `GET /:id`
*   **Description:** Lấy thông tin chi tiết của một phòng, bao gồm hình ảnh và tiện nghi.
*   **Permission:** `Public`
*   **Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Lấy thông tin phòng thành công.",
  "data": {
    "roomId": 3,
    "roomNumber": "201",
    "pricePerNight": 1200000,
    "capacity": 2,
    "description": "Phòng Deluxe tầng 2, có ban công.",
    "roomType": { "typeName": "Deluxe" },
    "images": [ { "imageUrl": "/images/room-201-1.jpg" } ],
    "amenities": [ { "amenityName": "Wi-Fi miễn phí" }, ... ]
  }
}
```

**3.3. Quản lý phòng (Admin)**
*   `POST /` (Tạo phòng mới) - **Permission:** `Admin`
*   `PUT /:id` (Cập nhật thông tin phòng) - **Permission:** `Admin`
*   `DELETE /:id` (Xóa phòng) - **Permission:** `Admin`
*   `PUT /:id/status` (Cập nhật trạng thái phòng: cleaning, maintenance) - **Permission:** `Admin`, `Receptionist`

**3.4. Quản lý loại phòng và tiện nghi (Admin)**
*   `GET /types` - `POST /types` - `PUT /types/:id` - `DELETE /types/:id`
*   `GET /amenities` - `POST /amenities` - `PUT /amenities/:id` - `DELETE /amenities/:id`

---

#### **Module 4: Đặt phòng (Bookings)**
*   **Base Path:** `/bookings`

**4.1. Tạo đơn đặt phòng**
*   **Endpoint:** `POST /`
*   **Description:** Khách hàng tạo một đơn đặt phòng mới.
*   **Permission:** `Customer`
*   **Request Body:**

```json
{
  "roomId": 1,
  "checkInDate": "2025-12-24",
  "checkOutDate": "2025-12-26",
  "numberOfGuests": 2
  // "promoCode": "WELCOME10" (Tùy chọn)
}
```
*   **Backend Logic:** Phải kiểm tra phòng có trống trong khoảng ngày đó không trước khi tạo. Tính toán `total_price` dựa trên số đêm và giá phòng.
*   **Success Response (201 Created):** (Trả về chi tiết đơn đặt phòng đã tạo)

**4.2. Lấy lịch sử đặt phòng của tôi**
*   **Endpoint:** `GET /my-bookings`
*   **Description:** Lấy danh sách các đơn đặt phòng của người dùng đang đăng nhập.
*   **Permission:** `Customer`
*   **Success Response (200 OK):** (Trả về mảng các đơn đặt phòng)

**4.3. Hủy đơn đặt phòng**
*   **Endpoint:** `PUT /:id/cancel`
*   **Description:** Cho phép khách hàng hủy đơn đặt phòng của họ.
*   **Permission:** `Customer`
*   **Backend Logic:** Chỉ cho phép hủy khi trạng thái là `pending` hoặc `confirmed`.
*   **Success Response (200 OK):** (Trả về đơn đặt phòng với trạng thái đã cập nhật)

**4.4. Lấy danh sách tất cả đơn đặt phòng (Admin/Receptionist)**
*   **Endpoint:** `GET /`
*   **Description:** Lấy danh sách tất cả các đơn đặt phòng trong hệ thống, có thể lọc.
*   **Permission:** `Admin`, `Receptionist`
*   **Query Params:** `?status=pending&date=2025-11-20`

**4.5. Cập nhật trạng thái đơn đặt phòng (Admin/Receptionist)**
*   **Endpoint:** `PUT /:id/status`
*   **Description:** Cập nhật trạng thái đơn đặt phòng (VD: từ `pending` sang `confirmed`, `checked_in`, `checked_out`).
*   **Permission:** `Admin`, `Receptionist`
*   **Request Body:**

```json
{
  "status": "confirmed"
}
```

---

#### **Module 5: Đánh giá (Reviews)**
*   **Base Path:** `/reviews`

**5.1. Tạo đánh giá**
*   **Endpoint:** `POST /`
*   **Description:** Cho phép khách hàng viết đánh giá cho một đơn đặt phòng đã hoàn thành.
*   **Permission:** `Customer`
*   **Backend Logic:** Phải kiểm tra xem người dùng đã hoàn thành (`checked_out`) đơn đặt phòng này chưa.
*   **Request Body:**

```json
{
  "bookingId": 1,
  "rating": 5,
  "comment": "Dịch vụ rất tuyệt vời!"
}
```

**5.2. Lấy danh sách đánh giá của một phòng**
*   **Endpoint:** `GET /room/:roomId`
*   **Description:** Lấy tất cả đánh giá của một phòng cụ thể.
*   **Permission:** `Public`

---

#### **Module 6: Bảng điều khiển Quản trị (Admin Dashboard)**
*   **Base Path:** `/admin`

**6.1. Thống kê tổng quan**
*   **Endpoint:** `GET /stats`
*   **Description:** Lấy các số liệu thống kê quan trọng.
*   **Permission:** `Admin`
*   **Query Params:** `?startDate=2025-11-01&endDate=2025-11-30`
*   **Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Lấy dữ liệu thống kê thành công.",
  "data": {
    "totalRevenue": 50000000,
    "totalBookings": 150,
    "occupancyRate": 75.5, // Tỷ lệ lấp đầy
    "newCustomers": 20
  }
}
```

**6.2. Quản lý Khuyến mãi**
*   **Base Path:** `/promotions`
*   **Permission:** `Admin`
*   **Endpoints:**
    *   `POST /`: Tạo mã khuyến mãi mới.
    *   `GET /`: Lấy danh sách mã khuyến mãi.
    *   `PUT /:id`: Cập nhật mã khuyến mãi.
    *   `DELETE /:id`: Xóa mã khuyến mãi.

---
**Kết thúc tài liệu.**