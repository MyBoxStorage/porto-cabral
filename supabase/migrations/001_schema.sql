-- Schema alinhado ao Drizzle (app) — execute no SQL Editor do Supabase ou via CLI.

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
