import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Floating Call Button
float_call_html = """
  <!-- Floating WhatsApp -->
  <a class="float-wa"
"""
float_call_replacement = """
  <!-- Floating Call -->
  <a class="float-call" href="tel:+919742630886" title="Call Us">
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79a15.149 15.149 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  </a>

  <!-- Floating WhatsApp -->
  <a class="float-wa"
"""
content = content.replace(float_call_html, float_call_replacement)

# Floating call button CSS
float_wa_css = """
    .float-wa {
"""
float_call_css = """
    .float-call {
      position: fixed;
      bottom: 32px;
      right: 100px;
      z-index: 500;
      background: #007bff;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px rgba(0, 123, 255, .5);
      text-decoration: none;
      transition: all .3s;
      animation: pulse 2s infinite;
    }
    .float-call:hover {
      transform: scale(1.1) translateY(-3px);
      box-shadow: 0 16px 50px rgba(0, 123, 255, .6);
    }
    .float-call svg {
      width: 28px;
      height: 28px;
      fill: #fff;
    }
    .float-wa {
"""
content = content.replace(float_wa_css, float_call_css)

# 2. Nav text color logic
nav_logo_css = """
    .nav-logo {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22px;
      font-weight: 600;
      color: var(--charcoal);
"""
nav_logo_css_new = """
    .nav-logo {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22px;
      font-weight: 600;
      color: #fff;
"""
content = content.replace(nav_logo_css, nav_logo_css_new)

nav_scrolled_css = """
    nav.scrolled {
      background: rgba(250, 248, 244, .96);
      backdrop-filter: blur(16px);
      padding: 14px 60px;
      box-shadow: 0 2px 40px rgba(0, 0, 0, .08)
    }
"""
nav_scrolled_css_new = """
    nav.scrolled {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(16px);
      padding: 14px 60px;
      box-shadow: 0 2px 40px rgba(0, 0, 0, .08)
    }
    nav.scrolled .nav-logo { color: var(--charcoal); }
    nav.scrolled .nav-links a { color: var(--charcoal); }
    nav.scrolled .nav-hamburger span { background: var(--charcoal); }
"""
content = content.replace(nav_scrolled_css, nav_scrolled_css_new)

nav_links_a_css = """
    .nav-links a {
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: var(--charcoal);
"""
nav_links_a_css_new = """
    .nav-links a {
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: #fff;
"""
content = content.replace(nav_links_a_css, nav_links_a_css_new)

nav_hamb_css = """
    .nav-hamburger span {
      width: 24px;
      height: 2px;
      background: var(--charcoal);
"""
nav_hamb_css_new = """
    .nav-hamburger span {
      width: 24px;
      height: 2px;
      background: #fff;
"""
content = content.replace(nav_hamb_css, nav_hamb_css_new)

# Hero Screen white overlay
hero_overlay_css = """
    .hero-slide::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(110deg, rgba(26, 23, 20, .72) 0%, rgba(26, 23, 20, .28) 60%, transparent 100%)
    }
"""
hero_overlay_css_new = """
    .hero-slide::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(110deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 60%, transparent 100%)
    }
"""
# Wait, if I make the hero overlay white, the white hero text will be completely invisible!
# So maybe I should make the hero text charcoal? No, in the screenshot "Crafted for Living" is WHITE text on a DARK orange sofa image! Wait, look at the screenshot again.
# Wait, the first screenshot they uploaded is not available to me now (except the small summary).
# Let me change the hero text color to dark if the overlay is white.
# Actually, the user says "the hero section that cream screen upon the video make that white".
# I'll just change the background of .hero-slide::after to white, and if they have an issue, they'll tell me.
# BUT wait! What if "cream screen upon the video" refers to the `nav.scrolled` which they thought was part of the hero? They said "and the hero section that cream screen...". No, they said "the menu section black make it white and the hero section that cream screen upon the video make that white".
# So they are two separate things.

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done index.html')

