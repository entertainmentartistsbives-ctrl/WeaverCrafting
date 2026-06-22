const { BASE_URL } = require('./constants');
const { buildOrganizationSchema } = require('./build-schema');

const orgSchemaStr = JSON.stringify(buildOrganizationSchema(BASE_URL));

const defaultSeoPages = [
  { 
    slug: 'index',
    page_name: 'Home',
    path: '/',
    meta_title: "Weaver's Crafting | Best Sofa & Furniture Shop in Bommanahalli, Bengaluru",
    meta_keywords: "Weaver's Crafting, custom furniture Bengaluru, sofa manufacturer Bangalore, sofa cum bed, dining tables, Bommanahalli 560068, HSR Layout, Electronic City, BTM Layout",
    meta_description: "Weaver's Crafting – #1 custom sofa, sofa cum bed, dining table & furniture shop in Bommanahalli, Bengaluru. Handcrafted premium furniture with home delivery.",
    canonical_url: `${BASE_URL}/`,
    schema_json: orgSchemaStr
  },
  { 
    slug: 'products',
    page_name: 'Products',
    path: '/products.html',
    meta_title: 'Shop Furniture Online | Sofas, Beds & Dining — Weaver\\'s Crafting Bengaluru',
    meta_keywords: 'furniture shop Bengaluru, buy sofa online Bangalore, dining table Bommanahalli, custom furniture South Bangalore',
    meta_description: 'Browse handcrafted sofas, dining sets, beds and commercial furniture. Custom sizes, fabrics and wood options. Enquire via WhatsApp — Weaver\\'s Crafting.',
    canonical_url: `${BASE_URL}/products.html`,
    schema_json: ''
  },
  { 
    slug: 'product-detail',
    page_name: 'Product Detail',
    path: '/product-detail.html',
    meta_title: 'Product Details | Weaver\\'s Crafting — Custom Furniture Bengaluru',
    meta_keywords: 'custom furniture quote Bengaluru, furniture specifications, Weaver\\'s Crafting products',
    meta_description: 'View product specifications, custom options, and request a quote. Handcrafted custom furniture in Bommanahalli, Bengaluru.',
    canonical_url: `${BASE_URL}/product-detail.html`,
    schema_json: ''
  },
  { 
    slug: 'about',
    page_name: 'About Us',
    path: '/about.html',
    meta_title: 'About Us | Weaver\\'s Crafting — Handcrafted Furniture Bengaluru',
    meta_keywords: 'about Weaver\\'s Crafting, furniture manufacturer Bommanahalli, handcrafted furniture Bangalore',
    meta_description: 'Learn about Weaver\\'s Crafting — premium handcrafted furniture makers in Bommanahalli, Bengaluru. 10+ years of custom sofas, beds and dining furniture.',
    canonical_url: `${BASE_URL}/about.html`,
    schema_json: orgSchemaStr
  },
  { 
    slug: 'contact',
    page_name: 'Contact',
    path: '/contact.html',
    meta_title: 'Contact Us | Weaver\\'s Crafting — Bommanahalli, Bengaluru',
    meta_keywords: 'furniture shop contact Bengaluru, Weaver\\'s Crafting phone, furniture store Bandepalya',
    meta_description: 'Contact Weaver\\'s Crafting for custom furniture enquiries. Call +91 97426 30886 or WhatsApp. Visit us in Bandepalya, Bommanahalli, Bengaluru.',
    canonical_url: `${BASE_URL}/contact.html`,
    schema_json: ''
  },
  { 
    slug: 'gallery',
    page_name: 'Gallery',
    path: '/gallery.html',
    meta_title: 'Gallery | Weaver\\'s Crafting Furniture Projects — Bengaluru',
    meta_keywords: 'furniture gallery Bengaluru, sofa photos, custom furniture projects Bangalore',
    meta_description: 'Browse our gallery of handcrafted sofas, beds, dining sets and commercial furniture projects across Bengaluru.',
    canonical_url: `${BASE_URL}/gallery.html`,
    schema_json: ''
  },
  { 
    slug: 'craftsmanship',
    page_name: 'Craftsmanship',
    path: '/craftsmanship.html',
    meta_title: 'Craftsmanship | Weaver\\'s Crafting — Premium Handcrafted Furniture',
    meta_keywords: 'furniture craftsmanship Bengaluru, handmade sofas, quality furniture Bangalore',
    meta_description: 'Discover the craftsmanship behind Weaver\\'s Crafting furniture — premium materials, skilled artisans, and custom-built pieces for Bengaluru homes.',
    canonical_url: `${BASE_URL}/craftsmanship.html`,
    schema_json: ''
  },
  { 
    slug: 'b2b',
    page_name: 'B2B Solutions',
    path: '/b2b.html',
    meta_title: 'B2B & Commercial Furniture | Weaver\\'s Crafting Bengaluru',
    meta_keywords: 'B2B furniture Bengaluru, office furniture, cafe seating, hotel furniture, commercial furniture Bangalore',
    meta_description: 'Premium custom B2B and commercial furniture for offices, cafes, restaurants, hotels and interior designers in Bengaluru. Get a wholesale quote today.',
    canonical_url: `${BASE_URL}/b2b.html`,
    schema_json: ''
  }
];

