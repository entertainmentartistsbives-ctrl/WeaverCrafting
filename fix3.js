const fs = require('fs');

let pd = fs.readFileSync('product-detail.html', 'utf-8');

// Replace overflow-x:hidden with clip
pd = pd.replace(/overflow-x:hidden/g, 'overflow-x:clip');

// Insert base href
if (!pd.includes('<base href="/">')) {
  pd = pd.replace('<head>', '<head>\n  <base href="/">');
}

// Remove literal \n
pd = pd.replace(/<title>Weaver's Crafting \| Product Details<\/title>\\n/, `<title>Weaver's Crafting | Product Details</title>`);

// Remove detailStars exactly
const starsStart = pd.indexOf('<div class="star-rating" id="detailStars">');
if (starsStart !== -1) {
  const starsEnd = pd.indexOf('</div>', starsStart) + 6;
  pd = pd.substring(0, starsStart) + pd.substring(starsEnd);
}

// Remove detailSpecsGrid exactly
const specsStart = pd.indexOf('<!-- Specifications Grid -->');
if (specsStart !== -1) {
  const specsEnd = pd.indexOf('<!-- Product Features -->');
  pd = pd.substring(0, specsStart) + pd.substring(specsEnd);
}

// Move details tabs rendering (the structuredReviews logic)
const oldTabs = `  const pDetails = activeProduct.productDetails || '';
  const pReviews = activeProduct.reviewsTab || '';
  const pFaqs = activeProduct.faqs || '';
  
  if (pDetails || pReviews || pFaqs) {
    document.getElementById('productTabsSection').style.display = 'block';
    document.getElementById('pane-details').innerHTML = pDetails.replace(/\\n/g, '<br>') || 'No details available.';
    document.getElementById('pane-reviews').innerHTML = pReviews.replace(/\\n/g, '<br>') || 'No reviews available.';
    document.getElementById('pane-faqs').innerHTML = pFaqs.replace(/\\n/g, '<br>') || 'No FAQs available.';
  } else {
    document.getElementById('productTabsSection').style.display = 'none';
  }`;

const newTabs = `  const pDetails = activeProduct.productDetails || '';
  const pReviews = activeProduct.structuredReviews || (activeProduct.reviewsTab ? [{name: 'Customer', rating: '5', text: activeProduct.reviewsTab, image: ''}] : []);
  const pFaqs = activeProduct.faqs || '';
  
  if (pDetails || pReviews.length > 0 || pFaqs) {
    document.getElementById('productTabsSection').style.display = 'block';
    document.getElementById('pane-details').innerHTML = pDetails.replace(/\\n/g, '<br>') || 'No details available.';
    
    let reviewsHtml = '';
    if (pReviews.length > 0) {
      reviewsHtml = pReviews.map(rev => \`
        <div style="background:rgba(201,168,76,0.05); border:1px solid rgba(201,168,76,0.15); padding:16px; border-radius:8px; margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <strong style="color:var(--charcoal); font-size:16px;">\${rev.name || 'Anonymous Customer'}</strong>
            <span style="color:#d4af37; font-size:14px;">\${'★'.repeat(Math.floor(rev.rating))}\${rev.rating % 1 !== 0 ? '½' : ''}</span>
          </div>
          <p style="color:var(--text-color); margin:0 0 12px 0; font-size:14.5px; line-height:1.6;">\${rev.text ? rev.text.replace(/\\n/g, '<br>') : ''}</p>
          \${rev.image ? \`<img src="\${rev.image}" style="max-width:200px; max-height:200px; border-radius:6px; object-fit:cover; border:1px solid #ddd;" onerror="this.style.display='none'">\` : ''}
        </div>
      \`).join('');
    } else {
      reviewsHtml = 'No reviews available.';
    }
    document.getElementById('pane-reviews').innerHTML = reviewsHtml;
    
    document.getElementById('pane-faqs').innerHTML = pFaqs.replace(/\\n/g, '<br>') || 'No FAQs available.';
  } else {
    document.getElementById('productTabsSection').style.display = 'none';
  }`;

pd = pd.replace(oldTabs, newTabs);

// Update initProductDetailUI sizes fallback
pd = pd.replace(`  // Default Sofa Sizes logic`, `
  document.getElementById('detailPrice').innerText = activeProduct.price ? activeProduct.price : 'Price on Request';
  // Default Sofa Sizes logic`);


// And wait! Why did the user's screenshot show "Base Dimensions Width: -- | Depth: -- | Height: --" and "Materials Available Loading..."?
// Because I just removed it from HTML, but JS is still looking for it!
pd = pd.replace(`  document.getElementById('specDimensions').innerText = 'Width: ' + (activeProduct.dimensions?.width || '--') + 
                                                      ' | Depth: ' + (activeProduct.dimensions?.depth || '--') + 
                                                      ' | Height: ' + (activeProduct.dimensions?.height || '--');`, '');
pd = pd.replace(`  document.getElementById('specMaterials').innerText = selectedMaterial;`, '');

fs.writeFileSync('product-detail.html', pd, 'utf-8');
console.log('Fixed product-detail.html successfully');
