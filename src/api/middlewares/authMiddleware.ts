import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTSECRET } from '../../config';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] ?? '';
  jwt.verify(token, JWTSECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user; // Type assertion here
    next();
  });
};


// Define a middleware function to check user roles
export const checkUserRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
      const userRole = (req as any).user.userRole; 
      if (allowedRoles.includes(userRole)) {
          next();
      } else {
          res.sendStatus(403);
      }
  };
};