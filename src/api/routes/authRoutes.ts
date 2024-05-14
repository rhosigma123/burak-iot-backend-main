import { Router } from 'express';
import { viewRegisterEmployee, viewLogin } from '../controllers/authController';
import multer from 'multer'
import { fileStorage } from '../middlewares/uploadMedia';
import { imageFilter } from '../../utils/imageFilter';
import { authenticateToken, checkUserRole } from '../middlewares/authMiddleware';
import { RoleType } from '@prisma/client';
import { viewEmployeeProfile } from '../controllers/employeeController';

const router = Router();

const maxSize = 0.5 * 1024 * 1024
const uploadImage = multer({ storage: fileStorage, fileFilter: imageFilter, limits: { fileSize: maxSize } });

var registrationUpload = uploadImage.fields([ { name: 'profilePic', maxCount: 1 }])

router.post('/employee/register', authenticateToken, registrationUpload, checkUserRole('MANAGER'), viewRegisterEmployee);

router.post('/login', viewLogin);

router.get('/profile', authenticateToken, checkUserRole(RoleType.MANAGER, RoleType.EMPLOYEE), viewEmployeeProfile)

export default router;
