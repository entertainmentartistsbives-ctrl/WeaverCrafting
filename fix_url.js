const fs = require('fs');
let pd = fs.readFileSync('product-detail.html', 'utf-8');

const targetStr = `// Determine product from URL query
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
let activeProduct = PRODUCTS.find(p => p.id === productId);`;

const newStr = `// Determine product from URL path or query
const urlParts = window.location.pathname.split('/').filter(Boolean);
let productId;
if (urlParts.length >= 2 && urlParts[0] === 'product') {
  productId = urlParts[urlParts.length - 1];
} else {
  const urlParams = new URLSearchParams(window.location.search);
  productId = urlParams.get('id');
}
let activeProduct = PRODUCTS.find(p => p.id === productId);`;

pd = pd.replace(targetStr.replace(/\r\n/g, '\n'), newStr);
pd = pd.replace(targetStr, newStr);

fs.writeFileSync('product-detail.html', pd, 'utf-8');
console.log('Replaced URL parsing logic successfully');
