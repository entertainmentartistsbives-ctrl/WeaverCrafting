import os

filepath = 'products.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_logic = """let activeCategory = 'sofa';
const pathParts = window.location.pathname.split('/').filter(Boolean);
if (pathParts[0] === 'products' && pathParts[1]) {
  activeCategory = pathParts[1];
}"""

new_logic = """let activeCategory = 'sofa';
const pathParts = window.location.pathname.split('/').filter(Boolean);
if (pathParts[0] === 'products' && pathParts[1]) {
  activeCategory = pathParts[1];
} else if (pathParts[0] === 'products' && !pathParts[1]) {
  history.replaceState(null, '', '/products/sofa');
}"""

content = content.replace(old_logic, new_logic)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated products default URL redirect!")
