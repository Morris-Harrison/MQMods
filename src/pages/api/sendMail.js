// /api/sendMail.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { cart, name, address, additionalContact, email, serviceType } = req.body;

    // Use environment variables in production for security
    const GMAIL_USER = 'mqphobgcc@gmail.com';
    const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD; // your Gmail App Password

    // Create transporter with Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS
      },
    });

    // Build the email text as requested
    const emailBody = buildEmailText({ cart, name, address, additionalContact, serviceType });

    // Common headers to improve deliverability
    const commonHeaders = {
      'X-Mailer': 'Nodemailer',
      'Reply-To': GMAIL_USER
    };

    // Send the "customer" email
    await transporter.sendMail({
      from: `MQ Mods <${GMAIL_USER}>`,
      to: email,
      subject: 'Your MQMods Order Confirmation',
      text: emailBody,
      headers: commonHeaders
    });

    // Send the "internal" email (to yourself)
    await transporter.sendMail({
      from: `MQ Mods <${GMAIL_USER}>`,
      to: GMAIL_USER,
      subject: 'New MQMods Order Received',
      text: emailBody,
      headers: commonHeaders
    });

    return res.status(200).json({ message: 'Emails sent successfully.' });
  } catch (err) {
    console.error('SendMail error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/** 
 * Build the custom email text from the cart data.
 * Sums up standard prices to get total CAD, then calculates USD at ~0.76 rate.
 */
function buildEmailText({ cart, name, address, additionalContact, serviceType = 'Phob' }) {
  // 1) Summation and item extraction
  let totalStandard = 0;
  let productNames = [];
  const categoryMap = {};

  for (let category in cart) {
    const items = cart[category];
    if (!Array.isArray(items)) continue;

    categoryMap[category] = [];

    items.forEach((item) => {
      productNames.push(item.name);
      totalStandard += item.standard || 0;
      categoryMap[category].push({
        name: item.name,
        price: item.standard || 0
      });
    });
  }

  const priceCAD = totalStandard;
  const priceUSD = (priceCAD * 0.76).toFixed(2);

  let text = `Thank you for submitting your order. I will be contacting you within the next 2-3 days. 
Please feel free to contact me before that if you have any questions. 
Contact information below! Unless you selected priority queue or have a custom commission, 
this should be the final price. Here are the details of your order:

Contact: ${additionalContact || name}
Order type: ${serviceType} Controller
Products: ${productNames.join(', ')}
Price(CAD): $${priceCAD}
Price(USD): $${priceUSD}
Additional Contact / Shipping: Name: ${name} Address: ${address}

The following is the list of services and their prices:
`;

  for (let category in categoryMap) {
    const catTitle = transformCategoryName(category);
    text += `${catTitle}:\n`;

    categoryMap[category].forEach(({ name, price }) => {
      text += `    ${name}: $${price}\n`;
    });
    text += '\n';
  }

  text += `Thank you for choosing MQ Mods!

Best regards,
MQ

Discord: MQMods
Twitter: twitter.com/MQMods
Email: mqphobgcc@gmail.com
Phob Resource: phobg.cc
`;

  return text;
}

/**
 * Example mapping from the original cart categories to your custom labels.
 */
function transformCategoryName(original) {
  switch (original) {
    case 'Shell':
      return 'Shell(Like New)';
    case 'Left Trigger':
      return 'Left';
    case 'Right Trigger':
      return 'Right';
    case 'Face Buttons':
    case 'z-button':
      return 'Buttons';
    default:
      return original;
  }
}
