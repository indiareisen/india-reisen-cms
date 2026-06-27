import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getItineraries } from '../services/firebaseService';
import BookingForm from '../components/public/BookingForm';

const JourneyDetailPage = ({ journeyId }) => {
  const [journey, setJourney] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJourney();
  }, [journeyId]);

  const loadJourney = async () => {
    try {
      const journeys = await getItineraries();
      const found = journeys.find(j => j.id === journeyId);
      setJourney(found);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading || !journey) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="h-96 bg-gradient-to-br from-pink-400 to-yellow-400 flex items-center justify-center text-9xl">
        🗺️
      </div>

      <div className="max-w-4xl mx-auto p-6 -mt-24 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{journey.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{journey.destination}</p>

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-gray-50 rounded-xl">
            <div>
              <p className="text-gray-600 text-sm">Duration</p>
              <p className="text-2xl font-bold text-gray-900">{journey.duration} Days</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Difficulty</p>
              <p className="text-2xl font-bold text-gray-900">{journey.difficulty}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Price</p>
              <p className="text-2xl font-bold text-pink-600">₹{journey.basePrice?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Discount</p>
              <p className="text-2xl font-bold text-green-600">{journey.discount}% OFF</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Journey</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{journey.description}</p>
          </div>

          {/* Highlights */}
          {journey.highlights && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Highlights</h2>
              <ul className="space-y-2">
                {journey.highlights.split(',').map((h, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700">
                    <span className="text-pink-600 text-2xl">✨</span>
                    <span>{h.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Booking CTA */}
          <button
            onClick={() => setShowBooking(true)}
            className="w-full bg-gradient-to-r from-pink-600 to-yellow-600 text-white font-bold py-4 rounded-lg text-lg hover:shadow-lg transition"
          >
            📅 Book This Journey
          </button>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Guest Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Sarah Johnson', rating: 5, text: 'Absolutely magical! Best experience ever.' },
              { name: 'Rajesh Kumar', rating: 5, text: 'Exceeded all expectations. Highly recommended!' },
            ].map((review, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-400">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-bold text-gray-900">{review.name}</p>
                  <p className="text-yellow-400">{'⭐'.repeat(review.rating)}</p>
                </div>
                <p className="text-gray-700 italic">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showBooking && <BookingForm journey={journey} onClose={() => setShowBooking(false)} />}
    </div>
  );
};

export default JourneyDetailPage;
