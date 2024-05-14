import { Router } from 'express';
import { authenticateToken, checkUserRole } from '../middlewares/authMiddleware';
import { viewAttendanceById, viewAttendances, viewPunchIn, viewPunchOut } from '../controllers/attendanceController';
import { RoleType } from '@prisma/client';

const router = Router();

router.post('/employee/punch-in', authenticateToken, checkUserRole(RoleType.MANAGER, RoleType.EMPLOYEE), viewPunchIn)
router.post('/employee/punch-out', authenticateToken, checkUserRole(RoleType.MANAGER, RoleType.EMPLOYEE), viewPunchOut)

router.get('/employee/attendances', authenticateToken, checkUserRole(RoleType.MANAGER, RoleType.EMPLOYEE), viewAttendances)
router.get('/employee/attendance/:id', authenticateToken, checkUserRole(RoleType.MANAGER, RoleType.EMPLOYEE), viewAttendanceById)  


export default router;
