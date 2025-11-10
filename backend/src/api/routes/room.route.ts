import { Router } from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomStatus
} from '../controllers/room.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', authenticate, authorize(3), createRoom);
router.put('/:id', authenticate, authorize(3), updateRoom);
router.delete('/:id', authenticate, authorize(3), deleteRoom);
router.put('/:id/status', authenticate, authorize(2, 3), updateRoomStatus);

export default router;
