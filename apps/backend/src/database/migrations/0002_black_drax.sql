ALTER TABLE "applications" ADD COLUMN "uuid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "uuid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "uuid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
CREATE INDEX "applications_job_id_idx" ON "applications" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "applications_job_seeker_id_idx" ON "applications" USING btree ("job_seeker_id");--> statement-breakpoint
CREATE INDEX "applications_status_idx" ON "applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "applications_created_at_idx" ON "applications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_uuid_idx" ON "users" USING btree ("uuid");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "users_sso_provider_sso_id_idx" ON "users" USING btree ("sso_provider","sso_id");--> statement-breakpoint
CREATE INDEX "jobs_employer_id_idx" ON "jobs" USING btree ("employer_id");--> statement-breakpoint
CREATE INDEX "jobs_status_idx" ON "jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "jobs_location_idx" ON "jobs" USING btree ("location");--> statement-breakpoint
CREATE INDEX "jobs_created_at_idx" ON "jobs" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_uuid_unique" UNIQUE("uuid");