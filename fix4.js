const fs = require('fs');

let admin = fs.readFileSync('admin.html', 'utf-8');

// The multi_replace_file_content failed on the last chunk, which was inserting the renderReviewFields.
// We just need to insert them before </script> at the end of the file.

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
</script>`;

if (!admin.includes('function renderReviewFields()')) {
  admin = admin.replace(/<\/script>\s*<\/body>/, newFunctions + '\n</body>');
  fs.writeFileSync('admin.html', admin, 'utf-8');
}
