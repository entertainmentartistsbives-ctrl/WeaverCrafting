import glob
import re

# 1. Fix absolute paths back to relative paths
def fix_relative_paths(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = [
        ('href="/styles/', 'href="styles/'),
        ('src="/js/', 'src="js/'),
        ('src="/logo.svg"', 'src="logo.svg"'),
        ('src="/logo.png"', 'src="logo.png"'),
        ('src="/config.js"', 'src="config.js"'),
        ('href="/favicon.png"', 'href="favicon.png"'),
        ('href="/index.html"', 'href="index.html"'),
        ('href="/products.html"', 'href="products.html"'),
        ('href="/about.html"', 'href="about.html"'),
        ('href="/contact.html"', 'href="contact.html"'),
        ('href="/b2b.html"', 'href="b2b.html"'),
        ('href="/gallery.html"', 'href="gallery.html"'),
        ('href="/craftsmanship.html"', 'href="craftsmanship.html"'),
        ('href="/customer-login.html"', 'href="customer-login.html"'),
        ("src='/logo.png'", "src='logo.png'")
    ]
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for html_file in glob.glob('*.html'):
    fix_relative_paths(html_file)

# 2. Revert URL rewriting logic back to ?id=... in index.html and products.html
with open('index.html', 'r', encoding='utf-8') as f:
    idx_content = f.read()

# Fix index.html JS
idx_content = re.sub(
    r"const urlSlug = p\.name \? p\.name.*?const productUrl = `/product/\$\{p\.category \|\| 'misc'\}/\$\{urlSlug\}`;",
    "",
    idx_content,
    flags=re.DOTALL
)
idx_content = idx_content.replace(
    "onclick=\"window.location.href='${productUrl}'\"",
    "onclick=\"window.location.href='product-detail.html?id=${p.id}'\""
)
idx_content = idx_content.replace(
    "<a href=\"${productUrl}\" class=\"product-view-btn\">",
    "<a href=\"product-detail.html?id=${p.id}\" class=\"product-view-btn\">"
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(idx_content)

with open('products.html', 'r', encoding='utf-8') as f:
    prod_content = f.read()

# Fix products.html JS
prod_content = re.sub(
    r"const urlSlug = p\.name \? p\.name.*?const productUrl = `/product/\$\{p\.category \|\| 'misc'\}/\$\{urlSlug\}`;",
    "",
    prod_content,
    flags=re.DOTALL
)
prod_content = prod_content.replace(
    "<a href=\"${productUrl}\" class=\"btn-outline\">View Details</a>",
    "<a href=\"product-detail.html?id=${p.id}\" class=\"btn-outline\">View Details</a>"
)

with open('products.html', 'w', encoding='utf-8') as f:
    f.write(prod_content)
    
print("Reverted to query params and relative paths!")
