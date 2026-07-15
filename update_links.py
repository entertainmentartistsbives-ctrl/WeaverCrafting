import re

# Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add URL generation logic in index.html inside renderProducts
content = content.replace(
    "const badgeHtml = p.badge ? `<div class=\"product-tag\">${p.badge}</div>` : '';",
    """const badgeHtml = p.badge ? `<div class=\"product-tag\">${p.badge}</div>` : '';
        const urlSlug = p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : p.id;
        const productUrl = `/product/${p.category || 'misc'}/${urlSlug}`;"""
)
content = content.replace(
    "onclick=\"window.location.href='product-detail.html?id=${p.id}'\"",
    "onclick=\"window.location.href='${productUrl}'\""
)
content = content.replace(
    "<a href=\"product-detail.html?id=${p.id}\" class=\"product-view-btn\">",
    "<a href=\"${productUrl}\" class=\"product-view-btn\">"
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)


# Update products.html
with open('products.html', 'r', encoding='utf-8') as f:
    p_content = f.read()

p_content = p_content.replace(
    "const badgeHtml = p.badge ? `<div class=\"product-card__badge\">${p.badge}</div>` : '';",
    """const badgeHtml = p.badge ? `<div class=\"product-card__badge\">${p.badge}</div>` : '';
    const urlSlug = p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : p.id;
    const productUrl = `/product/${p.category || 'misc'}/${urlSlug}`;"""
)
p_content = p_content.replace(
    "<a href=\"product-detail.html?id=${p.id}\" class=\"btn-outline\">View Details</a>",
    "<a href=\"${productUrl}\" class=\"btn-outline\">View Details</a>"
)

with open('products.html', 'w', encoding='utf-8') as f:
    f.write(p_content)

print("Updated links in index.html and products.html")
