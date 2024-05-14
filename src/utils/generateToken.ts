import jwt from 'jsonwebtoken';
import { JWTSECRET } from '../config';
import { RoleType } from '@prisma/client';

export const generateToken = (userId: number, userRole: RoleType ): string => {
  return jwt.sign({ userId, userRole }, JWTSECRET, { expiresIn: '24h' });
};
