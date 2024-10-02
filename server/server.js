// server/server.js
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

// Route to fetch templates from GitHub
app.get('/api/templates', async (req, res) => {
    const type = req.query.type;
    const keyword = req.query.keyword || '';
    const page = req.query.page || 1;
    const response = await fetch(`https://api.github.com/search/repositories?q=${type}+template+in:name${keyword ? `+${keyword}` : ''}&sort=stars&order=desc&page=${page}&per_page=5`, {
        headers: {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
        }
    });
    const data = await response.json();
    res.json(data);
});

// Route to serve preview content from GitHub
app.get('/api/preview', async (req, res) => {
    const owner = req.query.owner;
    const repo = req.query.repo;
    if (!owner || !repo) {
        return res.status(400).send('Owner and repo are required.');
    }

    try {
        // Fetch the index.html content from the repository
        let response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/index.html`);
        if (!response.ok) {
            // Try fetching from the docs/ directory if main/index.html is not found
            response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/docs/index.html`);
        }
        if (!response.ok) throw new Error('Failed to fetch template content');

        const html = await response.text();
        res.set('Content-Type', 'text/html');
        res.send(html);
    } catch (error) {
        res.status(500).send('Error loading preview: ' + error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
