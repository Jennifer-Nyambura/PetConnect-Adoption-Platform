const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(__dirname));

// Handle JSON requests
app.use(express.json());

// Serve index.html on root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 PetConnect server running on port ${PORT}`);
    console.log(`🌐 Visit: http://localhost:${PORT}`);
});