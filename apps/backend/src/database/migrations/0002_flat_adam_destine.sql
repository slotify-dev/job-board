ALTER TABLE "jobs" ALTER COLUMN "description" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "requirements";