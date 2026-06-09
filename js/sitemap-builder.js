// Build sitemap.xml from page list + SEO data
window.WC_buildSitemapXml = function (pages, getSeoForPage) {
  const today = new Date().toISOString().split("T")[0];
  let urls = "";
  pages.forEach((p) => {
    const seo = getSeoForPage(p.slug);
    if (seo.in_sitemap === false || !seo.canonical) return;
    urls += `  <url>
    <loc>${seo.canonical}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${seo.changefreq || "monthly"}</changefreq>
    <priority>${seo.priority || "0.8"}</priority>
  </url>
`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}</urlset>`;
};
