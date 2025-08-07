import { relations } from 'drizzle-orm';
import { users } from './user.model';
import { jobSeekers } from './jobSeeker.model';
import { employers } from './employer.model';
import { jobs } from './job.model';
import { applications } from './application.model';

// Define all relations in one place to avoid circular dependencies
export const usersRelations = relations(users, ({ one }) => ({
  jobSeeker: one(jobSeekers, {
    fields: [users.id],
    references: [jobSeekers.userId],
  }),
  employer: one(employers, {
    fields: [users.id],
    references: [employers.userId],
  }),
}));

export const jobSeekersRelations = relations(jobSeekers, ({ one, many }) => ({
  user: one(users, {
    fields: [jobSeekers.userId],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const employersRelations = relations(employers, ({ one, many }) => ({
  user: one(users, {
    fields: [employers.userId],
    references: [users.id],
  }),
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  employer: one(employers, {
    fields: [jobs.employerId],
    references: [employers.userId],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  jobSeeker: one(jobSeekers, {
    fields: [applications.jobSeekerId],
    references: [jobSeekers.userId],
  }),
}));
