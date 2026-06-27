export const initializePayment = async (bookingData) => {
  try {
    // In production, call your backend to create Stripe session
    const response = await fetch('https://project-5alhy.vercel.app/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Math.round(bookingData.totalPrice),
        bookingId: bookingData.id,
        guestEmail: bookingData.email,
        guestName: bookingData.guestName,
        journey: bookingData.journeyTitle,
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Payment init error:', error);
    throw error;
  }
};

export const verifyPayment = async (paymentId) => {
  try {
    const response = await fetch(`https://project-5alhy.vercel.app/verify-payment/${paymentId}`);
    return await response.json();
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};

export const generateInvoice = (bookingData) => {
  return `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #d1356f; text-align: center;">Invoice</h1>
      <hr style="border: 2px solid #D4A574;">
      
      <div style="margin: 20px 0;">
        <h3>Booking Details</h3>
        <p><strong>Guest Name:</strong> ${bookingData.guestName}</p>
        <p><strong>Email:</strong> ${bookingData.email}</p>
        <p><strong>Phone:</strong> ${bookingData.phone}</p>
      </div>

      <div style="margin: 20px 0;">
        <h3>Journey Details</h3>
        <p><strong>Journey:</strong> ${bookingData.journeyTitle}</p>
        <p><strong>Travelers:</strong> ${bookingData.travelers}</p>
        <p><strong>Start Date:</strong> ${bookingData.startDate}</p>
      </div>

      <div style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-left: 4px solid #d1356f;">
        <p><strong>Total Amount:</strong> <span style="font-size: 24px; color: #d1356f;">₹${Math.round(bookingData.totalPrice).toLocaleString()}</span></p>
        <p style="color: #666; font-size: 12px;">GST included. Deposit required to confirm booking.</p>
      </div>

      <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
        <p>Thank you for choosing India Reisen!</p>
        <p>For queries: team@indiareisen.com | +91 98108 27785</p>
      </div>
    </div>
  `;
};
