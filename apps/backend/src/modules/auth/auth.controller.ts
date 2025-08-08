import { Request, Response } from 'express';

import {
  LoginRequest,
  RegisterRequest,
  OAuthCallbackRequest,
} from './auth.types';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserRepository from '../../database/repository/user';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'authToken';
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  sameSite: 'lax' as const,
  httpOnly: true,
  path: '/',
};

export class AuthController {
  async register(req: Request<object, object, RegisterRequest>, res: Response) {
    try {
      const existingUser = await UserRepository.findByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(req.body.password, 12);
      const newUser = await UserRepository.create({
        passwordHash,
        role: req.body.role,
        email: req.body.email,
      });

      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET!);
      res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

      return res.status(201).json({
        success: true,
        user: {
          id: newUser.id,
          role: newUser.role,
          uuid: newUser.uuid,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
      });
    } catch {
      return res.status(500).json({
        error: 'Internal server error',
      });
    }
  }

  async login(req: Request<object, object, LoginRequest>, res: Response) {
    try {
      const user = await UserRepository.findByEmail(req.body.email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(
        req.body.password,
        user.passwordHash,
      );
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET!);
      res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

      return res.json({
        success: true,
        user: {
          id: user.id,
          uuid: user.uuid,
          email: user.email,
          role: user.role,
        },
      });
    } catch {
      return res.status(500).json({
        error: 'Internal server error',
      });
    }
  }

  async oauthCallback(
    req: Request<object, object, OAuthCallbackRequest>,
    res: Response,
  ) {
    try {
      let user = await UserRepository.findBySsoProviderAndId(
        req.body.provider,
        req.body.ssoId,
      );

      if (!user) {
        const existingUserByEmail = await UserRepository.findByEmail(
          req.body.email,
        );
        if (existingUserByEmail) {
          const updatedUser = await UserRepository.updateById(
            existingUserByEmail.id,
            {
              ssoProvider: req.body.provider,
              ssoId: req.body.ssoId,
            },
          );
          user = updatedUser;
        } else {
          user = await UserRepository.create({
            email: req.body.email,
            role: req.body.role,
            ssoProvider: req.body.provider,
            ssoId: req.body.ssoId,
          });
        }
      }

      if (!user) {
        return res
          .status(500)
          .json({ error: 'Failed to create or update user' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET!);
      res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

      return res.json({
        success: true,
        user: {
          id: user.id,
          uuid: user.uuid,
          email: user.email,
          role: user.role,
        },
      });
    } catch {
      return res.status(500).json({
        error: 'Internal server error',
      });
    }
  }

  async getMe(req: Request<object, object>, res: Response) {
    return res.json({
      success: true,
      user: req.user,
    });
  }

  async logout(req: Request<object, object>, res: Response) {
    res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
    res.json({ success: true });
  }
}
