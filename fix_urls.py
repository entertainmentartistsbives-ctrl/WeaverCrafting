import re

# Update products.html
with open('products.html', 'r', encoding='utf-8') as f:
    products_html = f.read()

# Replace link to product details
products_html = products_html.replace(
    '<a href="product-detail.html?id=${p.id}" class="btn-outline">View Details</a>',
    '<a href="/product/${p.category}/${p.id}" class="btn-outline">View Details</a>'
)

# Update active category logic
old_category_logic = """// Active tab and products rendering state
let activeCategory = 'sofa';
let selectedProductToCart = null;"""

new_category_logic = """// Active tab and products rendering state
let activeCategory = 'sofa';
const pathParts = window.location.pathname.split('/').filter(Boolean);
if (pathParts[0] === 'products' && pathParts[1]) {
  activeCategory = pathParts[1];
}
let selectedProductToCart = null;
"""
products_html = products_html.replace(old_category_logic, new_category_logic)

# Update selectCategory to use pushState
old_select_category = """function selectCategory(category) {
  activeCategory = category;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  renderProducts();
}"""

new_select_category = """function selectCategory(category, el) {
  activeCategory = category;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  if (el) el.classList.add('active');
  else if (event && event.target) event.target.classList.add('active');
  
  // Update URL for SEO/Sharing without reloading
  history.pushState(null, '', '/products/' + category);
  
  renderProducts();
}"""
products_html = products_html.replace(old_select_category, new_select_category)

# Update initial tab active state assignment in DOMContentLoaded or similar?
# If there's an initialization logic, I'll see if I need to change it.
# Usually, we just call selectCategory on load, or we set the active class on load.
# Let's see if there is an initialization.
old_init = "renderProducts();"
new_init = """// Set active tab on load
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.classList.remove('active');
  if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(activeCategory)) {
    btn.classList.add('active');
  }
});
renderProducts();"""
# wait, there's multiple renderProducts() calls, let's just do it in script load.

with open('products.html', 'w', encoding='utf-8') as f:
    f.write(products_html)

# Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

index_html = index_html.replace(
    "onclick=\"window.location.href='product-detail.html?id=${p.id}'\"",
    "onclick=\"window.location.href='/product/${p.category}/${p.id}'\""
)
index_html = index_html.replace(
    '<a href="product-detail.html?id=${p.id}" class="product-view-btn">',
    '<a href="/product/${p.category}/${p.id}" class="product-view-btn">'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_html)

print("Updated URLs successfully!")
