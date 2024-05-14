import { Router } from 'express';
import { authenticateToken, checkUserRole } from '../middlewares/authMiddleware';
import { RoleType } from '@prisma/client';
import { viewCreateDevice } from '../controllers/deviceController';

const router = Router();

router.post('/device', viewCreateDevice);

export default router;