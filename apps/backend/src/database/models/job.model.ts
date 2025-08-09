import {
  pgTable,
  serial,
  integer,
  uuid,
  varchar,
  timestamp,
  index,
  json,
} from 'drizzle-orm/pg-core';
import { employers } from './employer.model';

export const jobs = pgTable(
  'jobs',
  {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').notNull().defaultRandom().unique(),
    employerId: integer('employer_id')
      .notNull()
      .references(() => employers.userId),
    title: varchar('title', { length: 255 }).notNull(),
    description: json('description').notNull(),
    location: varchar('location', { length: 255 }),
    status: varchar('status', { length: 20 }).notNull().default('active'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    employerIdx: index('jobs_employer_id_idx').on(table.employerId),
    statusIdx: index('jobs_status_idx').on(table.status),
    locationIdx: index('jobs_location_idx').on(table.location),
    createdAtIdx: index('jobs_created_at_idx').on(table.createdAt),
    statusCreatedAtIdx: index('jobs_status_created_at_idx').on(
      table.status,
      table.createdAt,
    ),
    employerStatusIdx: index('jobs_employer_id_status_idx').on(
      table.employerId,
      table.status,
    ),
  }),
);

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
