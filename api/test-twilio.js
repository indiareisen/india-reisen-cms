import twilio from 'twilio';

export default async function handler(req, res) {
  console.log('Twilio Test Endpoint Called');
  console.log('Account SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing');
  console.log('Auth Token:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
  console.log('Phone Number:', process.env.TWILIO_PHONE_NUMBER ? '✅ Set' : '❌ Missing');

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    return res.status(400).json({ 
      error: 'Missing Twilio credentials in Vercel env vars',
      hasAccountSid: !!process.env.TWILIO_ACCOUNT_SID,
      hasAuthToken: !!process.env.TWILIO_AUTH_TOKEN,
      hasPhoneNumber: !!process.env.TWILIO_PHONE_NUMBER
    });
  }

  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    // Test by getting account info
    const account = await client.api.accounts.list();
    
    return res.status(200).json({ 
      success: true,
      message: 'Twilio is properly configured!',
      credentials: {
        accountSid: process.env.TWILIO_ACCOUNT_SID.substring(0, 6) + '...',
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      error: error.message,
      details: 'Check Twilio credentials are correct'
    });
  }
}
