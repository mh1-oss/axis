-- Add columns to site_settings table to store print settings in the DB instead of localStorage

ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS company_name TEXT DEFAULT 'AXIS',
ADD COLUMN IF NOT EXISTS company_tagline TEXT DEFAULT 'Aluminum & Glass Solutions',
ADD COLUMN IF NOT EXISTS website_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS exchange_rate NUMERIC DEFAULT 1500,
ADD COLUMN IF NOT EXISTS terms_text TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS thank_you_text TEXT DEFAULT 'Thank you for your business!',
ADD COLUMN IF NOT EXISTS show_dimensions BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_logo BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS currency_symbol TEXT DEFAULT '$';
