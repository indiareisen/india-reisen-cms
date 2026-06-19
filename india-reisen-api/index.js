const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/send-invoice', async (req, res) => {
  try {
    const { email, invoiceNumber, invoiceHtml, clientName } = req.body;

    if (!email || !invoiceHtml) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const msg = {
      to: email,
      from: 'invoices@indiareisen.com',
      subject: `Invoice ${invoiceNumber} - India Reisen`,
      html: invoiceHtml,
    };

    await sgMail.send(msg);
    res.json({ success: true, message: `Invoice sent to ${email}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
