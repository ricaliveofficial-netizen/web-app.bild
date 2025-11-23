const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// In-memory store for header and about text
let siteData = {
    header: "Agent Live Test App",
    about: "This is a simple Agent Live Chat app using OpenAI API. You can chat in English or Bangla!"
};

// OpenAI Chat API
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userMessage }]
            })
        });
        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get current site data (for index.html to fetch)
app.get('/site-data', (req, res) => {
    res.json(siteData);
});

// Admin token for basic protection
const ADMIN_TOKEN = "12345"; // change this to secure token

// Serve admin panel (outside public)
app.get('/admin', (req, res) => {
    const token = req.query.token;
    if (token !== ADMIN_TOKEN) return res.status(403).send("Forbidden");
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Update site data (Admin save)
app.post('/admin/update', (req, res) => {
    const token = req.query.token;
    if (token !== ADMIN_TOKEN) return res.status(403).json({ status: 'forbidden' });

    const { header, about } = req.body;
    if (header) siteData.header = header;
    if (about) siteData.about = about;

    res.json({ status: 'success', siteData });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
