import { Router } from 'express';
import { authenticateToken, checkUserRole } from '../middlewares/authMiddleware';
import { RoleType } from '@prisma/client';

const router = Router();



export default router;
