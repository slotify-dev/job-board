import { env } from './env';

export const authConfig = {
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: '7d', // 7 days
  refreshTokenExpiresIn: '30d', // 30 days
  cookieName: 'authToken',
  refreshCookieName: 'refreshToken',
  cookieOptions: {
    secure: env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax' as const,
    httpOnly: true,
    path: '/',
  },
  refreshCookieOptions: {
    secure: env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: 'lax' as const,
    httpOnly: true,
    path: '/api/auth',
  },
};
