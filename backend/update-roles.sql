-- Update roles cho các user
-- Chạy script này để cập nhật role cho lễ tân và admin

USE hotel_booking_db;

-- Update receptionist role
UPDATE users 
SET role_id = 2 
WHERE email = 'letan@hotel.com';

-- Update admin role
UPDATE users 
SET role_id = 3 
WHERE email = 'admin@hotel.com';

-- Verify
SELECT user_id, full_name, email, role_id, 
       CASE role_id 
           WHEN 1 THEN 'Khách hàng'
           WHEN 2 THEN 'Nhân viên lễ tân'
           WHEN 3 THEN 'Quản trị viên'
       END as role_name
FROM users
WHERE email IN ('customer@hotel.com', 'letan@hotel.com', 'admin@hotel.com')
ORDER BY role_id;
