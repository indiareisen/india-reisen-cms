export const sendBookingConfirmation = async (bookingData) => {
  try {
    const response = await fetch('https://project-5alhy.vercel.app/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: bookingData.email,
        subject: `Booking Confirmation - ${bookingData.journeyTitle}`,
        html: `
          <h2>Thank you for your booking!</h2>
          <p>Dear ${bookingData.guestName},</p>
          <p>Your booking for <strong>${bookingData.journeyTitle}</strong> has been received.</p>
          <p><strong>Booking Details:</strong></p>
          <ul>
            <li>Journey: ${bookingData.journeyTitle}</li>
            <li>Travelers: ${bookingData.travelers}</li>
            <li>Start Date: ${bookingData.startDate}</li>
            <li>Total Price: ₹${Math.round(bookingData.totalPrice).toLocaleString()}</li>
          </ul>
          <p>We will contact you shortly with payment details and next steps.</p>
          <p>Best regards,<br/>India Reisen Team</p>
        `
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Email send error:', error);
  }
};

export const sendNewsletter = async (emailList, subject, message) => {
  try {
    for (const email of emailList) {
      await fetch('https://project-5alhy.vercel.app/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email, subject, html: message })
      });
    }
    return { success: true };
  } catch (error) {
    console.error('Newsletter error:', error);
  }
};
