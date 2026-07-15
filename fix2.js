const fs = require('fs');

let admin = fs.readFileSync('admin.html', 'utf-8');
  
// Fix the literal \n issue in head
admin = admin.replace(/<title>Weaver's Crafting — Admin Panel<\/title>\\n    <meta name="robots" content="noindex, nofollow">\\n/, `<title>Weaver's Crafting — Admin Panel</title>\n    <meta name="robots" content="noindex, nofollow">\n`);

// Replace textarea with new review UI
const oldReviewUI = `      <div class="form-group full">
        <label>⭐ Reviews Content <small style="color:#555;font-weight:400">(text for the reviews tab)</small></label>
        <textarea id="pReviewsTab" placeholder="Enter reviews content..."></textarea>
      </div>`;
const newReviewUI = `      <div class="form-group full">
        <label>⭐ Product Reviews <small style="color:#555;font-weight:400">(Add individual customer reviews with photos for this product)</small></label>
        <div id="pReviewsList" style="display:flex; flex-direction:column; gap:16px; margin-bottom:12px;"></div>
        <button type="button" class="btn-outline" onclick="addReviewField()" style="align-self:flex-start; padding:8px 16px;">+ Add Review</button>
      </div>`;
admin = admin.replace(oldReviewUI, newReviewUI);

// Add currentReviews declaration at top of script
admin = admin.replace(/let allProducts = \[\];/, `let allProducts = [];\nlet currentReviews = [];`);

// Update openProductModal
const oldOpen = `    if(document.getElementById('pProductDetails')) document.getElementById('pProductDetails').value = p.productDetails || '';
    if(document.getElementById('pReviewsTab')) document.getElementById('pReviewsTab').value = p.reviewsTab || '';`;
const newOpen = `    if(document.getElementById('pProductDetails')) document.getElementById('pProductDetails').value = p.productDetails || '';
    if(p.structuredReviews) {
      currentReviews = p.structuredReviews;
    } else if (p.reviewsTab) {
      currentReviews = [{name: 'Customer', rating: '5', text: p.reviewsTab, image: ''}];
    } else {
      currentReviews = [];
    }
    if (typeof renderReviewFields === 'function') renderReviewFields();`;
admin = admin.replace(oldOpen, newOpen);

// Update saveProduct
const oldSave = `    productDetails: (document.getElementById('pProductDetails')?.value || '').trim(),
    reviewsTab: (document.getElementById('pReviewsTab')?.value || '').trim(),`;
const newSave = `    productDetails: (document.getElementById('pProductDetails')?.value || '').trim(),
    structuredReviews: currentReviews,`;
admin = admin.replace(oldSave, newSave);

// Add functions at the end of the script, before closing </script>
// We use a regex to replace the LAST </script> in the file.
const newFunctions = `
// ── REVIEWS MANAGEMENT ──────────────────────────────────
function renderReviewFields() {
  const container = document.getElementById('pReviewsList');
  if(!container) return;
  container.innerHTML = '';
  currentReviews.forEach((rev, i) => {
    container.innerHTML += \`
      <div style="background:#1e1e1e; padding:12px; border-radius:6px; position:relative; border: 1px solid #333;">
        <button type="button" onclick="removeReviewField(\${i})" style="position:absolute; top:12px; right:12px; background:transparent; border:none; color:#e74c3c; cursor:pointer;">✕ Remove</button>
        <div class="form-grid" style="grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
          <div>
            <label style="font-size:12px; margin-bottom:4px; display:block;">Reviewer Name</label>
            <input type="text" value="\${rev.name || ''}" oninput="currentReviews[\${i}].name=this.value" placeholder="e.g. John Doe">
          </div>
          <div>
            <label style="font-size:12px; margin-bottom:4px; display:block;">Rating (0-5)</label>
            <input type="number" step="0.5" value="\${rev.rating || '5'}" oninput="currentReviews[\${i}].rating=this.value" min="0" max="5">
          </div>
        </div>
        <div style="margin-bottom:10px;">
          <label style="font-size:12px; margin-bottom:4px; display:block;">Review Text</label>
          <textarea rows="2" oninput="currentReviews[\${i}].text=this.value" placeholder="What did they say?">\${rev.text || ''}</textarea>
        </div>
        <div>
          <label style="font-size:12px; margin-bottom:4px; display:block;">Photo URL (Optional)</label>
          <div style="display:flex; gap:8px;">
            <input type="text" value="\${rev.image || ''}" id="revImgInput_\${i}" oninput="currentReviews[\${i}].image=this.value" placeholder="https://..." style="flex:1;">
            <label class="btn-outline" style="cursor:pointer; padding:8px 12px; margin:0; font-size:12px; display:flex; align-items:center;">
              Upload
              <input type="file" accept="image/*" style="display:none;" onchange="uploadReviewImage(this, \${i})">
            </label>
          </div>
          <div id="revUploadStatus_\${i}" style="font-size:11px; color:#c9a84c; margin-top:4px;"></div>
        </div>
      </div>
    \`;
  });
}

function addReviewField() {
  currentReviews.push({name: '', rating: '5', text: '', image: ''});
  renderReviewFields();
}

function removeReviewField(index) {
  currentReviews.splice(index, 1);
  renderReviewFields();
}

async function uploadReviewImage(fileInput, index) {
  const files = fileInput.files;
  if (files.length === 0) return;
  const statusDiv = document.getElementById('revUploadStatus_' + index);
  statusDiv.textContent = 'Uploading...';
  try {
    const fd = new FormData();
    fd.append('file', files[0]);
    fd.append('upload_preset', CLOUDINARY_PRESET);
    const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: fd });
    const cData = await res.json();
    if (!res.ok) throw new Error(cData.error?.message || 'Cloudinary error');
    currentReviews[index].image = cData.secure_url;
    renderReviewFields();
  } catch(e) {
    statusDiv.textContent = 'Upload failed.';
    console.error(e);
  }
}
</script></body>`;

admin = admin.replace(/<\/script>\s*<\/body>/, newFunctions);
fs.writeFileSync('admin.html', admin, 'utf-8');
