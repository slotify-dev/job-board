import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserRepository from '../database/repository/user';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'authToken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      uuid: string;
      email: string;
      role: string;
      createdAt: Date;
    };
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const payload = jwt.verify(token, JWT_SECRET!) as { userId: number };
    if (!payload || !payload.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await UserRepository.findById(payload.userId);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    req.user = {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
}
