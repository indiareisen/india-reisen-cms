const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");

const SENDGRID_API_KEY = "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";
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
