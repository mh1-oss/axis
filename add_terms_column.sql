-- Add pricing and stock columns to products table (for inventory integration)
ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS selling_price DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity DECIMAL(10, 2) DEFAULT 0;
