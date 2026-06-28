import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.VITE_SENDGRID_API_KEY
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body;

  try {
    await transporter.sendMail({
      from: 'noreply@indiareisen.com',
      to: 'team@indiareisen.com',
      subject: `Contact from ${name}`,
      html: `<h2>${name}</h2><p>Email: ${email}</p><p>Phone: ${phone}</p><p>${message}</p>`
    });

    await transporter.sendMail({
      from: 'noreply@indiareisen.com',
      to: email,
      subject: 'Message received',
      html: `<h2>Hi ${name}</h2><p>We got your message!</p>`
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
