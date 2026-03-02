const nodemailer = require('nodemailer');

/**
 * Build the email text from the cart data.
 * Sums up effective prices and calculates USD conversion.
 */
function buildEmailText({ cart, name, address, additionalContact, rumble }) {
  let totalCAD = 0;
  let productLines = [];
  const categoryMap = {};

  for (let category in cart) {
    const items = cart[category];
    if (!Array.isArray(items)) continue;

    categoryMap[category] = [];

    items.forEach((item) => {
      const price = item.effectivePrice || item.standard || item.tournament || 0;
      totalCAD += price;
      categoryMap[category].push({
        name: item.name,
        price: price
      });
      productLines.push(item.name + ' - $' + price.toFixed(2) + ' CAD');
    });
  }

  const priceUSD = (totalCAD * 0.76).toFixed(2);

  let text = 'Hi,\n\n';
  text += 'Thank you for submitting your order! I will be contacting you within the next 2-3 days. \n';
  text += 'Please feel free to contact me before that if you have any questions.\n\n';
  text += 'ORDER DETAILS:\n';
  text += '================\n';
  text += 'Contact: ' + (additionalContact || name) + '\n';
  text += 'Tag/Name: ' + name + '\n';
  text += 'Address: ' + address + '\n';
  text += 'Rumble: ' + rumble + '\n\n';
  text += 'PRODUCTS ORDERED:\n';
  text += '================\n';
  text += productLines.join('\n') + '\n\n';
  text += 'PRICING:\n';
  text += '================\n';
  text += 'Price (CAD): $' + totalCAD.toFixed(2) + '\n';
  text += 'Price (USD): $' + priceUSD + '\n\n';
  text += 'Thank you for your business!\n';
  text += 'MQMods Team';

  return text;
}

module.exports = async function handler(req, res) {
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
    const { cart, name, address, additionalContact, email, rumble } = req.body;

    // Use environment variables in production for security
    const GMAIL_USER = process.env.GMAIL_USER || 'mqphobgcc@gmail.com';
    const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD;

    if (!GMAIL_PASS) {
      console.error('GMAIL_APP_PASSWORD environment variable not set');
      return res.status(500).json({ error: 'Email configuration error' });
    }

    // Create transporter with Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS
      },
    });

    // Build the email text
    const emailBody = buildEmailText({ cart, name, address, additionalContact, rumble });

    // Common headers to improve deliverability
    const commonHeaders = {
      'X-Mailer': 'Nodemailer',
      'Reply-To': GMAIL_USER
    };

    // Send the "customer" email
    await transporter.sendMail({
      from: `MQMods <${GMAIL_USER}>`,
      to: email,
      subject: 'Your MQMods Order Confirmation',
      text: emailBody,
      headers: commonHeaders
    });

    // Send the "internal" email (to admin)
    await transporter.sendMail({
      from: `MQMods <${GMAIL_USER}>`,
      to: GMAIL_USER,
      subject: 'New MQMods Order Received',
      text: `New order from ${name} (${email}):\n\n${emailBody}`,
      headers: commonHeaders
    });

    return res.status(200).json({ message: 'Emails sent successfully.' });
  } catch (err) {
    console.error('SendMail error:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};
