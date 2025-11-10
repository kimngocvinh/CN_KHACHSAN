-- Update roles cho các user test
-- Chạy script này sau khi chạy seed-users.js

USE hotel_booking_db;

-- Update receptionist role
UPDATE users 
SET role_id = 2 
WHERE email LIKE 'receptionist%@test.com' 
AND role_id = 1;

-- Update admin role
UPDATE users 
SET role_id = 3 
WHERE email LIKE 'admin%@test.com' 
AND role_id = 1;

-- Verify
SELECT user_id, full_name, email, role_id, 
       CASE role_id 
           WHEN 1 THEN 'Khách hàng'
           WHEN 2 THEN 'Nhân viên lễ tân'
           WHEN 3 THEN 'Quản trị viên'
       END as role_name
FROM users
WHERE email LIKE '%@test.com'
ORDER BY role_id, created_at DESC;
