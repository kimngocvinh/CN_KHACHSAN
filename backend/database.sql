-- SQL SCRIPT FOR HOTEL BOOKING WEBSITE DATABASE
-- Based on the project proposal by Kim Ngoc Vinh (110122202)

-- =================================================================
-- DATABASE CREATION
-- =================================================================

DROP DATABASE IF EXISTS `hotel_booking_db`;
CREATE DATABASE `hotel_booking_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hotel_booking_db`;

-- =================================================================
-- TABLE STRUCTURES
-- =================================================================

-- Table 1: Roles (Phân quyền người dùng)
-- Stores different user roles like Customer, Receptionist, Admin.
CREATE TABLE `roles` (
  `role_id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_name` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Tên quyền: Khách hàng, Nhân viên, Quản trị viên'
) ENGINE=InnoDB;

-- Table 2: Users (Người dùng)
-- Stores information about all users, including customers, receptionists, and admins.
CREATE TABLE `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL COMMENT 'Họ và tên',
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã được mã hóa',
  `phone_number` VARCHAR(20) NULL,
  `role_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`)
) ENGINE=InnoDB;

-- Table 3: Room Types (Loại phòng)
-- Defines different categories of rooms (e.g., Standard, Deluxe, Suite).
CREATE TABLE `room_types` (
  `room_type_id` INT AUTO_INCREMENT PRIMARY KEY,
  `type_name` VARCHAR(100) NOT NULL COMMENT 'Tên loại phòng',
  `description` TEXT NULL COMMENT 'Mô tả chi tiết về loại phòng'
) ENGINE=InnoDB;

-- Table 4: Rooms (Phòng)
-- Stores details about individual rooms.
CREATE TABLE `rooms` (
  `room_id` INT AUTO_INCREMENT PRIMARY KEY,
  `room_number` VARCHAR(10) NOT NULL UNIQUE COMMENT 'Số phòng',
  `room_type_id` INT NOT NULL,
  `price_per_night` DECIMAL(10, 2) NOT NULL COMMENT 'Giá mỗi đêm',
  `capacity` INT NOT NULL COMMENT 'Số người tối đa',
  `status` ENUM('available', 'occupied', 'cleaning', 'maintenance') NOT NULL DEFAULT 'available' COMMENT 'Trạng thái: trống, đã có khách, đang dọn, bảo trì',
  `description` TEXT NULL,
  FOREIGN KEY (`room_type_id`) REFERENCES `room_types`(`room_type_id`)
) ENGINE=InnoDB;

-- Table 5: Room Images (Hình ảnh phòng)
CREATE TABLE `room_images` (
    `image_id` INT AUTO_INCREMENT PRIMARY KEY,
    `room_id` INT NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `is_primary` BOOLEAN DEFAULT FALSE COMMENT 'Ảnh đại diện cho phòng',
    FOREIGN KEY (`room_id`) REFERENCES `rooms`(`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 6: Amenities (Tiện nghi)
-- Lists all possible amenities.
CREATE TABLE `amenities` (
  `amenity_id` INT AUTO_INCREMENT PRIMARY KEY,
  `amenity_name` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Tên tiện nghi (Wi-Fi, TV, etc.)'
) ENGINE=InnoDB;

-- Table 7: Room Amenities (Bảng nối tiện nghi và phòng)
-- Many-to-many relationship between rooms and amenities.
CREATE TABLE `room_amenities` (
  `room_id` INT NOT NULL,
  `amenity_id` INT NOT NULL,
  PRIMARY KEY (`room_id`, `amenity_id`),
  FOREIGN KEY (`room_id`) REFERENCES `rooms`(`room_id`) ON DELETE CASCADE,
  FOREIGN KEY (`amenity_id`) REFERENCES `amenities`(`amenity_id`) ON DELETE CASCADE
) ENGINE=InnoDB;


-- Table 8: Bookings (Đặt phòng)
-- Stores booking information made by customers.
CREATE TABLE `bookings` (
  `booking_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL COMMENT 'Khách hàng đặt phòng',
  `room_id` INT NOT NULL,
  `check_in_date` DATE NOT NULL,
  `check_out_date` DATE NOT NULL,
  `number_of_guests` INT NOT NULL,
  `total_price` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT 'Trạng thái đặt phòng',
  `booking_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL,
  FOREIGN KEY (`room_id`) REFERENCES `rooms`(`room_id`)
) ENGINE=InnoDB;

