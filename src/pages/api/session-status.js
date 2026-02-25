// /api/session-status.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const sessionId = req.query.session_id;
  if (!sessionId) {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return res.status(200).json(session);
  } catch (error) {
    console.error("Error retrieving session:", error);
    return res.status(500).json({ error: error.message });
  }
};
