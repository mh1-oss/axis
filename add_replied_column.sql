-- Add replied and replied_at columns to messages table
ALTER TABLE messages ADD COLUMN IF NOT EXISTS replied BOOLEAN DEFAULT false;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP WITH TIME ZONE;

-- Notify Supabase to reload schema cache
NOTIFY pgrst, 'reload config';
