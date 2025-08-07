import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './user.model';

export const employers = pgTable('employers', {
  userId: integer('user_id')
    .primaryKey()
    .references(() => users.id),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }).notNull(),
  companyWebsite: text('company_website'),
  // Add other employer specific fields
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Employer = typeof employers.$inferSelect;
export type NewEmployer = typeof employers.$inferInsert;
