import glob
import re

for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Replace whatsapp green with gold
    content = content.replace('#25d366', 'var(--gold)')
    content = content.replace('#20b858', 'var(--gold)')
    content = content.replace('rgba(37,211,102', 'rgba(201,168,76')
    content = content.replace('rgba(37, 211, 102', 'rgba(201, 168, 76')
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
