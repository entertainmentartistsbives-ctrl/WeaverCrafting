-- Customers setup — for full migration run: supabase/complete-setup.sql
-- (includes enquiries table + fixes for your existing Supabase schema)

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  locality TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'customers_auth_user_id_key'
      AND conrelid = 'public.customers'::regclass
  ) THEN
    ALTER TABLE public.customers
      ADD CONSTRAINT customers_auth_user_id_key UNIQUE (auth_user_id);
  END IF;
END $$;

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own profile" ON public.customers;
DROP POLICY IF EXISTS "Users can read own profile" ON public.customers;
DROP POLICY IF EXISTS "Users can update own profile" ON public.customers;
DROP POLICY IF EXISTS "Authenticated can read all customers" ON public.customers;

CREATE POLICY "Users can insert own profile" ON public.customers
  FOR INSERT WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Users can read own profile" ON public.customers
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.customers
  FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY "Authenticated can read all customers" ON public.customers
  FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.handle_new_customer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.customers (auth_user_id, full_name, phone, email, locality)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Customer'),
    COALESCE(NEW.raw_user_meta_data->>'phone', '—'),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'locality', '')
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    locality = EXCLUDED.locality;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_customer_created ON auth.users;
CREATE TRIGGER on_auth_customer_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_customer();
