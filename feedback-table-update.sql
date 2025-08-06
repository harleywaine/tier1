-- Add missing columns to feedback table
ALTER TABLE feedback ADD COLUMN device_info text;
ALTER TABLE feedback ADD COLUMN app_version text; 