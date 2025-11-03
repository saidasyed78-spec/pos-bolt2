/*
  # Retail Management System Schema

  ## Tables Created
  
  1. categories - Product categories
  2. gst_rates - GST rate master
  3. suppliers - Supplier ledger
  4. products - Product inventory
  5. sales - Sales transactions
  6. purchases - Purchase transactions
  7. users - User authentication
  8. shop_profile - Shop configuration
  
  ## Security
  - RLS enabled on all tables
  - Public access policies for single-shop system
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gst_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rate numeric NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text DEFAULT '',
  gst_no text DEFAULT '',
  phone text DEFAULT '',
  opening_balance numeric DEFAULT 0,
  balance_type text DEFAULT 'Credit',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  barcode text DEFAULT '',
  price numeric NOT NULL,
  gst numeric NOT NULL,
  stock integer DEFAULT 0,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number integer UNIQUE NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  customer_name text DEFAULT '',
  customer_phone text DEFAULT '',
  items jsonb NOT NULL,
  subtotal numeric NOT NULL,
  total_gst numeric NOT NULL,
  total_amount numeric NOT NULL,
  payment_method text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number integer UNIQUE NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  supplier_id uuid REFERENCES suppliers(id),
  supplier_name text DEFAULT '',
  supplier_phone text DEFAULT '',
  items jsonb NOT NULL,
  subtotal numeric NOT NULL,
  total_gst numeric NOT NULL,
  total_amount numeric NOT NULL,
  payment_method text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shop_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name text NOT NULL,
  owner_name text DEFAULT '',
  address text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  gstin text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(date);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gst_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on gst_rates" ON gst_rates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on suppliers" ON suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on sales" ON sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on purchases" ON purchases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on shop_profile" ON shop_profile FOR ALL USING (true) WITH CHECK (true);