-- Table 9: Payments (Thanh toán)
-- Tracks payments for each booking.
CREATE TABLE `payments` (
  `payment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_id` INT NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `payment_method` ENUM('cash', 'credit_card', 'online_banking') NOT NULL COMMENT 'Hình thức thanh toán: tại quầy, thẻ, trực tuyến',
  `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`booking_id`)
) ENGINE=InnoDB;

-- Table 10: Reviews (Đánh giá)
-- Stores customer reviews for rooms and services.
CREATE TABLE `reviews` (
  `review_id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_id` INT NOT NULL UNIQUE COMMENT 'Mỗi booking chỉ có 1 review',
  `user_id` INT NOT NULL,
  `room_id` INT NOT NULL,
  `rating` TINYINT NOT NULL CHECK (`rating` BETWEEN 1 AND 5) COMMENT 'Điểm đánh giá từ 1-5',
  `comment` TEXT NULL,
  `review_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`booking_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`),
  FOREIGN KEY (`room_id`) REFERENCES `rooms`(`room_id`)
) ENGINE=InnoDB;

-- Table 11: Promotions (Khuyến mãi)
-- Stores promotional codes and discounts.
CREATE TABLE `promotions` (
  `promotion_id` INT AUTO_INCREMENT PRIMARY KEY,
  `promo_code` VARCHAR(50) NOT NULL UNIQUE,
  `discount_percentage` DECIMAL(5, 2) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;


-- =================================================================
-- SAMPLE DATA INSERTION
-- =================================================================

-- 1. Insert Roles
INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'Khách hàng'),
(2, 'Nhân viên lễ tân'),
(3, 'Quản trị viên');

-- 2. Insert Users
-- Password for all is 'password123', hashed using BCRYPT.
-- For real applications, generate hashes dynamically.
-- Hash: $2b$10$E.V35X5mBeGdeSCF9gWkIeP8L92.a0G.1kH.AEH.v4/YMh3DCE94W
INSERT INTO `users` (`user_id`, `full_name`, `email`, `password_hash`, `phone_number`, `role_id`) VALUES
(1, 'Nguyễn Văn An', 'nguyen.van.an@email.com', '$2b$10$E.V35X5mBeGdeSCF9gWkIeP8L92.a0G.1kH.AEH.v4/YMh3DCE94W', '0912345678', 1),
(2, 'Trần Thị Bích', 'tran.thi.bich@email.com', '$2b$10$E.V35X5mBeGdeSCF9gWkIeP8L92.a0G.1kH.AEH.v4/YMh3DCE94W', '0987654321', 1),
(3, 'Lê Minh Tuấn', 'le.minh.tuan@reception.com', '$2b$10$E.V35X5mBeGdeSCF9gWkIeP8L92.a0G.1kH.AEH.v4/YMh3DCE94W', '0333444555', 2),
(4, 'Trầm Hoàng Nam', 'tram.hoang.nam@admin.com', '$2b$10$E.V35X5mBeGdeSCF9gWkIeP8L92.a0G.1kH.AEH.v4/YMh3DCE94W', '0555666777', 3);

-- 3. Insert Room Types
INSERT INTO `room_types` (`room_type_id`, `type_name`, `description`) VALUES
(1, 'Standard', 'Phòng tiêu chuẩn với các tiện nghi cơ bản.'),
(2, 'Deluxe', 'Phòng cao cấp hơn với không gian rộng và tầm nhìn đẹp.'),
(3, 'Suite', 'Phòng hạng sang có phòng khách riêng biệt.'),
(4, 'Family', 'Phòng gia đình rộng rãi, có thể ở được nhiều người.');

-- 4. Insert Amenities
INSERT INTO `amenities` (`amenity_name`) VALUES
('Wi-Fi miễn phí'), ('TV màn hình phẳng'), ('Điều hòa nhiệt độ'), ('Tủ lạnh mini'), ('Bồn tắm'), ('View hướng biển'), ('Bàn làm việc');

