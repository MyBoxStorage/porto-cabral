-- ══════════════════════════════════════════════════════════════
-- Porto Cabral BC — Migration Completa
-- Execute via: psql $DATABASE_URI -f run_all.sql
-- ══════════════════════════════════════════════════════════════

-- 001: SCHEMA
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE REFERENCES auth.users (id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  whatsapp text,
  birth_date date,
  city_of_origin text,
  allergies text,
  special_notes text,
  optin_accepted boolean DEFAULT false,
  optin_accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customer_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL UNIQUE REFERENCES customers (id) ON DELETE CASCADE,
  occasion_type text,
  visit_frequency text,
  food_preferences text[],
  drink_preferences text[],
  group_size text,
  how_found text,
  quiz_completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers (id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  whatsapp text NOT NULL,
  reservation_date date NOT NULL,
  reservation_time text NOT NULL,
  party_size integer NOT NULL,
  occasion_type text,
  observations text,
  allergies text,
  status text NOT NULL DEFAULT 'pending',
  optin_accepted boolean DEFAULT false,
  bc_connect_sent boolean DEFAULT false,
  bc_connect_sent_at timestamptz,
  confirmation_email_sent boolean DEFAULT false,
  confirmation_email_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS google_reviews_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id text NOT NULL UNIQUE,
  reviews jsonb NOT NULL,
  rating numeric(2, 1),
  total_reviews integer,
  cached_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations (email);
CREATE INDEX IF NOT EXISTS idx_reservations_customer_id ON reservations (customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON customers (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers (email);

-- 002: RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customers_own_data" ON customers;
CREATE POLICY "customers_own_data" ON customers
  FOR ALL USING (auth.uid() = auth_user_id);

-- Policy para insert anônimo (reservas sem login)
DROP POLICY IF EXISTS "customers_insert_anon" ON customers;
CREATE POLICY "customers_insert_anon" ON customers
  FOR INSERT WITH CHECK (true);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reservations_own_data" ON reservations;
CREATE POLICY "reservations_own_data" ON reservations
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );

-- Policy para insert via API (service role bypassa RLS, mas garantimos para anon)
DROP POLICY IF EXISTS "reservations_insert_anon" ON reservations;
CREATE POLICY "reservations_insert_anon" ON reservations
  FOR INSERT WITH CHECK (true);

ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "preferences_own_data" ON customer_preferences;
CREATE POLICY "preferences_own_data" ON customer_preferences
  FOR ALL USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );

ALTER TABLE google_reviews_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_cache_read" ON google_reviews_cache;
CREATE POLICY "reviews_cache_read" ON google_reviews_cache
  FOR SELECT USING (true);

-- 003: updated_at trigger (auto-update)
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON customers;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON reservations;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON customer_preferences;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON customer_preferences
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
