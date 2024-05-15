import { Router } from 'express';
import { authenticateToken, checkUserRole } from '../middlewares/authMiddleware';
import { viewDeleteOfficer, viewOfficerById, viewOfficers, viewUpdateOfficer } from '../controllers/officerController';
import { RoleType } from '@prisma/client';
import { viewManagerDashboard } from '../controllers/managerController';

const router = Router();
router.get('/manager/dashboard', authenticateToken, checkUserRole(RoleType.MANAGER), viewManagerDashboard);
router.put('/manager/update-officer', authenticateToken, checkUserRole(RoleType.MANAGER), viewUpdateOfficer);
router.get('/manager/officers', authenticateToken, checkUserRole(RoleType.MANAGER), viewOfficers);
router.get('/manager/officer/:id', authenticateToken, checkUserRole(RoleType.MANAGER), viewOfficerById);
router.delete('/manager/delete-officer/:id', authenticateToken, checkUserRole(RoleType.MANAGER), viewDeleteOfficer)


export default router;