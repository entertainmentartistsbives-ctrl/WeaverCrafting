import os
import re
import glob

html_files = glob.glob('*.html')

keywords = "Weaver's Crafting, custom furniture Bengaluru, sofa manufacturer Bangalore, sofa cum bed, dining tables, L-shape sofas, recliner chairs, mattresses, bed furniture, sofa repairs, B2B furniture, commercial furniture, office workspace furniture, cafe restaurant seating, hotel lounge furniture, interior designer custom projects, Bommanahalli 560068, Bandepalya 560068, Kudlu Gate 560068, HSR Layout 560102, Electronic City 560100, BTM Layout 560076, Madiwala 560068, Hongasandra 560068, Singasandra 560068, Hosur Road, South Bengaluru"

seo_json = """
  <!-- Comprehensive SEO Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": ["FurnitureStore", "LocalBusiness", "B2BBusiness"],
    "name": "Weaver's Crafting",
    "description": "Premium handcrafted furniture store serving multiple industries and locations.",
    "url": "https://weaverscrafting.in/",
    "telephone": "+919742630886",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "201, 10th Cross Road, GPK Layout, Muneshwara Nagar, Bandepalya",
      "addressLocality": "Bommanahalli",
      "addressRegion": "Karnataka",
      "postalCode": "560068",
      "addressCountry": "IN"
    },
    "areaServed": [
      {"@type": "Place", "name": "Bommanahalli", "postalCode": "560068"},
      {"@type": "Place", "name": "Bandepalya", "postalCode": "560068"},
      {"@type": "Place", "name": "Kudlu Gate", "postalCode": "560068"},
      {"@type": "Place", "name": "HSR Layout", "postalCode": "560102"},
      {"@type": "Place", "name": "Electronic City", "postalCode": "560100"},
      {"@type": "Place", "name": "BTM Layout", "postalCode": "560076"},
      {"@type": "Place", "name": "Madiwala", "postalCode": "560068"},
      {"@type": "Place", "name": "Hongasandra", "postalCode": "560068"},
      {"@type": "Place", "name": "Singasandra", "postalCode": "560068"},
      {"@type": "Place", "name": "Koramangala", "postalCode": "560034"}
    ],
    "knowsAbout": [
      "B2B Furniture Solutions",
      "Office & Workspace Furniture",
      "Cafe & Restaurant Seating",
      "Hotel & Lounge Furniture",
      "Custom Interior Design Projects"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Multi-Services & Products",
      "itemListElement": [
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Custom Sofa Manufacturing"}},
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Sofa Cum Bed Construction"}},
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Dining Table Sets"}},
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Beds & Mattresses"}},
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Commercial & B2B Furniture Delivery"}},
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Sofa Repairs & Reupholstery"}}
      ]
    }
  }
  </script>
"""

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 1. Update or Insert Meta Keywords
    if '<meta name="keywords"' in content:
        # replace existing
        content = re.sub(r'<meta name="keywords"[^>]*>', f'<meta name="keywords" content="{keywords}">', content)
    else:
        # insert after description
        desc_pattern = r'<meta name="description"[^>]*>'
        match = re.search(desc_pattern, content)
        if match:
            insert_pos = match.end()
            content = content[:insert_pos] + f'\n  <meta name="keywords" content="{keywords}">' + content[insert_pos:]
    
    # 2. Inject the Comprehensive JSON-LD Schema if not present
    if 'Comprehensive SEO Schema' not in content:
        # insert right before </head>
        content = content.replace('</head>', f'{seo_json}\n</head>')

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
    
    print(f"Optimized SEO for {f}")
