-- Copy and paste this into the Supabase SQL Editor to create the necessary table.

CREATE TABLE IF NOT EXISTS coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand_name TEXT NOT NULL,
    category TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    image_url TEXT
);

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number TEXT UNIQUE NOT NULL,
    name TEXT,
    email TEXT,
    dob DATE,
    upi_id TEXT,
    role TEXT DEFAULT 'User',
    user_level TEXT DEFAULT 'Level 1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- UPDATE COUPONS TABLE
-- We need to link coupons to sellers (who uploaded) and buyers (who purchased)
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES users(id);
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS buyer_id UUID REFERENCES users(id);
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available'; -- 'available', 'sold'

-- POLICIES (Simple public access for prototype, but ready for RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable grid access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON users FOR UPDATE USING (true);