-- 5. Insert Rooms
INSERT INTO `rooms` (`room_number`, `room_type_id`, `price_per_night`, `capacity`, `status`, `description`) VALUES
('101', 1, 500000.00, 2, 'available', 'Phòng Standard tầng 1, view vườn.'),
('102', 1, 550000.00, 2, 'cleaning', 'Phòng Standard tầng 1, gần sảnh.'),
('201', 2, 900000.00, 2, 'available', 'Phòng Deluxe tầng 2, có ban công.'),
('202', 2, 1200000.00, 2, 'occupied', 'Phòng Deluxe tầng 2, view biển tuyệt đẹp.'),
('301', 3, 2000000.00, 4, 'available', 'Phòng Suite tầng 3, có phòng khách và bếp nhỏ.'),
('401', 4, 1500000.00, 5, 'maintenance', 'Phòng gia đình lớn, đang bảo trì hệ thống điều hòa.');

-- 6. Insert Room Images
INSERT INTO `room_images` (`room_id`, `image_url`, `is_primary`) VALUES
(1, '/images/room-101-1.jpg', TRUE),
(1, '/images/room-101-2.jpg', FALSE),
(2, '/images/room-102-1.jpg', TRUE),
(3, '/images/room-201-1.jpg', TRUE),
(3, '/images/room-201-2.jpg', FALSE),
(3, '/images/room-201-3.jpg', FALSE),
(4, '/images/room-202-1.jpg', TRUE),
(5, '/images/room-301-1.jpg', TRUE);

-- 7. Insert Room Amenities
INSERT INTO `room_amenities` (`room_id`, `amenity_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), -- Room 101
(2, 1), (2, 2), (2, 3), -- Room 102
(3, 1), (3, 2), (3, 3), (3, 4), (3, 7), -- Room 201
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), -- Room 202
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6), (5, 7); -- Room 301

-- 8. Insert Bookings
-- Booking in the past, checked out
INSERT INTO `bookings` (`user_id`, `room_id`, `check_in_date`, `check_out_date`, `number_of_guests`, `total_price`, `status`) VALUES
(1, 3, '2025-10-15', '2025-10-18', 2, 3600000.00, 'checked_out');

-- Current booking, checked in
INSERT INTO `bookings` (`user_id`, `room_id`, `check_in_date`, `check_out_date`, `number_of_guests`, `total_price`, `status`) VALUES
(2, 4, '2025-11-20', '2025-11-22', 2, 3000000.00, 'checked_in');

-- Future booking, confirmed
INSERT INTO `bookings` (`user_id`, `room_id`, `check_in_date`, `check_out_date`, `number_of_guests`, `total_price`, `status`) VALUES
(1, 1, '2025-12-24', '2025-12-26', 2, 1600000.00, 'confirmed');

-- Future booking, pending
INSERT INTO `bookings` (`user_id`, `room_id`, `check_in_date`, `check_out_date`, `number_of_guests`, `total_price`, `status`) VALUES
(2, 5, '2026-01-10', '2026-01-15', 3, 12500000.00, 'pending');

-- Cancelled booking
INSERT INTO `bookings` (`user_id`, `room_id`, `check_in_date`, `check_out_date`, `number_of_guests`, `total_price`, `status`) VALUES
(1, 5, '2025-11-25', '2025-11-27', 2, 5000000.00, 'cancelled');

-- 9. Insert Payments
INSERT INTO `payments` (`booking_id`, `amount`, `payment_method`, `status`) VALUES
(1, 3600000.00, 'credit_card', 'completed'), -- For checked-out booking
(2, 1500000.00, 'cash', 'completed'), -- Deposit for checked-in booking
(3, 1600000.00, 'online_banking', 'completed'), -- Full payment for confirmed booking
(4, 2500000.00, 'online_banking', 'pending'); -- Deposit for pending booking

-- 10. Insert Reviews
-- Review for the first booking that is 'checked_out'
INSERT INTO `reviews` (`booking_id`, `user_id`, `room_id`, `rating`, `comment`) VALUES
(1, 1, 3, 5, 'Phòng rất đẹp và sạch sẽ, view ban công tuyệt vời. Nhân viên thân thiện. Chắc chắn sẽ quay lại!');

-- 11. Insert Promotions
INSERT INTO `promotions` (`promo_code`, `discount_percentage`, `start_date`, `end_date`, `is_active`) VALUES
('WELCOME10', 10.00, '2025-01-01', '2025-12-31', TRUE),
('SUMMER20', 20.00, '2025-06-01', '2025-08-31', TRUE),
('BLACKFRIDAY', 30.00, '2025-11-20', '2025-11-30', FALSE);

-- =================================================================
-- END OF SCRIPT
-- =================================================================