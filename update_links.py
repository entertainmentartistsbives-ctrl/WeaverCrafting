import glob

for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = content.replace('href="products.html"', 'href="/products/sofa"')
    content = content.replace('href="/products.html"', 'href="/products/sofa"')
    content = content.replace("window.location.href='products.html'", "window.location.href='/products/sofa'")
    content = content.replace("window.location.href = returnTo || 'products.html'", "window.location.href = returnTo || '/products/sofa'")
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
