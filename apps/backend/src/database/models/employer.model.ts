import {
  pgTable,
  integer,
  varchar,
  uuid,
  text,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { users } from './user.model';

export const employers = pgTable(
  'employers',
  {
    userId: integer('user_id')
      .primaryKey()
      .references(() => users.id),
    uuid: uuid('uuid').notNull().defaultRandom().unique(),
    companyName: varchar('company_name', { length: 255 }).notNull(),
    contactPerson: varchar('contact_person', { length: 255 }).notNull(),
    companyWebsite: text('company_website'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    companyNameIdx: index('employers_company_name_idx').on(table.companyName),
    contactPersonIdx: index('employers_contact_person_idx').on(
      table.contactPerson,
    ),
    createdAtIdx: index('employers_created_at_idx').on(table.createdAt),
  }),
);

export type Employer = typeof employers.$inferSelect;
export type NewEmployer = typeof employers.$inferInsert;
