import { env } from './env';

export const authConfig = {
  jwtSecret: env.JWT_SECRET,
  cookieName: 'authToken',
  cookieOptions: {
    secure: env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax' as const,
    httpOnly: true,
    path: '/',
  },
};
