import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserRepository from '../database/repository/user';
import { authConfig } from '../config';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      role: string;
      uuid: string;
      email: string;
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
    const token = req.cookies?.[authConfig.cookieName];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const payload = jwt.verify(token, authConfig.jwtSecret) as {
      userId: number;
    };
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
      role: user.role,
      uuid: user.uuid,
      email: user.email,
      createdAt: user.createdAt,
    };

    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
}
