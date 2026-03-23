-- Tabela alinhada a lib/db/schema.ts (site_content), se ainda não existir
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);

INSERT INTO site_content (key, value)
VALUES (
  'videos',
  '{
    "eyebrow_pt": "Porto Cabral BC",
    "eyebrow_en": "Porto Cabral BC",
    "eyebrow_es": "Porto Cabral BC",
    "title_pt": "Viva a Experiência",
    "title_en": "Live the Experience",
    "title_es": "Vive la Experiencia",
    "items": []
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE
SET
  value = EXCLUDED.value,
  updated_at = now();
