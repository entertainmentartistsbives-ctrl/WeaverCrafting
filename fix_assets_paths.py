import glob

def fix_paths(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # CSS / JS / Images
    replacements = [
        ('href="styles/', 'href="/styles/'),
        ('src="js/', 'src="/js/'),
        ('src="logo.svg"', 'src="/logo.svg"'),
        ('src="logo.png"', 'src="/logo.png"'),
        ('src="config.js"', 'src="/config.js"'),
        ('href="favicon.png"', 'href="/favicon.png"'),
        ('href="index.html"', 'href="/index.html"'),
        ('href="products.html"', 'href="/products.html"'),
        ('href="about.html"', 'href="/about.html"'),
        ('href="contact.html"', 'href="/contact.html"'),
        ('href="b2b.html"', 'href="/b2b.html"'),
        ('href="gallery.html"', 'href="/gallery.html"'),
        ('href="craftsmanship.html"', 'href="/craftsmanship.html"'),
        ('href="customer-login.html"', 'href="/customer-login.html"'),
        ('src=\'logo.png\'', 'src=\'/logo.png\''),
    ]

    new_content = content
    for old, new in replacements:
        new_content = new_content.replace(old, new)
        
    # Make sure we didn't double up slashes (e.g. href="//styles/")
    new_content = new_content.replace('href="//', 'href="/')
    new_content = new_content.replace('src="//', 'src="/')
    # except for http/https
    new_content = new_content.replace('href="/http', 'href="http')
    new_content = new_content.replace('src="/http', 'src="http')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed absolute paths in {filepath}")

for html_file in glob.glob('*.html'):
    fix_paths(html_file)

# Update .htaccess for product routing
htaccess_rule = """
<IfModule mod_rewrite.c>
  RewriteEngine On
  # Proxy sitemap.xml
  RewriteRule ^sitemap\.xml$ https://owgqxbgjmoqlhzztvety.supabase.co/storage/v1/object/public/site/sitemap.xml [P,L]
  
  # Product URLs
  RewriteRule ^product/.*$ product-detail.html [L]
  RewriteRule ^category/.*$ products.html [L]
</IfModule>
"""
with open('.htaccess', 'w', encoding='utf-8') as f:
    f.write(htaccess_rule)
print("Updated .htaccess")

