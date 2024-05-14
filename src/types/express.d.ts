import { User } from '@prisma/client'; // Or your own User type

declare global {
  namespace Express {
    interface Request {
      user?: User | jwt.JwtPayload; // Adjust the type based on your payload structure
    }
  }
}
