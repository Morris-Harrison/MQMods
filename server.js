const express = require('express');
require('dotenv').config();

const app = express();
const API_PORT = 3001;

// Middleware
app.use(express.json());

// Import API routes
const createCheckoutSession = require('./api/create-checkout-session.js');
const sessionStatus = require('./api/session-status.js');

// API Routes
app.post('/api/create-checkout-session', async (req, res) => {
  await createCheckoutSession(req, res);
});

app.get('/api/session-status', async (req, res) => {
  await sessionStatus(req, res);
});

// Start server
app.listen(API_PORT, () => {
  console.log(`Backend server running on http://localhost:${API_PORT}`);
});
