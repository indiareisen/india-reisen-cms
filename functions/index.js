const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(SENDGRID_API_KEY);

exports.sendInvoiceEmail = functions.https.onCall(async (data, context) => {
  try {
    const { email, invoiceNumber, invoiceHtml, clientName } = data;

    if (!email || !invoiceHtml) {
      throw new Error("Missing required fields: email, invoiceHtml");
    }

    const msg = {
      to: email,
      from: "invoices@indiareisen.com",
      subject: `Invoice ${invoiceNumber} - India Reisen`,
      html: invoiceHtml,
    };

    await sgMail.send(msg);

    return {
      success: true,
      message: `Invoice sent to ${email}`,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
