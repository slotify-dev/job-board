-- Update job seekers table: add email, phone, address columns and remove contact_info

-- Add new columns
ALTER TABLE job_seekers ADD COLUMN email VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE job_seekers ADD COLUMN phone VARCHAR(50);
ALTER TABLE job_seekers ADD COLUMN address TEXT;

-- Update existing records to populate email from contact_info if possible
-- For now, we'll use a default email pattern for existing records
UPDATE job_seekers SET email = 'jobseeker' || user_id || '@example.com' WHERE email = '';

-- Drop the old contact_info column
ALTER TABLE job_seekers DROP COLUMN contact_info;