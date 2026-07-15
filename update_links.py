import os
import glob

replacements = {
    'href="index.html"': 'href="/"',
    "href='index.html'": "href='/'",
    'href="index.html#': 'href="/#',
    'href="products.html"': 'href="/products"',
    "href='products.html'": "href='/products'",
    'href="craftsmanship.html"': 'href="/craftsmanship"',
    "href='craftsmanship.html'": "href='/craftsmanship'",
    'href="gallery.html"': 'href="/gallery"',
    "href='gallery.html'": "href='/gallery'",
    'href="about.html"': 'href="/about"',
    "href='about.html'": "href='/about'",
    'href="contact.html"': 'href="/contact"',
    "href='contact.html'": "href='/contact'",
    'href="b2b.html"': 'href="/b2b"',
    "href='b2b.html'": "href='/b2b'",
    'href="customer-login.html"': 'href="/customer-login"',
    "href='customer-login.html'": "href='/customer-login'",
    'href="admin-login.html"': 'href="/admin-login"',
    "href='admin-login.html'": "href='/admin-login'",
}

for filepath in glob.glob("*.html"):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
        
print("All HTML files updated with absolute slash paths.")