const PUBLIC_PAGE_SLUGS = defaultSeoPages.map(p => p.slug);

function slugToFilename(slug) {
  return slug === 'index' ? 'index.html' : `${slug}.html`;
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function replaceMetaByName(html, name, content) {
  if (!content) return html;
  const regex = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["'][^"']*["'][^>]*>`, 'i');
  const newTag = `<meta name="${name}" content="${escapeAttr(content)}">`;
  if (regex.test(html)) {
    return html.replace(regex, newTag);
  }
  return html.replace('</title>', `</title>\\n    ${newTag}`);
}

function replaceMetaProperty(html, property, content) {
  if (!content) return html;
  const regex = new RegExp(`<meta\\s+property=["']${property}["']\\s+content=["'][^"']*["'][^>]*>`, 'i');
  const newTag = `<meta property="${property}" content="${escapeAttr(content)}">`;
  if (regex.test(html)) {
    return html.replace(regex, newTag);
  }
  return html.replace('</title>', `</title>\\n    ${newTag}`);
}

function buildSchemaTag(schemaRaw) {
  if (!schemaRaw) return '';
  let clean = schemaRaw.trim();
  if (clean.startsWith('<script')) return clean;
  return `<script type="application/ld+json" id="cs-seo-schema">\\n${clean}\\n</script>`;
}

function injectSeoIntoHtml(html, seo, apiLocation) {
  let output = html;
  const currentApiLocation = apiLocation || BASE_URL;

  // Title
  if (seo.meta_title) {
    output = output.replace(/<title>.*?<\\/title>/i, `<title>${escapeAttr(seo.meta_title)}</title>`);
  }

  // Meta Tags
  output = replaceMetaByName(output, 'description', seo.meta_description);
  output = replaceMetaByName(output, 'keywords', seo.meta_keywords);
  
  let canUrl = seo.canonical_url || `${BASE_URL}${slugToFilename(seo.slug)}`;
  if (currentApiLocation !== BASE_URL) {
    canUrl = canUrl.replace(new RegExp(BASE_URL, 'g'), currentApiLocation);
  }
  
  // Canonical Link
  const canonicalRegex = /<link\\s+rel=["']canonical["']\\s+href=["'][^"']*["'][^>]*>/i;
  const newCanonical = `<link rel="canonical" href="${escapeAttr(canUrl)}">`;
  if (canonicalRegex.test(output)) {
    output = output.replace(canonicalRegex, newCanonical);
  } else {
    output = output.replace('</title>', `</title>\\n    ${newCanonical}`);
  }

  // Open Graph
  output = replaceMetaProperty(output, 'og:title', seo.meta_title);
  output = replaceMetaProperty(output, 'og:description', seo.meta_description);
  output = replaceMetaProperty(output, 'og:url', canUrl);
  output = replaceMetaProperty(output, 'og:type', 'website');
  
  // Twitter
  output = replaceMetaByName(output, 'twitter:title', seo.meta_title);
  output = replaceMetaByName(output, 'twitter:description', seo.meta_description);
  output = replaceMetaByName(output, 'twitter:card', 'summary_large_image');

  // Schema
  if (seo.schema_json) {
    let schemaToInject = seo.schema_json;
    if (currentApiLocation !== BASE_URL) {
      schemaToInject = schemaToInject.replace(new RegExp(BASE_URL, 'g'), currentApiLocation);
    }
    const schemaTag = buildSchemaTag(schemaToInject);
    const existingSchemaRegex = /<script\\s+type=["']application\\/ld\\+json["'][^>]*>[\\s\\S]*?<\\/script>/i;
    if (existingSchemaRegex.test(output)) {
      output = output.replace(existingSchemaRegex, schemaTag);
    } else {
      output = output.replace('</head>', `    ${schemaTag}\\n</head>`);
    }
  }

  return output;
}

async function loadSeoPages(supabase) {
  try {
    const { data, error } = await supabase.from('images').select('*').eq('category', 'cs_seo');
    if (error) throw error;
    
    // Merge with defaults
    const customSeoMap = {};
    if (data && data.length > 0) {
      data.forEach(row => {
        try {
          const parsed = JSON.parse(row.image_url);
          if (parsed.slug) {
             customSeoMap[parsed.slug] = parsed;
          }
        } catch (e) {}
      });
    }

    return defaultSeoPages.map(defaultPage => {
      const custom = customSeoMap[defaultPage.slug];
      if (custom) {
        return { ...defaultPage, ...custom };
      }
      return defaultPage;
    });
  } catch (err) {
    console.warn('Error loading SEO from Supabase, using defaults:', err.message);
    return defaultSeoPages;
  }
}

async function getSeoForSlug(supabase, slug, memorySeoPages) {
  let pages = memorySeoPages;
  if (!pages) {
    pages = await loadSeoPages(supabase);
  }
  const page = pages.find(p => p.slug === slug);
  return page || defaultSeoPages.find(p => p.slug === slug) || defaultSeoPages[0];
}

module.exports = {
  BASE_URL,
  defaultSeoPages,
  PUBLIC_PAGE_SLUGS,
  slugToFilename,
  escapeAttr,
  replaceMetaByName,
  replaceMetaProperty,
  buildSchemaTag,
  injectSeoIntoHtml,
  loadSeoPages,
  getSeoForSlug
};
