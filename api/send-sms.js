import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Missing phone or OTP' });
  }

  try {
    await client.messages.create({
      body: `Your India Reisen verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Twilio error:', error);
    return res.status(500).json({ error: error.message });
  }
}
