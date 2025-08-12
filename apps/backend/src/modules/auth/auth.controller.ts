import { Request, Response } from 'express';
import { authConfig } from '../../config';

import {
  LoginRequest,
  RegisterRequest,
  OAuthCallbackRequest,
  OAuthSignInRequest,
  ProviderParams,
} from './auth.types';

import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import UserRepository from '../../database/repository/user';
import EmployerRepository from '../../database/repository/employer';
import JobSeekerRepository from '../../database/repository/jobSeekers';

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

      // Auto-create employer profile if user is an employer
      if (req.body.role === 'employer') {
        await EmployerRepository.create({
          userId: newUser.id,
          companyName: `${req.body.firstName} ${req.body.lastName}'s Company`,
          contactPerson: `${req.body.firstName} ${req.body.lastName}`,
          companyWebsite: null,
        });
      } else if (req.body.role === 'job_seeker') {
        // Auto-create job seeker profile
        await JobSeekerRepository.create({
          userId: newUser.id,
          fullName: `${req.body.firstName} ${req.body.lastName}`,
          email: req.body.email,
          phone: null,
          address: null,
          resumeUrl: null,
        });
      }

      const token = jwt.sign({ userId: newUser.id }, authConfig.jwtSecret, {
        expiresIn: authConfig.jwtExpiresIn,
      } as SignOptions);
      res.cookie(authConfig.cookieName, token, authConfig.cookieOptions);

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

      const token = jwt.sign({ userId: user.id }, authConfig.jwtSecret, {
        expiresIn: authConfig.jwtExpiresIn,
      } as SignOptions);
      res.cookie(authConfig.cookieName, token, authConfig.cookieOptions);

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

          // Auto-create employer profile if user is an employer (OAuth signup)
          if (req.body.role === 'employer') {
            await EmployerRepository.create({
              userId: user.id,
              companyName: `${req.body.email?.split('@')[0] || 'Company'}'s Company`,
              contactPerson: req.body.email?.split('@')[0] || 'Contact',
              companyWebsite: null,
            });
          }
        }
      }

      if (!user) {
        return res
          .status(500)
          .json({ error: 'Failed to create or update user' });
      }

      const token = jwt.sign({ userId: user.id }, authConfig.jwtSecret, {
        expiresIn: authConfig.jwtExpiresIn,
      } as SignOptions);
      res.cookie(authConfig.cookieName, token, authConfig.cookieOptions);

      return res.json({
        success: true,
        user: {
          id: user.id,
          role: user.role,
          uuid: user.uuid,
          email: user.email,
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

  async oauthSignIn(
    req: Request<ProviderParams, object, OAuthSignInRequest>,
    res: Response,
  ) {
    try {
      const provider = req.params.provider;
      const { providerId, email, name, role } = req.body;

      // Check if user exists by provider ID
      let user = await UserRepository.findBySsoProviderAndId(
        provider,
        providerId,
      );

      if (!user) {
        // Check if user exists by email
        const existingUserByEmail = await UserRepository.findByEmail(email);

        if (existingUserByEmail) {
          // Link OAuth account to existing user
          user = await UserRepository.updateById(existingUserByEmail.id, {
            ssoProvider: provider,
            ssoId: providerId,
          });
        } else {
          // Create new user with OAuth account
          user = await UserRepository.create({
            email,
            role,
            ssoProvider: provider,
            ssoId: providerId,
          });

          if (!user) {
            return res
              .status(500)
              .json({ error: 'Failed to create user account' });
          }

          // Create profile for the user based on role
          if (role === 'employer') {
            await EmployerRepository.create({
              userId: user.id,
              companyName: name || 'Unknown Company',
              contactPerson: name || 'Unknown Person',
              companyWebsite: null,
            });
          } else {
            await JobSeekerRepository.create({
              userId: user.id,
              fullName: name || 'Unknown Name',
              email,
              phone: null,
              address: null,
              resumeUrl: null,
            });
          }
        }
      }

      if (!user) {
        return res
          .status(500)
          .json({ error: 'Failed to create or update user' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, authConfig.jwtSecret, {
        expiresIn: authConfig.jwtExpiresIn,
      } as SignOptions);

      // Set authentication cookie
      res.cookie(authConfig.cookieName, token, authConfig.cookieOptions);

      return res.json({
        success: true,
        user: {
          id: user.id,
          role: user.role,
          uuid: user.uuid,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(
        `OAuth sign-in error for provider ${req.params.provider}:`,
        error,
      );
      return res.status(500).json({
        error: 'Internal server error',
      });
    }
  }

  async logout(req: Request<object, object>, res: Response) {
    res.clearCookie(authConfig.cookieName, authConfig.cookieOptions);
    res.json({ success: true });
  }
}
