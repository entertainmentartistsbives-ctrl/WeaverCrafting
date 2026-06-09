-- ═══════════════════════════════════════════════════════════════
-- FIX: "email rate limit exceeded" on customer signup
-- ═══════════════════════════════════════════════════════════════
--
-- PERMANENT FIX (do this once in Supabase Dashboard):
--   1. Go to Authentication → Providers → Email
--   2. Turn OFF "Confirm email"
--   3. Save
--   → Customers can sign up and log in instantly (no verification emails)
--
-- IMMEDIATE FIX for a stuck user (run in SQL Editor):
--   Replace the email below with the customer's email, then run:

UPDATE auth.users
SET
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  confirmed_at = COALESCE(confirmed_at, now())
WHERE email = 'aryaarya49062@gmail.com';

-- After running, the customer can sign in with their password immediately.
