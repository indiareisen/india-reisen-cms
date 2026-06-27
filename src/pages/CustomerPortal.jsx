import { useState, useEffect } from 'react';
import { getCustomerBookings } from '../services/bookingService';

const CustomerPortal = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBookings, setShowBookings] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await getCustomerBookings(email);
      setBookings(data);
      setShowBookings(true);
      setLoading(false);
    } catch (error) {
      alert('Error loading bookings');
      setLoading(false);
    }
  };

  const handleDownloadInvoice = (booking) => {
    const invoiceHTML = `
      <div style="font-family: Arial; padding: 40px;">
        <h1 style="color: #d1356f;">INVOICE</h1>
        <hr>
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Guest:</strong> ${booking.guestName}</p>
        <p><strong>Journey:</strong> ${booking.journeyTitle}</p>
        <p><strong>Date:</strong> ${booking.startDate}</p>
        <p><strong>Travelers:</strong> ${booking.travelers}</p>
        <p style="font-size: 20px; color: #d1356f;"><strong>Total: ₹${Math.round(booking.totalPrice).toLocaleString()}</strong></p>
      </div>
    `;
    const win = window.open('', '', 'height=500,width=800');
    win.document.write(invoiceHTML);
    win.print();
  };

  if (!showBookings) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div style={{ background: `linear-gradient(135deg, #d1356f 0%, #D4A574 100%)` }} className="text-white py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Your Bookings</h1>
            <p className="text-xl opacity-95">Enter your email to view your journey bookings</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 py-12">
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg p-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">Email Address</label>
            <div className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-pink-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'View Bookings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ background: `linear-gradient(135deg, #d1356f 0%, #D4A574 100%)` }} className="text-white py-12 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Your Bookings</h1>
            <p className="text-lg opacity-95">{email}</p>
          </div>
          <button onClick={() => setShowBookings(false)} className="bg-white text-pink-600 font-bold px-6 py-2 rounded-lg hover:bg-gray-100">
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 py-8">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-600 text-lg">No bookings found for this email</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{booking.journeyTitle}</h3>
                    <div className="space-y-2 text-gray-600">
                      <p><strong>Booking ID:</strong> {booking.id}</p>
                      <p><strong>Date:</strong> {booking.startDate}</p>
                      <p><strong>Travelers:</strong> {booking.travelers}</p>
                      <p><strong>Status:</strong> <span className={`font-bold ${booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>{booking.status}</span></p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-gray-600">Total Amount</p>
                      <p className="text-3xl font-bold text-pink-600">₹{Math.round(booking.totalPrice).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleDownloadInvoice(booking)} className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">
                        📄 Invoice
                      </button>
                      <button className="flex-1 bg-gray-600 text-white font-bold py-2 rounded-lg hover:bg-gray-700">
                        ✏️ Modify
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPortal;
