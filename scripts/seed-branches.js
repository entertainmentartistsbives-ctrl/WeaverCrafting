const { seedBranchesIfEmpty } = require('../lib/branch-db');

console.log('Seeding branches into database...');
seedBranchesIfEmpty();
console.log('Branches seeded successfully.');
