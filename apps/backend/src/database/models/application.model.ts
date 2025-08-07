import {
  pgTable,
  serial,
  integer,
  uuid,
  text,
  varchar,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { jobs } from './job.model';
import { jobSeekers } from './jobSeeker.model';

export const applications = pgTable(
  'applications',
  {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').notNull().defaultRandom().unique(),
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
  },
  (table) => ({
    jobIdx: index('applications_job_id_idx').on(table.jobId),
    jobSeekerIdx: index('applications_job_seeker_id_idx').on(table.jobSeekerId),
    statusIdx: index('applications_status_idx').on(table.status),
    createdAtIdx: index('applications_created_at_idx').on(table.createdAt),
  }),
);

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
