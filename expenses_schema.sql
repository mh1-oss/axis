-- Create expenses table for tracking monthly costs
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'other', -- salary, rent, utilities, supplies, other
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users
CREATE POLICY "Allow full access to expenses for authenticated users" ON expenses
  FOR ALL USING (auth.role() = 'authenticated');
