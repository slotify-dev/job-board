import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './user.model';

export const jobSeekers = pgTable('job_seekers', {
  userId: integer('user_id')
    .primaryKey()
    .references(() => users.id),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  contactInfo: text('contact_info'),
  resumeUrl: text('resume_url'),
  // Add other job seeker specific fields
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type JobSeeker = typeof jobSeekers.$inferSelect;
export type NewJobSeeker = typeof jobSeekers.$inferInsert;
