const fs = require('fs').promises;
const path = require('path');
const { getBranchBySlug, seedBranchesIfEmpty } = require('../lib/branch-db');
const { buildLocalBusinessSchemaScript } = require('../lib/build-schema');
const { BASE_URL } = require('../lib/seo-utils');

module.exports = async function handler(req, res) {
    const url = new URL(req.url, `https://${req.headers.host}`);
    seedBranchesIfEmpty();
    const slug = url.searchParams.get('slug') || url.searchParams.get('location');

    if (!slug) {
        try {
            const filePath = path.join(process.cwd(), 'location.html');
            const html = await fs.readFile(filePath, 'utf8');
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.status(200).send(html);
        } catch {
            return res.status(400).send('Location slug required. Use ?location=slug');
        }
    }

    const branch = getBranchBySlug(slug);
    if (!branch) return res.status(404).send('Location not found');

    try {
        const filePath = path.join(process.cwd(), 'location.html');
        let html = await fs.readFile(filePath, 'utf8');

        let apiLocation = BASE_URL;
        try {
            const { createClient } = require('@supabase/supabase-js');
            const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');
            const { data, error } = await supabase.from('images').select('*').eq('category', 'cs_settings').limit(1);
            if (!error && data && data.length > 0) {
                const parsed = JSON.parse(data[0].image_url);
                if (parsed.api_location) apiLocation = parsed.api_location;
            }
        } catch(err) {}

        const pageUrl = `${apiLocation}/locations/${branch.slug}`;
        const schemaScript = buildLocalBusinessSchemaScript(branch, apiLocation);
        const title = `${branch.name} | Weaver's Crafting`;
        const description = `Visit ${branch.name} in ${branch.city}. Weaver's Crafting – #1 custom sofa, sofa cum bed, dining table & furniture shop for businesses.`;

        html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
        html = html.replace(/<meta name="description" content="[^"]*">/i,
            `<meta name="description" content="${description.replace(/"/g, '&quot;')}">`);
        html = html.replace(/<link rel="canonical" href="[^"]*">/i,
            `<link rel="canonical" href="${pageUrl}">`);
        html = html.replace('</head>', `    ${schemaScript}\n    <script>window.__BRANCH_SLUG__="${branch.slug}";</script>\n</head>`);

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.status(200).send(html);
    } catch (err) {
        console.error('Location page render error:', err.message);
        return res.status(500).send('Error loading location page');
    }
};
