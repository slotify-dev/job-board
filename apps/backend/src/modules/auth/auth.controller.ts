import { Request, Response } from 'express';
import { authConfig } from '../../config';

import {
  LoginRequest,
  RegisterRequest,
  OAuthCallbackRequest,
  OAuthSignInRequest,
  ProviderParams,
  RoleSelectionRequest,
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
        roleConfirmed: true,
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
          // Create user without role if not provided - user will need to select role later
          user = await UserRepository.create({
            email: req.body.email,
            role: req.body.role || 'job_seeker', // Default to job_seeker if no role provided
            roleConfirmed: !!req.body.role, // Only confirmed if role was provided
            ssoProvider: req.body.provider,
            ssoId: req.body.ssoId,
          });

          // Only auto-create profile if role was explicitly provided
          if (req.body.role === 'employer') {
            await EmployerRepository.create({
              userId: user.id,
              companyName: `${req.body.email?.split('@')[0] || 'Company'}'s Company`,
              contactPerson: req.body.email?.split('@')[0] || 'Contact',
              companyWebsite: null,
            });
          } else if (req.body.role === 'job_seeker') {
            await JobSeekerRepository.create({
              userId: user.id,
              fullName: req.body.email?.split('@')[0] || 'Unknown Name',
              email: req.body.email,
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
          roleConfirmed: user.roleConfirmed,
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
            role: role || 'job_seeker', // Default to job_seeker if no role provided
            roleConfirmed: !!role, // Only confirmed if role was provided
            ssoProvider: provider,
            ssoId: providerId,
          });

          if (!user) {
            return res
              .status(500)
              .json({ error: 'Failed to create user account' });
          }

          // Only create profile if role was explicitly provided
          if (role === 'employer') {
            await EmployerRepository.create({
              userId: user.id,
              companyName: name || 'Unknown Company',
              contactPerson: name || 'Unknown Person',
              companyWebsite: null,
            });
          } else if (role === 'job_seeker') {
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
          roleConfirmed: user.roleConfirmed,
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

  async selectRole(
    req: Request<object, object, RoleSelectionRequest>,
    res: Response,
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { role } = req.body;
      const user = await UserRepository.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update user role and mark as confirmed
      const updatedUser = await UserRepository.updateById(userId, {
        role,
        roleConfirmed: true,
      });

      if (!updatedUser) {
        return res.status(500).json({ error: 'Failed to update user role' });
      }

      // Create appropriate profile based on selected role
      if (role === 'employer') {
        // Check if employer profile already exists
        const existingEmployer = await EmployerRepository.findByUserId(userId);
        if (!existingEmployer) {
          await EmployerRepository.create({
            userId: userId,
            companyName: `${user.email?.split('@')[0] || 'Company'}'s Company`,
            contactPerson: user.email?.split('@')[0] || 'Contact',
            companyWebsite: null,
          });
        }
      } else if (role === 'job_seeker') {
        // Check if job seeker profile already exists
        const existingJobSeeker =
          await JobSeekerRepository.findByUserId(userId);
        if (!existingJobSeeker) {
          await JobSeekerRepository.create({
            userId: userId,
            fullName: user.email?.split('@')[0] || 'Unknown Name',
            email: user.email,
            phone: null,
            address: null,
            resumeUrl: null,
          });
        }
      }

      return res.json({
        success: true,
        user: {
          id: updatedUser.id,
          role: updatedUser.role,
          uuid: updatedUser.uuid,
          email: updatedUser.email,
        },
      });
    } catch (error) {
      console.error('Role selection error:', error);
      return res.status(500).json({
        error: 'Internal server error',
      });
    }
  }

  async googleCallback(
    req: Request<object, object, { code: string; role?: string }>,
    res: Response,
  ) {
    try {
      const { code, role } = req.body;

      if (!code) {
        return res
          .status(400)
          .json({ error: 'Authorization code is required' });
      }

      // Get the origin from the request to construct the redirect URI dynamically
      const origin =
        req.get('origin') ||
        req.get('referer')?.replace(/\/.*$/, '') ||
        'http://localhost:5173';
      const redirectUri = `${origin}/auth/google/callback`;

      // Exchange code for access token with Google
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error('Google token exchange error:', error);
        return res
          .status(400)
          .json({ error: 'Failed to exchange authorization code' });
      }

      const tokenData = await tokenResponse.json();

      // Get user info from Google
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`,
      );

      if (!userInfoResponse.ok) {
        return res
          .status(400)
          .json({ error: 'Failed to get user information' });
      }

      const userInfo = await userInfoResponse.json();

      // Check if user exists
      let user = await UserRepository.findBySsoProviderAndId(
        'google',
        userInfo.id,
      );

      if (!user) {
        // Check if user exists by email
        const existingUserByEmail = await UserRepository.findByEmail(
          userInfo.email,
        );

        if (existingUserByEmail) {
          // Link Google account to existing user
          user = await UserRepository.updateById(existingUserByEmail.id, {
            ssoProvider: 'google',
            ssoId: userInfo.id,
          });
        } else {
          // Create new user
          user = await UserRepository.create({
            email: userInfo.email,
            role: role || 'job_seeker',
            roleConfirmed: !!role, // Only confirmed if role was provided
            ssoProvider: 'google',
            ssoId: userInfo.id,
          });

          if (!user) {
            return res
              .status(500)
              .json({ error: 'Failed to create user account' });
          }

          // Create profile if role was provided
          if (role === 'employer') {
            await EmployerRepository.create({
              userId: user.id,
              companyName: userInfo.name || 'Unknown Company',
              contactPerson: userInfo.name || 'Unknown Person',
              companyWebsite: null,
            });
          } else if (role === 'job_seeker') {
            await JobSeekerRepository.create({
              userId: user.id,
              fullName: userInfo.name || 'Unknown Name',
              email: userInfo.email,
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
          roleConfirmed: user.roleConfirmed,
        },
      });
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async logout(req: Request<object, object>, res: Response) {
    res.clearCookie(authConfig.cookieName, authConfig.cookieOptions);
    res.json({ success: true });
  }
}
