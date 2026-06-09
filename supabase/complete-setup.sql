-- ═══════════════════════════════════════════════════════════════
-- WEAVER'S CRAFTING — Complete Supabase setup (safe to re-run)
-- ═══════════════════════════════════════════════════════════════
-- Run this in: Supabase Dashboard → SQL Editor → New query
--
-- Your images table is already fine — this script does NOT touch it.
-- This only fixes/completes: customers, enquiries, triggers, policies.
--
-- BEFORE running: disable email confirmation (avoids rate limit errors)
--   Authentication → Providers → Email → turn OFF "Confirm email" → Save
-- ═══════════════════════════════════════════════════════════════


-- ── 1. CUSTOMERS TABLE (fix if partially created) ──────────────

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

-- Add UNIQUE on auth_user_id if your first CREATE TABLE missed it
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

-- Drop old policies (safe re-run) then recreate
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

-- Admin panel reads all customers (any logged-in user including admin)
CREATE POLICY "Authenticated can read all customers" ON public.customers
  FOR SELECT TO authenticated USING (true);


-- ── 2. AUTO-CREATE CUSTOMER PROFILE ON SIGNUP ──────────────────

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


-- ── 3. ENQUIRIES TABLE (cart / WhatsApp orders for admin panel) ─

CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_locality TEXT,
  notes TEXT,
  cart_items JSONB NOT NULL DEFAULT '[]',
  total_items INTEGER NOT NULL DEFAULT 0,
  is_guest BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit enquiry" ON public.enquiries;
DROP POLICY IF EXISTS "Authenticated can read all enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Authenticated can update enquiries" ON public.enquiries;

-- Guests + logged-in customers can submit enquiries from the cart
CREATE POLICY "Anyone can submit enquiry" ON public.enquiries
  FOR INSERT WITH CHECK (true);

-- Admin panel can view all enquiries
CREATE POLICY "Authenticated can read all enquiries" ON public.enquiries
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can update enquiries" ON public.enquiries
  FOR UPDATE TO authenticated USING (true);


-- ── 4. SITEMAP AUTO-PUBLISH (Supabase Storage) ─────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site', 'site', true, 1048576, ARRAY['application/xml', 'text/xml'])
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read site files" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload site files" ON storage.objects;
DROP POLICY IF EXISTS "Auth update site files" ON storage.objects;

CREATE POLICY "Public read site files" ON storage.objects
  FOR SELECT USING (bucket_id = 'site');

CREATE POLICY "Auth upload site files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site');

CREATE POLICY "Auth update site files" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'site');


-- ── 5. OPTIONAL: manually confirm a stuck user ─────────────────
-- Uncomment and change the email, then run only that line:
--
-- UPDATE auth.users SET email_confirmed_at = now(), confirmed_at = now()
-- WHERE email = 'your@email.com';
