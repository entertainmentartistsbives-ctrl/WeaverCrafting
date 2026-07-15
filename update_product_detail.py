import re

with open('product-detail.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix renderVariantButtons
content = re.sub(
    r"onclick=\"selectVariant\(this, '\$\{containerId\}', '\$\{opt\}', \$\{onSelectCallback\}\)\"",
    r"onclick=\"selectVariant(this, '${containerId}', '${opt}', ${onSelectCallback})\"",
    content
)
# Actually, I should just pass the string of the function name.
content = content.replace(
    "${onSelectCallback})\"",
    "${onSelectCallback})\""
) # Wait, if onSelectCallback is passed as 'onSizeSelect' (a string), then ${onSelectCallback} interpolates to `onSizeSelect` without quotes.
# So `onclick="selectVariant(this, 'sizeOptions', '1 seater', onSizeSelect)"` which is valid JavaScript! The function name is a variable reference.

# Insert the callback functions right before initProductDetailUI
callbacks_code = """
let selectedColor = "";
let selectedMaterial = "";
let selectedWoodType = "";

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

function initProductDetailUI() {
"""
content = content.replace("function initProductDetailUI() {", callbacks_code)

# Now, update initProductDetailUI to call renderVariantButtons instead of just setting the text
old_feat_code = """  // Set Feature Text and Selected Variables
  selectedSize = activeProduct.sizes && activeProduct.sizes.length > 0 ? activeProduct.sizes.join(', ') : 'N/A';
  selectedColor = activeProduct.colors && activeProduct.colors.length > 0 ? activeProduct.colors.join(', ') : 'N/A';
  selectedMaterial = activeProduct.materials && activeProduct.materials.length > 0 ? activeProduct.materials.join(', ') : 'N/A';
  selectedWoodType = activeProduct.woodTypes && activeProduct.woodTypes.length > 0 ? activeProduct.woodTypes.join(', ') : 'N/A';

  document.getElementById('featSize').innerText = selectedSize;
  document.getElementById('featColor').innerText = selectedColor;
  document.getElementById('featMaterial').innerText = selectedMaterial;
  document.getElementById('featWood').innerText = selectedWoodType;"""

new_feat_code = """  // Set Feature Text and Selected Variables (defaults to N/A if missing)
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
content = content.replace(old_feat_code, new_feat_code)

with open('product-detail.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated product-detail.html with variant selectors and logic")
