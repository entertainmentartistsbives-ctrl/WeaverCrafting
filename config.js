// ─────────────────────────────────────────────────────────────
// Weaver's Crafting — Central Configuration
// This file holds all API keys and config values for the site.
// Update keys HERE only — all pages read from this file.
// ─────────────────────────────────────────────────────────────

const WC_CONFIG = {
  // Supabase (safe to expose — controlled by RLS policies)
  SUPABASE_URL: 'https://owgqxbgjmoqlhzztvety.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93Z3F4YmdqbW9xbGh6enR2ZXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTk1MTAsImV4cCI6MjA5NTYzNTUxMH0.YoqjisE2XjKTckEh6j-352X1MvyHi5PX5_dHnCHD6Q0',

  // Cloudinary (upload preset is public by design)
  CLOUDINARY_CLOUD_NAME: 'dccpzvexs',
  CLOUDINARY_UPLOAD_PRESET: 'Weaverscrafting',

  // Business Contact
  WHATSAPP_NUMBER: '919742630886',
  EMAIL: 'craftersofa974263@gmail.com',
  PHONE_PRIMARY: '+91 97426 30886',
  PHONE_SECONDARY: '+91 88814 23496',
};

// Derived helpers (do not edit)
WC_CONFIG.CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${WC_CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`;
WC_CONFIG.WHATSAPP_URL = `https://wa.me/${WC_CONFIG.WHATSAPP_NUMBER}`;
