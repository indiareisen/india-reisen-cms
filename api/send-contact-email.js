const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Send to India Reisen
    await transporter.sendMail({
      from: 'noreply@indiareisen.com',
      to: 'team@indiareisen.com',
      subject: `New Contact: ${name}`,
      html: `<h2>New Contact</h2><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Phone:</b> ${phone}</p><p><b>Message:</b> ${message}</p>`
    });

    // Send confirmation
    await transporter.sendMail({
      from: 'noreply@indiareisen.com',
      to: email,
      subject: 'We got your message',
      html: `<h2>Thank you!</h2><p>We received your message and will respond within 24 hours.</p>`
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
