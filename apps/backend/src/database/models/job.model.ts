import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { employers } from './employer.model';

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  employerId: integer('employer_id')
    .notNull()
    .references(() => employers.userId),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  location: varchar('location', { length: 255 }),
  status: varchar('status', { length: 20 }).notNull().default('active'), // 'active' | 'closed' | 'draft'
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
