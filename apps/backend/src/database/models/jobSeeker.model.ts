import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
  uuid,
  index,
} from 'drizzle-orm/pg-core';
import { users } from './user.model';

export const jobSeekers = pgTable(
  'job_seekers',
  {
    userId: integer('user_id')
      .primaryKey()
      .references(() => users.id),
    uuid: uuid('uuid').notNull().defaultRandom().unique(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    address: text('address'),
    resumeUrl: text('resume_url'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    fullNameIdx: index('job_seekers_full_name_idx').on(table.fullName),
    emailIdx: index('job_seekers_email_idx').on(table.email),
    createdAtIdx: index('job_seekers_created_at_idx').on(table.createdAt),
  }),
);

export type JobSeeker = typeof jobSeekers.$inferSelect;
export type NewJobSeeker = typeof jobSeekers.$inferInsert;
