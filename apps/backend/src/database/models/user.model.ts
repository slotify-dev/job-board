import {
  pgTable,
  serial,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').notNull().defaultRandom().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash'),
    role: varchar('role', { length: 20 }).notNull().default('job_seeker'),
    ssoProvider: varchar('sso_provider', { length: 50 }),
    ssoId: varchar('sso_id', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    uuidIdx: index('users_uuid_idx').on(table.uuid),
    emailIdx: index('users_email_idx').on(table.email),
    roleIdx: index('users_role_idx').on(table.role),
    ssoIdx: index('users_sso_provider_sso_id_idx').on(
      table.ssoProvider,
      table.ssoId,
    ),
    roleCreatedAtIdx: index('users_role_created_at_idx').on(
      table.role,
      table.createdAt,
    ),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
