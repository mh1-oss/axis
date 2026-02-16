-- Add missing 'location' column to projects table
alter table public.projects add column if not exists location text;
