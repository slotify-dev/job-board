import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash'),
  role: varchar('role', { length: 20 }).notNull().default('job_seeker'), // 'job_seeker' | 'employer' | 'admin'
  ssoProvider: varchar('sso_provider', { length: 50 }), // 'google', 'github', etc.
  ssoId: varchar('sso_id', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
