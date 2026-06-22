const { BASE_URL } = require('./constants');

const defaultBranches = [
  {
    id: 1,
    slug: 'bengaluru',
    name: "Weaver's Crafting — Bengaluru",
    businessType: 'FurnitureStore',
    street: '201, 10th Cross Road, GPK Layout, Muneshwara Nagar, Bandepalya',
    city: 'Bommanahalli, Bengaluru',
    state: 'Karnataka',
    pincode: '560068',
    country: 'IN',
    phone: '+91-9742630886',
    website: BASE_URL,
    lat: 12.8984,
    lng: 77.6333,
    rating: 4.8,
    reviewCount: 42,
    openingHours: [{ dayOfWeek: ['Monday-Sunday'], opens: '09:00', closes: '20:00' }],
    deliveryAvailable: true,
    inStorePickup: true,
    imageUrl: `${BASE_URL}/og-image.jpg`
  }
];

module.exports = { defaultBranches };
