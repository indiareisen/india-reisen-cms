import twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Missing phone or OTP' });
  }

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    return res.status(500).json({ error: 'Twilio env vars missing' });
  }

  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    let toPhone = phone;
    if (!toPhone.startsWith('+')) {
      toPhone = '+91' + toPhone.replace(/\D/g, '');
    }

    const message = await client.messages.create({
      body: `Your India Reisen verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhone
    });

    return res.status(200).json({ success: true, messageSid: message.sid });
  } catch (error) {
    console.error('Twilio error:', error);
    return res.status(500).json({ error: error.message });
  }
}
