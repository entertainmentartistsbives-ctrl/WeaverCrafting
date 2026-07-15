import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Change nav links to black
content = re.sub(
    r'(\.nav-links a\s*\{[^}]*color:\s*)#fff',
    r'\g<1>var(--charcoal)',
    content
)
# Change mobile hamburger to black
content = re.sub(
    r'(\.nav-hamburger span\s*\{[^}]*background:\s*)#fff',
    r'\g<1>var(--charcoal)',
    content
)
# Change hero badge text to black
content = re.sub(
    r'(\.hero-badge span\s*\{[^}]*color:\s*)#fff',
    r'\g<1>var(--charcoal)',
    content
)
# Change hero title to black
content = re.sub(
    r'(\.hero-title\s*\{[^}]*color:\s*)#fff',
    r'\g<1>var(--charcoal)',
    content
)
# Change hero subtitle to black
content = re.sub(
    r'(\.hero-sub\s*\{[^}]*color:\s*)rgba\(255,\s*255,\s*255,\s*0\.9\)',
    r'\g<1>var(--charcoal)',
    content
)
# Change hero scroll text to black
content = re.sub(
    r'(\.hero-scroll\s*\{[^}]*color:\s*)rgba\(255,\s*255,\s*255,\s*0\.6\)',
    r'\g<1>var(--charcoal)',
    content
)
# Change hero scroll line to black
content = re.sub(
    r'(\.scroll-line\s*\{[^}]*background:\s*)rgba\(255,\s*255,\s*255,\s*0\.3\)',
    r'\g<1>rgba(42, 40, 38, 0.3)',
    content
)

# btn outline on hero
content = re.sub(
    r'(\.btn-outline\s*\{[^}]*border:\s*1\.5px solid\s*)#fff([^}]*color:\s*)#fff',
    r'\g<1>var(--charcoal)\g<2>var(--charcoal)',
    content
)
content = re.sub(
    r'(\.btn-outline:hover\s*\{[^}]*border-color:\s*)#fff([^}]*background:\s*)rgba\(255,\s*255,\s*255,\s*0\.1\)',
    r'\g<1>var(--charcoal)\g<2>rgba(42, 40, 38, 0.05)',
    content
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated index.html CSS for dark text in hero")
