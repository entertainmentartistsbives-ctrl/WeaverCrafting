import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

hero_overlay_css = """    .hero-slide::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(110deg, rgba(26, 23, 20, .72) 0%, rgba(26, 23, 20, .28) 60%, transparent 100%)
    }"""
hero_overlay_css_new = """    .hero-slide::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(110deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 60%, transparent 100%)
    }"""
if hero_overlay_css in content:
    content = content.replace(hero_overlay_css, hero_overlay_css_new)
    print("Replaced hero overlay")
else:
    print("Could not find hero overlay css block")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done index.html hero')
