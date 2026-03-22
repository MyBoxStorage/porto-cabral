-- Políticas RLS (conteúdo equivalente ao 001_rls do prompt; nome do arquivo conforme estrutura esperada)

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customers_own_data" ON customers;
CREATE POLICY "customers_own_data" ON customers
  FOR ALL USING (auth.uid() = auth_user_id);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reservations_own_data" ON reservations;
CREATE POLICY "reservations_own_data" ON reservations
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );

ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "preferences_own_data" ON customer_preferences;
CREATE POLICY "preferences_own_data" ON customer_preferences
  FOR ALL USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );
