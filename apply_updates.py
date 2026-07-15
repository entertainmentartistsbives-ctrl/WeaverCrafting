import glob
import re

# 1. Update all WhatsApp buttons to gold
for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace(
        '<a href="https://wa.me/919742630886" target="_blank" class="nav-cta">📱 WhatsApp Us</a>',
        '<a href="https://wa.me/919742630886" target="_blank" class="nav-cta" style="background:var(--gold);color:var(--charcoal);">📱 WhatsApp Us</a>'
    )
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated WA button in {filepath}")

# 2. Remove SEO local text from index.html
with open('index.html', 'r', encoding='utf-8') as f:
    idx_content = f.read()

seo_start = idx_content.find('<!-- SEO LOCAL AREA TEXT (visible, keyword-rich) -->')
seo_end = idx_content.find('</section>', seo_start)
if seo_start != -1 and seo_end != -1:
    idx_content = idx_content[:seo_start] + idx_content[seo_end+10:]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(idx_content)
    print("Removed SEO text from index.html")

# 3. Update product-detail.html with variant selection logic
with open('product-detail.html', 'r', encoding='utf-8') as f:
    pd_content = f.read()

# Add variant options HTML
pd_html_to_replace = """      <div class="product-features" style="margin-bottom: 24px; padding: 16px; background: rgba(201, 168, 76, 0.05); border: 1px solid rgba(201, 168, 76, 0.15); border-radius: 8px;">
        <h4 style="margin-top: 0; margin-bottom: 12px; color: var(--charcoal); font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Product Features</h4>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 15px; color: var(--text-color);">
          <div class="feature-item"><strong>Size:</strong> <span id="featSize">--</span></div>
          <div class="feature-item"><strong>Color:</strong> <span id="featColor">--</span></div>
          <div class="feature-item"><strong>Material:</strong> <span id="featMaterial">--</span></div>
          <div class="feature-item"><strong>Wood Type:</strong> <span id="featWood">--</span></div>
        </div>
      </div>



      <div class="variant-selector">"""

pd_html_new = """      <div class="product-features" style="margin-bottom: 24px; padding: 16px; background: rgba(201, 168, 76, 0.05); border: 1px solid rgba(201, 168, 76, 0.15); border-radius: 8px;">
        <h4 style="margin-top: 0; margin-bottom: 12px; color: var(--charcoal); font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Product Features</h4>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 15px; color: var(--text-color);">
          <div class="feature-item"><strong>Size:</strong> <span id="featSize">--</span></div>
          <div class="feature-item"><strong>Color:</strong> <span id="featColor">--</span></div>
          <div class="feature-item"><strong>Material:</strong> <span id="featMaterial">--</span></div>
          <div class="feature-item"><strong>Wood Type:</strong> <span id="featWood">--</span></div>
        </div>
      </div>

      <div id="variantSelectorsContainer">
        <div class="variant-selector" id="sizeSelectorWrap" style="display:none;">
          <span class="variant-label">Size</span>
          <div class="variant-options" id="sizeOptions"></div>
        </div>
        <div class="variant-selector" id="colorSelectorWrap" style="display:none;">
          <span class="variant-label">Color</span>
          <div class="variant-options" id="colorOptions"></div>
        </div>
        <div class="variant-selector" id="materialSelectorWrap" style="display:none;">
          <span class="variant-label">Material</span>
          <div class="variant-options" id="materialOptions"></div>
        </div>
        <div class="variant-selector" id="woodSelectorWrap" style="display:none;">
          <span class="variant-label">Wood Type</span>
          <div class="variant-options" id="woodOptions"></div>
        </div>
      </div>

      <div class="variant-selector">"""
pd_content = pd_content.replace(pd_html_to_replace, pd_html_new)


# Insert callback functions before initProductDetailUI
pd_js_to_replace = """// Initialize product detail UI
function initProductDetailUI() {"""

pd_js_new = """
function onSizeSelect(val) {
  selectedSize = val;
  document.getElementById('featSize').innerText = val;
  if (activeProduct && activeProduct.sizes && activeProduct.images) {
    const idx = activeProduct.sizes.indexOf(val);
    if (idx !== -1 && idx < activeProduct.images.length) {
      const url = activeProduct.images[idx];
      document.getElementById('detailMainImg').src = url;
      const thumbs = document.querySelectorAll('.detail-gallery__thumb');
      if(thumbs.length > idx) {
        thumbs.forEach(t => t.classList.remove('active'));
        thumbs[idx].classList.add('active');
      }
    }
  }
}
function onColorSelect(val) { selectedColor = val; document.getElementById('featColor').innerText = val; }
function onMaterialSelect(val) { selectedMaterial = val; document.getElementById('featMaterial').innerText = val; }
function onWoodSelect(val) { selectedWoodType = val; document.getElementById('featWood').innerText = val; }

// Initialize product detail UI
function initProductDetailUI() {"""
pd_content = pd_content.replace(pd_js_to_replace, pd_js_new)

# Update initProductDetailUI to call renderVariantButtons
pd_init_to_replace = """  // Set Feature Text and Selected Variables
  selectedSize = activeProduct.sizes && activeProduct.sizes.length > 0 ? activeProduct.sizes.join(', ') : 'N/A';
  selectedColor = activeProduct.colors && activeProduct.colors.length > 0 ? activeProduct.colors.join(', ') : 'N/A';
  selectedMaterial = activeProduct.materials && activeProduct.materials.length > 0 ? activeProduct.materials.join(', ') : 'N/A';
  selectedWoodType = activeProduct.woodTypes && activeProduct.woodTypes.length > 0 ? activeProduct.woodTypes.join(', ') : 'N/A';

  document.getElementById('featSize').innerText = selectedSize;
  document.getElementById('featColor').innerText = selectedColor;
  document.getElementById('featMaterial').innerText = selectedMaterial;
  document.getElementById('featWood').innerText = selectedWoodType;"""

pd_init_new = """  // Set Feature Text and Selected Variables (defaults to N/A if missing)
  document.getElementById('featSize').innerText = 'N/A';
  document.getElementById('featColor').innerText = 'N/A';
  document.getElementById('featMaterial').innerText = 'N/A';
  document.getElementById('featWood').innerText = 'N/A';

  if (activeProduct.sizes && activeProduct.sizes.length > 0) {
    document.getElementById('sizeSelectorWrap').style.display = 'block';
    renderVariantButtons('sizeOptions', activeProduct.sizes, 'onSizeSelect');
    setDefaultSelection('sizeOptions', activeProduct.sizes[0], onSizeSelect);
  } else {
    document.getElementById('sizeSelectorWrap').style.display = 'none';
  }

  if (activeProduct.colors && activeProduct.colors.length > 0) {
    document.getElementById('colorSelectorWrap').style.display = 'block';
    renderVariantButtons('colorOptions', activeProduct.colors, 'onColorSelect');
    setDefaultSelection('colorOptions', activeProduct.colors[0], onColorSelect);
  } else {
    document.getElementById('colorSelectorWrap').style.display = 'none';
  }

  if (activeProduct.materials && activeProduct.materials.length > 0) {
    document.getElementById('materialSelectorWrap').style.display = 'block';
    renderVariantButtons('materialOptions', activeProduct.materials, 'onMaterialSelect');
    setDefaultSelection('materialOptions', activeProduct.materials[0], onMaterialSelect);
  } else {
    document.getElementById('materialSelectorWrap').style.display = 'none';
  }

  if (activeProduct.woodTypes && activeProduct.woodTypes.length > 0) {
    document.getElementById('woodSelectorWrap').style.display = 'block';
    renderVariantButtons('woodOptions', activeProduct.woodTypes, 'onWoodSelect');
    setDefaultSelection('woodOptions', activeProduct.woodTypes[0], onWoodSelect);
  } else {
    document.getElementById('woodSelectorWrap').style.display = 'none';
  }"""
pd_content = pd_content.replace(pd_init_to_replace, pd_init_new)

# Fix renderVariantButtons syntax
pd_content = re.sub(
    r"onclick=\"selectVariant\(this, '\$\{containerId\}', '\$\{opt\}', \$\{onSelectCallback\}\)\"",
    r"onclick=\"selectVariant(this, '${containerId}', '${opt}', ${onSelectCallback})\"",
    pd_content
)

with open('product-detail.html', 'w', encoding='utf-8') as f:
    f.write(pd_content)

print("Updated product-detail.html")
