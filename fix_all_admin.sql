-- 1. FIX SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT,
    email TEXT,
    address TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    linkedin_url TEXT,
    map_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. INSERT DEFAULT SETTINGS (If empty)
INSERT INTO site_settings (phone, email, address, facebook_url, instagram_url, linkedin_url, map_url)
SELECT '+1 (555) 123-4567', 'info@axisaluminum.com', '123 Industrial Ave, Sector 5, Building District, NY 10001', 'https://facebook.com', 'https://instagram.com', 'https://linkedin.com', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1837920360675!2d-73.9877316845941!3d40.74844454348528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620668474261!5m2!1sen!2sus'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- 3. ENABLE RLS ON SITE SETTINGS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 4. CREATE POLICIES FOR SITE SETTINGS
-- Allow everyone to read settings
DROP POLICY IF EXISTS "Public settings are viewable by everyone." ON site_settings;
CREATE POLICY "Public settings are viewable by everyone." ON site_settings FOR SELECT USING (true);

-- Allow authenticated users (admin) to update/insert
DROP POLICY IF EXISTS "Authenticated users can update settings." ON site_settings;
CREATE POLICY "Authenticated users can update settings." ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert settings." ON site_settings;
CREATE POLICY "Authenticated users can insert settings." ON site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. FIX PROJECTS TABLE (Add is_featured)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- 6. REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload config';
