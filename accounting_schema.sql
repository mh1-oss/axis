-- Create materials table
CREATE TABLE IF NOT EXISTS materials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT DEFAULT 'pcs', -- e.g., m2, kg, pcs, length
  cost_price DECIMAL(10, 2) DEFAULT 0,
  selling_price DECIMAL(10, 2) DEFAULT 0,
  stock_quantity DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  project_name TEXT,
  phone TEXT,
  email TEXT,
  quote_date DATE DEFAULT CURRENT_DATE,
  ref_number TEXT, -- Custom reference number (e.g., Q-2024-001)
  status TEXT DEFAULT 'draft', -- draft, sent, approved, rejected
  total_amount DECIMAL(12, 2) DEFAULT 0,
  total_cost DECIMAL(12, 2) DEFAULT 0, -- Snapshot of cost at time of quote for profit calc
  currency TEXT DEFAULT 'USD',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create quote_items table
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  width DECIMAL(10, 2), -- Dimensions if applicable
  height DECIMAL(10, 2),
  quantity DECIMAL(10, 2) DEFAULT 1,
  unit_price DECIMAL(10, 2) DEFAULT 0,
  total_price DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  section_profile TEXT, -- e.g., 'W-G-3'
  notes TEXT
);

-- Enable RLS
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

-- Policies (Assuming public read for now or admin only? Admin only is safer for accounting)
-- For now, let's allow authenticated users (admin) to do everything.
-- Adjust strictly for production.

CREATE POLICY "Allow full access to materials for authenticated users" ON materials
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to quotes for authenticated users" ON quotes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to quote_items for authenticated users" ON quote_items
  FOR ALL USING (auth.role() = 'authenticated');
