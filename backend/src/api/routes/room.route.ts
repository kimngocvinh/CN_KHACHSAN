import { Router } from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomStatus,
  addRoomImage,
  deleteRoomImage,
  getRoomImages,
  getRoomBookedDates
} from '../controllers/room.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { uploadRoomImage } from '../middlewares/upload.middleware';

const router = Router();

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.get('/:id/booked-dates', getRoomBookedDates);
router.post('/', authenticate, authorize(3), createRoom);
router.put('/:id', authenticate, authorize(3), updateRoom);
router.delete('/:id', authenticate, authorize(3), deleteRoom);
router.put('/:id/status', authenticate, authorize(2, 3), updateRoomStatus);

// Room images
router.get('/:id/images', getRoomImages);
router.post('/:id/images', authenticate, authorize(3), uploadRoomImage.single('image'), addRoomImage);
router.delete('/:id/images/:imageId', authenticate, authorize(3), deleteRoomImage);

export default router;
