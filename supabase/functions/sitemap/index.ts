// Dynamic sitemap — always reads latest SEO from database (no manual upload needed)
// Deploy once: supabase functions deploy sitemap --no-verify-jwt
// URL: https://YOUR_PROJECT.supabase.co/functions/v1/sitemap

import { createClient } from "npm:@supabase/supabase-js@2";

const PAGES = [
  { slug: "index", canonical: "https://weaverscrafting.in/", priority: "1.0", changefreq: "weekly" },
  { slug: "products", canonical: "https://weaverscrafting.in/products.html", priority: "0.9", changefreq: "weekly" },
  { slug: "product-detail", canonical: "https://weaverscrafting.in/product-detail.html", priority: "0.8", changefreq: "weekly" },
  { slug: "about", canonical: "https://weaverscrafting.in/about.html", priority: "0.7", changefreq: "monthly" },
  { slug: "contact", canonical: "https://weaverscrafting.in/contact.html", priority: "0.8", changefreq: "monthly" },
  { slug: "gallery", canonical: "https://weaverscrafting.in/gallery.html", priority: "0.7", changefreq: "monthly" },
  { slug: "craftsmanship", canonical: "https://weaverscrafting.in/craftsmanship.html", priority: "0.7", changefreq: "monthly" },
  { slug: "b2b", canonical: "https://weaverscrafting.in/b2b.html", priority: "0.8", changefreq: "monthly" },
];

Deno.serve(async () => {
  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  const seoMap: Record<string, Record<string, unknown>> = {};
  const { data } = await sb.from("images").select("category, image_url").like("category", "seo_%");
  data?.forEach((row) => {
    try {
      seoMap[row.category.replace("seo_", "")] = JSON.parse(row.image_url);
    } catch { /* ignore */ }
  });

  const today = new Date().toISOString().split("T")[0];
  let urls = "";
  for (const p of PAGES) {
    const seo = { ...p, ...(seoMap[p.slug] || {}) };
    if (seo.in_sitemap === false) continue;
    const loc = (seo.canonical as string) || p.canonical;
    if (!loc) continue;
    urls += `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${seo.changefreq || p.changefreq}</changefreq>
    <priority>${seo.priority || p.priority}</priority>
  </url>
`;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
});
