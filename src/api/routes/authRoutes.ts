import { Router } from 'express';
import { viewRegisterOfficer, viewLogin, viewRegisterManager } from '../controllers/authController';
import multer from 'multer'
import { fileStorage } from '../middlewares/uploadMedia';
import { imageFilter } from '../../utils/imageFilter';
import { authenticateToken, checkUserRole } from '../middlewares/authMiddleware';
import { RoleType } from '@prisma/client';
import { viewOfficerProfile } from '../controllers/officerController';
import { viewManagerProfile } from '../controllers/managerController';

const router = Router();

const maxSize = 0.5 * 1024 * 1024
const uploadImage = multer({ storage: fileStorage, fileFilter: imageFilter, limits: { fileSize: maxSize } });

var registrationUpload = uploadImage.fields([ { name: 'profilePic', maxCount: 1 }, { name: 'logo', maxCount: 1 } ])

router.post('/manager/register', registrationUpload, viewRegisterManager);
router.get('/manager/profile', authenticateToken, checkUserRole(RoleType.MANAGER), viewManagerProfile)

router.post('/officer/register', authenticateToken, registrationUpload, checkUserRole('MANAGER'), viewRegisterOfficer);
router.get('/officer/profile', authenticateToken, checkUserRole(RoleType.MANAGER, RoleType.OFFICER), viewOfficerProfile)

router.post('/login', viewLogin);


export default router;
