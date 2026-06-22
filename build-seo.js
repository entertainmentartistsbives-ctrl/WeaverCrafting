const fs = require('fs');
const path = require('path');

// 1. Extract config from config.js
const configContent = fs.readFileSync(path.join(__dirname, 'config.js'), 'utf-8');
const supabaseUrlMatch = configContent.match(/SUPABASE_URL:\s*'([^']+)'/);
const supabaseKeyMatch = configContent.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/);

if (!supabaseUrlMatch || !supabaseKeyMatch) {
  console.error('Could not find SUPABASE_URL or SUPABASE_ANON_KEY in config.js');
  process.exit(1);
}

const SUPABASE_URL = supabaseUrlMatch[1];
const SUPABASE_ANON_KEY = supabaseKeyMatch[1];

// 2. Fetch SEO settings from Supabase
async function fetchSeoSettings() {
  console.log('Fetching SEO settings from Supabase...');
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/images?category=like.seo_*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Supabase API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const seoMap = {};
    
    for (const row of data) {
      const pageSlug = row.category.replace('seo_', '');
      try {
        seoMap[pageSlug] = JSON.parse(row.image_url);
      } catch (e) {
        console.warn(`Could not parse SEO JSON for ${pageSlug}`);
      }
    }
    
    return seoMap;
  } catch (error) {
    console.error('Error fetching SEO:', error);
    return {};
  }
}

// 3. Update HTML files
function updateHtmlFile(filePath, seoData) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File ${filePath} does not exist, skipping.`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Update Title
  if (seoData.title) {
    content = content.replace(/<title>.*?<\/title>/i, `<title>${seoData.title}</title>`);
  }
  
  // Helper to replace meta tags
  const replaceMeta = (nameAttr, nameVal, contentVal) => {
    if (!contentVal) return;
    // Regex matches <meta name="X" content="..."> or <meta property="X" content="...">
    const regex = new RegExp(`<meta\\s+(?:name|property)=["']${nameVal}["']\\s+content=["'][^"']*["'][^>]*>`, 'i');
    const newTag = `<meta ${nameAttr}="${nameVal}" content="${contentVal}">`;
    
    if (regex.test(content)) {
      content = content.replace(regex, newTag);
    } else {
      // If it doesn't exist, inject it before </head>
      content = content.replace('</head>', `  ${newTag}\n</head>`);
    }
  };
  
  // Helper to replace link tags
  const replaceLink = (relVal, hrefVal) => {
    if (!hrefVal) return;
    const regex = new RegExp(`<link\\s+rel=["']${relVal}["']\\s+href=["'][^"']*["'][^>]*>`, 'i');
    const newTag = `<link rel="${relVal}" href="${hrefVal}">`;
    
    if (regex.test(content)) {
      content = content.replace(regex, newTag);
    } else {
      content = content.replace('</head>', `  ${newTag}\n</head>`);
    }
  };

  replaceMeta('name', 'description', seoData.description);
  replaceMeta('name', 'keywords', seoData.keywords);
  replaceMeta('name', 'robots', seoData.robots);
  replaceMeta('property', 'og:title', seoData.og_title || seoData.title);
  replaceMeta('property', 'og:description', seoData.og_description || seoData.description);
  replaceMeta('property', 'og:url', seoData.canonical);
  replaceMeta('property', 'og:image', seoData.og_image);
  replaceMeta('name', 'twitter:title', seoData.og_title || seoData.title);
  replaceMeta('name', 'twitter:description', seoData.og_description || seoData.description);
  replaceMeta('name', 'twitter:image', seoData.og_image);
  replaceLink('canonical', seoData.canonical);
  
  // Update JSON-LD Schema
  if (seoData.schema) {
    let schemaRaw = seoData.schema.trim();
    // if the user pasted a full <script> tag, extract just the JSON
    if (schemaRaw.startsWith('<')) {
      const match = schemaRaw.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      if (match) schemaRaw = match[1].trim();
    }
    
    // We replace the existing schema. We look for the <script type="application/ld+json"> tag.
    // Note: The original files have a comprehensive schema block.
    // This regex tries to find the first application/ld+json block and replace its contents.
    const schemaRegex = /<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i;
    if (schemaRegex.test(content)) {
      content = content.replace(schemaRegex, `<script type="application/ld+json">\n${schemaRaw}\n</script>`);
    }
  }

  // Optionally remove the seo-loader.js so it doesn't run on the client side unnecessarily
  // But leaving it doesn't hurt as it will just re-apply the same tags, so we can leave it to be safe.

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated SEO for ${filePath}`);
}

async function build() {
  const seoSettings = await fetchSeoSettings();
  
  // List of known pages to update
  const pages = [
    { slug: 'index', file: 'index.html' },
    { slug: 'products', file: 'products.html' },
    { slug: 'product-detail', file: 'product-detail.html' },
    { slug: 'about', file: 'about.html' },
    { slug: 'contact', file: 'contact.html' },
    { slug: 'gallery', file: 'gallery.html' },
    { slug: 'craftsmanship', file: 'craftsmanship.html' },
    { slug: 'b2b', file: 'b2b.html' }
  ];
  
  for (const page of pages) {
    if (seoSettings[page.slug]) {
      updateHtmlFile(path.join(__dirname, page.file), seoSettings[page.slug]);
    } else {
      console.log(`No custom SEO found for ${page.slug}, leaving default HTML intact.`);
    }
  }
  
  console.log('SEO build process completed successfully!');
}

build();
