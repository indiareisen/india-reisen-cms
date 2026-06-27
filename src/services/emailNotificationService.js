import { sendBookingConfirmation } from './emailService';

export const sendAllNotifications = async (bookingData) => {
  try {
    // Booking confirmation
    await sendBookingConfirmation({
      ...bookingData,
      bookingId: bookingData.id,
    });

    // Admin notification
    await fetch('https://project-5alhy.vercel.app/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'team@indiareisen.com',
        subject: `New Booking: ${bookingData.journeyTitle}`,
        html: `
          <h2>New Booking Received!</h2>
          <p><strong>${bookingData.guestName}</strong> has booked <strong>${bookingData.journeyTitle}</strong></p>
          <p>Email: ${bookingData.email}</p>
          <p>Phone: ${bookingData.phone}</p>
          <p>Total: ₹${Math.round(bookingData.totalPrice).toLocaleString()}</p>
        `
      })
    });

    return { success: true };
  } catch (error) {
    console.error('Notification error:', error);
  }
};

export const sendJourneyReminder = async (email, journeyTitle, startDate) => {
  await fetch('https://project-5alhy.vercel.app/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: email,
      subject: `Reminder: Your ${journeyTitle} journey starts in 7 days!`,
      html: `
        <h2>Get Ready for Your Adventure!</h2>
        <p>Your <strong>${journeyTitle}</strong> journey starts on <strong>${startDate}</strong></p>
        <p>📋 Check your email for final itinerary and packing list</p>
        <p>📱 Save our WhatsApp: +91 98108 27785</p>
        <p>We're excited to have you!</p>
      `
    })
  });
};
