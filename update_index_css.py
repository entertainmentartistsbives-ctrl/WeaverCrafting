import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update .float-call
content = re.sub(
    r'\.float-call\s*\{[^}]*\}',
    '''.float-call {
      position: fixed;
      bottom: 104px;
      right: 32px;
      z-index: 500;
      background: var(--gold);
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px rgba(201, 168, 76, .5);
      text-decoration: none;
      transition: all .3s;
    }''',
    content
)

# 2. Update .float-wa
content = re.sub(
    r'\.float-wa\s*\{[^}]*\}',
    '''.float-wa {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 500;
      background: var(--gold);
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px rgba(201, 168, 76, .5);
      text-decoration: none;
      transition: all .3s;
      animation: waPulse 3s ease-in-out infinite
    }''',
    content
)

# Also update the box shadow on hover for float-call
content = re.sub(
    r'(\.float-call:hover\s*\{[^}]*box-shadow:\s*)0 16px 50px rgba\(0, 123, 255, \.6\)',
    r'\g<1>0 16px 50px rgba(201, 168, 76, .6)',
    content
)

# Update hover box-shadow for float-wa
content = re.sub(
    r'(\.float-wa:hover\s*\{[^}]*box-shadow:\s*)0 16px 50px rgba\(37, 211, 102, \.6\)',
    r'\g<1>0 16px 50px rgba(201, 168, 76, .6)',
    content
)

# Revert Hero / Nav colors to white
content = re.sub(
    r'(\.nav-links a\s*\{[^}]*color:\s*)var\(--charcoal\)',
    r'\g<1>#fff',
    content
)
content = re.sub(
    r'(\.nav-hamburger span\s*\{[^}]*background:\s*)var\(--charcoal\)',
    r'\g<1>#fff',
    content
)
content = re.sub(
    r'(\.hero-badge span\s*\{[^}]*color:\s*)var\(--charcoal\)',
    r'\g<1>#fff',
    content
)
content = re.sub(
    r'(\.hero-title\s*\{[^}]*color:\s*)var\(--charcoal\)',
    r'\g<1>#fff',
    content
)
content = re.sub(
    r'(\.hero-sub\s*\{[^}]*color:\s*)var\(--muted\)',
    r'\g<1>rgba(255, 255, 255, 0.9)',
    content
)
content = re.sub(
    r'(\.hero-scroll\s*\{[^}]*color:\s*)rgba\(42, 40, 38, \.6\)',
    r'\g<1>rgba(255, 255, 255, 0.6)',
    content
)
content = re.sub(
    r'(\.scroll-line\s*\{[^}]*background:\s*)rgba\(42, 40, 38, \.3\)',
    r'\g<1>rgba(255, 255, 255, 0.3)',
    content
)

# btn outline on hero
content = re.sub(
    r'(\.btn-outline\s*\{[^}]*border:\s*1\.5px solid\s*)var\(--charcoal\)([^}]*color:\s*)var\(--charcoal\)',
    r'\g<1>#fff\g<2>#fff',
    content
)
content = re.sub(
    r'(\.btn-outline:hover\s*\{[^}]*border-color:\s*)var\(--charcoal\)([^}]*background:\s*)rgba\(42, 40, 38, \.05\)',
    r'\g<1>#fff\g<2>rgba(255, 255, 255, 0.1)',
    content
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated index.html CSS for float buttons and hero colors")
