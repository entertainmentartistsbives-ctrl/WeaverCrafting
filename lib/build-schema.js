const buildOrganizationSchema = (siteUrl) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Weaver's Crafting",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`, // Assuming a standard logo path
    description: "Weaver's Crafting – #1 custom sofa, sofa cum bed, dining table & furniture shop in Bommanahalli, Bengaluru.",
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9742630886',
      contactType: 'sales',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi', 'Kannada']
    },
    sameAs: []
  };
};

const expandDayOfWeek = (dayOfWeek) => {
  if (!dayOfWeek) return [];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const result = [];
  dayOfWeek.forEach(range => {
    if (range.includes('-')) {
      const [start, end] = range.split('-');
      const startIndex = days.indexOf(start);
      const endIndex = days.indexOf(end);
      if (startIndex !== -1 && endIndex !== -1) {
        for (let i = startIndex; i <= endIndex; i++) {
          result.push(days[i]);
        }
      }
    } else {
      result.push(range);
    }
  });
  return [...new Set(result)]; // Remove duplicates
};

const buildLocalBusinessSchemaObject = (branch, siteUrl) => {
  return {
    '@context': 'https://schema.org',
    '@type': branch.businessType || 'FurnitureStore',
    name: branch.name,
    image: branch.imageUrl,
    '@id': `${siteUrl}/locations/${branch.slug}`,
    url: `${siteUrl}/locations/${branch.slug}`,
    telephone: branch.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: branch.street,
      addressLocality: branch.city,
      addressRegion: branch.state,
      postalCode: branch.pincode,
      addressCountry: branch.country
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: branch.lat,
      longitude: branch.lng
    },
    openingHoursSpecification: (branch.openingHours || []).map(hours => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: expandDayOfWeek(hours.dayOfWeek),
      opens: hours.opens,
      closes: hours.closes
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: branch.rating,
      reviewCount: branch.reviewCount
    }
  };
};

const buildLocalBusinessSchemaScript = (branch, siteUrl) => {
  const schemaObj = buildLocalBusinessSchemaObject(branch, siteUrl);
  return `<script type="application/ld+json" id="cs-local-schema">${JSON.stringify(schemaObj)}</script>`;
};

module.exports = {
  buildOrganizationSchema,
  buildLocalBusinessSchemaObject,
  buildLocalBusinessSchemaScript,
  expandDayOfWeek
};
