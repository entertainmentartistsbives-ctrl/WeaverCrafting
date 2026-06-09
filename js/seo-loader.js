// Dynamic SEO loader — reads overrides from Supabase (images table, category seo_*)
(function () {
  const script = document.currentScript;
  const page = script && script.dataset.page;
  if (!page || !window.WC_CONFIG) return;

  const defaults = (window.WC_SEO_DEFAULTS && window.WC_SEO_DEFAULTS[page]) || {};

  function setMeta(attr, key, value) {
    if (!value) return;
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value);
  }

  function setLink(rel, href) {
    if (!href) return;
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", rel);
      document.head.appendChild(el);
    }
    el.setAttribute("href", href);
  }

  function parseSchema(raw) {
    if (!raw || !raw.trim()) return null;
    const text = raw.trim();
    if (text.startsWith("<")) {
      const match = text.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      return match ? match[1].trim() : text;
    }
    return text;
  }

  function applySeo(seo) {
    if (seo.title) document.title = seo.title;
    setMeta("name", "description", seo.description);
    setMeta("name", "keywords", seo.keywords);
    if (seo.robots) setMeta("name", "robots", seo.robots);
    setMeta("property", "og:title", seo.og_title || seo.title);
    setMeta("property", "og:description", seo.og_description || seo.description);
    setMeta("property", "og:url", seo.canonical);
    setMeta("property", "og:image", seo.og_image);
    setMeta("name", "twitter:title", seo.og_title || seo.title);
    setMeta("name", "twitter:description", seo.og_description || seo.description);
    setMeta("name", "twitter:image", seo.og_image);
    setLink("canonical", seo.canonical);

    const schemaRaw = parseSchema(seo.schema);
    if (schemaRaw) {
      try {
        JSON.parse(schemaRaw);
        document.querySelectorAll('script[type="application/ld+json"]').forEach(el => {
          if (el.id !== "wc-dynamic-schema") el.remove();
        });
        let el = document.getElementById("wc-dynamic-schema");
        if (!el) {
          el = document.createElement("script");
          el.id = "wc-dynamic-schema";
          el.type = "application/ld+json";
          document.head.appendChild(el);
        }
        el.textContent = schemaRaw;
      } catch (e) {
        console.warn("Invalid SEO schema JSON for page:", page);
      }
    }
  }

  async function load() {
    let seo = { ...defaults };
    try {
      const url = `${WC_CONFIG.SUPABASE_URL}/rest/v1/images?category=eq.seo_${encodeURIComponent(page)}&select=image_url&limit=1`;
      const res = await fetch(url, {
        headers: {
          apikey: WC_CONFIG.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${WC_CONFIG.SUPABASE_ANON_KEY}`
        }
      });
      if (res.ok) {
        const rows = await res.json();
        if (rows[0] && rows[0].image_url) {
          seo = { ...defaults, ...JSON.parse(rows[0].image_url) };
        }
      }
    } catch (e) {
      console.warn("SEO loader fallback to defaults:", e);
    }
    applySeo(seo);
  }

  load();
})();
