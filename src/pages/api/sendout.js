const nodemailer = require('nodemailer');

export default async (req, res) => {
  if (req.method === 'POST') {
    const { email, orderSummary } = req.body;
    
    // Configure the transporter with Gmail SMTP.
    // Use an app password (set this in your Vercel Environment Variables as GMAIL_APP_PASSWORD)
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mqphobgcc@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Email to the customer
    let mailOptionsCustomer = {
      from: 'mqphobgcc@gmail.com',
      to: email,
      subject: 'Your Order Summary from MQMods',
      text: `Thank you for your order!\n\n${orderSummary}\n\nWe will contact you in a few days.`
    };

    // Email to you (admin)
    let mailOptionsAdmin = {
      from: 'mqphobgcc@gmail.com',
      to: 'mqphobgcc@gmail.com',
      subject: 'New Order from MQMods',
      text: `A new order has been placed:\n\n${orderSummary}\n\nCustomer Email: ${email}`
    };

    try {
      await transporter.sendMail(mailOptionsCustomer);
      await transporter.sendMail(mailOptionsAdmin);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error("Email sending error:", error);
      res.status(500).json({ message: 'Error sending email', error: error.toString() });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
