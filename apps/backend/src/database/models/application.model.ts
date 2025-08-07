import {
  pgTable,
  serial,
  integer,
  text,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';
import { jobs } from './job.model';
import { jobSeekers } from './jobSeeker.model';

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id')
    .notNull()
    .references(() => jobs.id),
  jobSeekerId: integer('job_seeker_id')
    .notNull()
    .references(() => jobSeekers.userId),
  resumeUrl: text('resume_url').notNull(),
  coverLetter: text('cover_letter'),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending' | 'reviewed' | 'rejected' | 'accepted'
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
