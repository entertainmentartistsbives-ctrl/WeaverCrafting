const path = require('path');
const fs = require('fs');
const { defaultBranches } = require('./branch-seed');

let db = null;
let memoryBranches = [];
const DB_PATH = path.join(__dirname, '..', 'data', 'branches.db');

try {
    const Database = require('better-sqlite3');
    // Ensure data dir exists
    if (!fs.existsSync(path.join(__dirname, '..', 'data'))) {
        fs.mkdirSync(path.join(__dirname, '..', 'data'), { recursive: true });
    }
    db = new Database(DB_PATH);
    db.exec(`
        CREATE TABLE IF NOT EXISTS branches (
            id INTEGER PRIMARY KEY,
            slug TEXT UNIQUE NOT NULL,
            data TEXT NOT NULL
        )
    `);
} catch (err) {
    console.warn('better-sqlite3 not available or failed to load. Using in-memory fallback for branches.');
    db = false;
    memoryBranches = [...defaultBranches];
}

function getBranchBySlug(slug) {
    if (!db) {
        return memoryBranches.find(b => b.slug === slug);
    }
    const row = db.prepare('SELECT data FROM branches WHERE slug = ?').get(slug);
    if (!row) return null;
    try {
        return JSON.parse(row.data);
    } catch (e) {
        return null;
    }
}

function getAllBranches() {
    if (!db) {
        return memoryBranches;
    }
    const rows = db.prepare('SELECT data FROM branches').all();
    return rows.map(r => {
        try {
            return JSON.parse(r.data);
        } catch (e) {
            return null;
        }
    }).filter(Boolean);
}

function upsertBranch(branch) {
    if (!db) {
        const index = memoryBranches.findIndex(b => b.slug === branch.slug);
        if (index > -1) {
            memoryBranches[index] = branch;
        } else {
            memoryBranches.push(branch);
        }
        return;
    }
    const stmt = db.prepare(`
        INSERT INTO branches (id, slug, data)
        VALUES (@id, @slug, @data)
        ON CONFLICT(slug) DO UPDATE SET data=excluded.data
    `);
    stmt.run({
        id: branch.id,
        slug: branch.slug,
        data: JSON.stringify(branch)
    });
}

function seedBranchesIfEmpty() {
    if (!db) {
        if (memoryBranches.length === 0) {
            memoryBranches = [...defaultBranches];
        }
        return;
    }
    const count = db.prepare('SELECT COUNT(*) as count FROM branches').get().count;
    if (count === 0) {
        const insert = db.prepare('INSERT INTO branches (id, slug, data) VALUES (?, ?, ?)');
        const insertMany = db.transaction((branches) => {
            for (const branch of branches) {
                insert.run(branch.id, branch.slug, JSON.stringify(branch));
            }
        });
        insertMany(defaultBranches);
    }
}

function getSlimBranches() {
    return getAllBranches().map(b => ({
        id: b.id,
        slug: b.slug,
        name: b.name,
        city: b.city,
        rating: b.rating
    }));
}

module.exports = {
    getBranchBySlug,
    getAllBranches,
    upsertBranch,
    seedBranchesIfEmpty,
    getSlimBranches
};
