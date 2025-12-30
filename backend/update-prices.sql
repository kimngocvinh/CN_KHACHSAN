-- Cập nhật giá phòng cho phù hợp với thị trường khách sạn hiện nay

UPDATE rooms SET price_per_night = 500000.00 WHERE room_id = 1; -- Standard 101: 500K
UPDATE rooms SET price_per_night = 550000.00 WHERE room_id = 2; -- Standard 102: 550K
UPDATE rooms SET price_per_night = 900000.00 WHERE room_id = 3; -- Deluxe 201: 900K
UPDATE rooms SET price_per_night = 1200000.00 WHERE room_id = 4; -- Deluxe 202 (view biển): 1.2M
UPDATE rooms SET price_per_night = 2000000.00 WHERE room_id = 5; -- Suite 301: 2M
UPDATE rooms SET price_per_night = 1500000.00 WHERE room_id = 6; -- Family 401: 1.5M
