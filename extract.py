import re
import os

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update navigation links in the content
nav_replacements = {
    'href="#products"': 'href="products.html"',
    'href="#sofa-showcase"': 'href="craftsmanship.html"',
    'href="#gallery"': 'href="gallery.html"',
    'href="#about"': 'href="about.html"',
    'href="#contact"': 'href="contact.html"',
    'href="#hero"': 'href="index.html"',
}
for old, new in nav_replacements.items():
    content = content.replace(old, new)

# 2. Add null checks in JavaScript
script_fixes = [
    ("const grid = document.getElementById('productsGrid');", "const grid = document.getElementById('productsGrid');\nif (grid) {"),
    ("});\n\nlet allVisible", "});\n}\n\nlet allVisible"),
    ("const gg = document.getElementById('galleryGrid');\ngalleryImgs.forEach", "const gg = document.getElementById('galleryGrid');\nif (gg) {\ngalleryImgs.forEach"),
    ("});\n\n// ── LIGHTBOX", "});\n}\n\n// ── LIGHTBOX"),
    ("const track = document.getElementById('testimonialTrack');\n[...testimonials", "const track = document.getElementById('testimonialTrack');\nif(track){\n[...testimonials"),
    ("});\n\n// ── HERO", "});\n}\n\n// ── HERO"),
    ("const slides = document.querySelectorAll('.hero-slide');\nconst dots = document.querySelectorAll('.hero-dot');\nfunction goSlide", "const slides = document.querySelectorAll('.hero-slide');\nconst dots = document.querySelectorAll('.hero-dot');\nif (slides.length > 0) {\nfunction goSlide"),
    ("setInterval(()=>goSlide(slideIdx+1), 5000);\n\n// ── NAV SCROLL", "setInterval(()=>goSlide(slideIdx+1), 5000);\n}\n\n// ── NAV SCROLL")
]
for old, new in script_fixes.items() if isinstance(script_fixes, dict) else script_fixes:
    content = content.replace(old, new)

# Write updated index.html
with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

# 3. Extract common top and bottom
# Top: Everything up to <!-- Hero -->
top_match = re.search(r'(.*?)(?=<!-- Hero -->)', content, re.DOTALL)
top_content = top_match.group(1)

# Bottom: Everything from <!-- Footer --> to end
bottom_match = re.search(r'(<!-- Footer -->.*)', content, re.DOTALL)
bottom_content = bottom_match.group(1)

# Helper function to extract a section
def extract_section(start_comment, end_comment=None):
    if end_comment:
        pattern = f'({start_comment}.*?)(?={end_comment})'
    else:
        # Just grab the section by ID
        # We need a more robust way to grab an HTML section
        pass

# Let's extract based on regex for specific sections
sections = {
    "products.html": r'(<!-- Products -->.*?)(?=<!-- About -->)',
    "craftsmanship.html": r'(<!-- Sofa Showcase -->.*?)(?=<!-- Products -->)',
    "gallery.html": r'(<!-- Gallery -->.*?)(?=<!-- Testimonials -->)',
    "about.html": r'(<!-- About -->.*?)(?=<!-- Services -->)',
    "contact.html": r'(<!-- Contact -->.*?)(?=<!-- ═══════════════════════════════════════════════\s+SEO FAQ SECTION)'
}

for filename, pattern in sections.items():
    match = re.search(pattern, content, re.DOTALL)
    if match:
        section_content = match.group(1)
        # Add padding-top to the first section to avoid nav overlap
        section_content = re.sub(r'<section ', r'<section style="padding-top: 140px;" ', section_content, count=1)
        
        page_html = top_content + section_content + bottom_content
        with open(filename, "w", encoding="utf-8") as f:
            f.write(page_html)
    else:
        print(f"Could not extract section for {filename}")

print("Successfully created subpages.")
