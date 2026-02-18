-- Add auto_delete_days to site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS auto_delete_days INTEGER DEFAULT 0;

-- Notify Supabase to reload schema cache
NOTIFY pgrst, 'reload config';
