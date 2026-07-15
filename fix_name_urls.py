import os

def replace_in_file(filepath, replacements):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements.items():
        content = content.replace(old, new)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. Update index.html
replace_in_file('index.html', {
    "onclick=\"window.location.href='/product/${p.category}/${p.id}'\"": 
    "onclick=\"window.location.href='/product/${p.category}/' + p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')\"",
    
    '<a href="/product/${p.category}/${p.id}" class="product-view-btn">':
    '<a href="/product/${p.category}/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, \'' + '-' + '\').replace(/(^-|-$)/g, \'' + '' + '\')}" class="product-view-btn">'
})

# 2. Update products.html
replace_in_file('products.html', {
    '<a href="/product/${p.category}/${p.id}" class="btn-outline">View Details</a>':
    '<a href="/product/${p.category}/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, \'' + '-' + '\').replace(/(^-|-$)/g, \'' + '' + '\')}" class="btn-outline">View Details</a>'
})

# 3. Update product-detail.html
pd_replacements = {
    '<a href="/product/${p.category}/${p.id}" class="btn-outline">View Details</a>':
    '<a href="/product/${p.category}/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, \'' + '-' + '\').replace(/(^-|-$)/g, \'' + '' + '\')}" class="btn-outline">View Details</a>',
}

pd_old_logic = """// Determine product from URL query
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
let activeProduct = PRODUCTS.find(p => p.id === productId);"""

pd_new_logic = """// Determine product from URL query or path
const urlParams = new URLSearchParams(window.location.search);
let urlRef = urlParams.get('id');
if (!urlRef) {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  if (pathParts[0] === 'product' && pathParts.length >= 3) {
    urlRef = pathParts[pathParts.length - 1];
  }
}
let activeProduct = PRODUCTS.find(p => 
  p.id === urlRef || 
  (p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === urlRef)
);
let productId = activeProduct ? activeProduct.id : urlRef;"""

pd_replacements[pd_old_logic] = pd_new_logic

pd_old_resolve_1 = "activeProduct = PRODUCTS.find(p => p.id === productId);"
pd_new_resolve_1 = """activeProduct = PRODUCTS.find(p => 
          p.id === urlRef || 
          (p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === urlRef)
        );
        if (activeProduct) productId = activeProduct.id;"""

# Need to be careful to not replace ALL occurrences blindly if there's multiple, but there's two: one for initial load, one for image update.
# Actually, the second one (image update) can just use `activeProduct = PRODUCTS.find(p => p.id === productId);` since productId is already set by then.
# But for the FIRST one (when db products load), `productId` might be the slug if it wasn't found in initial PRODUCTS.
# So let's replace the first one manually.
pd_old_resolve_block = """      if (dbProducts.length > 0) {
        PRODUCTS = dbProducts;
        activeProduct = PRODUCTS.find(p => p.id === productId);
      }"""
pd_new_resolve_block = """      if (dbProducts.length > 0) {
        PRODUCTS = dbProducts;
        activeProduct = PRODUCTS.find(p => 
          p.id === urlRef || 
          (p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === urlRef)
        );
        if (activeProduct) productId = activeProduct.id;
      }"""
pd_replacements[pd_old_resolve_block] = pd_new_resolve_block

replace_in_file('product-detail.html', pd_replacements)

print("Updated product links to use name!")
