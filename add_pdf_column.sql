-- Add catalog_url column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS catalog_url TEXT;

-- Verify the column was added (optional, for manual check)
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'products' AND column_name = 'catalog_url';
