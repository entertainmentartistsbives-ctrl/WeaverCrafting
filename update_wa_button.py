import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace(
        '<a href="https://wa.me/919742630886" target="_blank" class="nav-cta">📱 WhatsApp Us</a>',
        '<a href="https://wa.me/919742630886" target="_blank" class="nav-cta" style="background:var(--gold);color:var(--charcoal);">📱 WhatsApp Us</a>'
    )
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
