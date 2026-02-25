const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const YOUR_DOMAIN = process.env.YOUR_DOMAIN || 'http://localhost:5173';

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { cart } = req.body;
    if (!cart) {
      return res.status(400).json({ error: 'Cart is required' });
    }

    // Build dynamic line items from the cart.
    let line_items = [];
    let subtotalCents = 0;

    for (const category in cart) {
      if (!Array.isArray(cart[category])) continue;
      cart[category].forEach(item => {
        const amountCents = Math.round((item.effectivePrice || item.standard || 0) * 100);
        if (amountCents > 0) {
          line_items.push({
            price_data: {
              currency: 'cad',
              product_data: { 
                name: item.name,
                description: category
              },
              unit_amount: amountCents,
            },
            quantity: 1,
          });
          subtotalCents += amountCents;
        }
      });
    }

    // Add 7% Stripe fee
    const feeCents = Math.round(subtotalCents * 0.07);
    if (feeCents > 0) {
      line_items.push({
        price_data: {
          currency: 'cad',
          product_data: { name: 'Stripe service fee (7%)' },
          unit_amount: feeCents,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      automatic_tax: { enabled: true },
      success_url: `${YOUR_DOMAIN}/payment-complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    return res.status(200).json({ sessionUrl: session.url, clientSecret: session.client_secret });
  } catch (error) {
    console.error('Error creating Checkout Session:', error);
    return res.status(500).json({ error: error.message });
  }
};
