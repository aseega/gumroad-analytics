// server.js
const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files for the frontend
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for domain restriction
app.use((req, res, next) => {
  const allowedDomain = process.env.CUSTOM_DOMAIN || 'example.com';
  if (req.hostname !== allowedDomain) {
    return res.status(403).send('Access Forbidden');
  }
  next();
});

// Route to fetch Gumroad analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const response = await axios.get('https://api.gumroad.com/v2/sales', {
      headers: { Authorization: `Bearer ${process.env.GUMROAD_ACCESS_TOKEN}` },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Gumroad' });
  }
});

// Serve the dashboard page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
