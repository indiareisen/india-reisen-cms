import { useState, useEffect } from 'react';
import { createBooking } from '../../services/bookingService';

const BookingForm = ({ journey, onClose }) => {
  const [formData, setFormData] = useState({
    journeyTitle: journey?.title || '',
    journeyId: journey?.id || '',
    guestName: '',
    email: '',
    phone: '',
    travelers: 1,
    startDate: '',
    specialRequests: '',
    totalPrice: journey?.basePrice || 0,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const discount = (journey?.discount || 0) / 100;
    const price = (journey?.basePrice || 0) * (1 - discount) * formData.travelers;
    setFormData(prev => ({ ...prev, totalPrice: price }));
  }, [formData.travelers, journey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBooking(formData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      alert('Booking failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-12 text-center max-w-md">
          <p className="text-5xl mb-4">✅</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">We'll contact you shortly with payment details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-yellow-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Book {journey?.title}</h2>
          <button onClick={onClose} className="text-2xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Guest Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input type="text" name="guestName" value={formData.guestName} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Travelers</label>
              <input type="number" name="travelers" value={formData.travelers} onChange={handleChange} min="1" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none" />
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests (Optional)</label>
            <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows="4" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none" placeholder="Any dietary requirements, accessibility needs, etc." />
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-to-r from-pink-50 to-yellow-50 p-6 rounded-lg border-l-4 border-pink-600">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Base Price:</span>
              <span>₹{journey?.basePrice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Discount:</span>
              <span className="text-green-600">-{journey?.discount}%</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-700">Travelers:</span>
              <span>x{formData.travelers}</span>
            </div>
            <div className="border-t-2 border-gray-300 pt-4 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total Price:</span>
              <span className="text-2xl font-bold text-pink-600">₹{Math.round(formData.totalPrice).toLocaleString()}</span>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <input type="checkbox" id="terms" required className="w-5 h-5 mt-1" />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the terms and conditions. A deposit will be required to confirm this booking.
            </label>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #d1356f, #D4A574)' }} className="w-full text-white font-bold py-4 rounded-lg hover:shadow-lg transition disabled:opacity-50">
            {loading ? '⏳ Processing...' : '💳 Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
