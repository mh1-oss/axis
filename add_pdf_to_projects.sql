-- Add catalog_url column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS catalog_url TEXT;
