import { useState, useEffect } from 'react';
import { getItineraries } from '../services/firebaseService';
import AdvancedSearch from '../components/public/AdvancedSearch';
import BookingForm from '../components/public/BookingForm';

const JourneysPageWithBooking = () => {
  const [journeys, setJourneys] = useState([]);
  const [filteredJourneys, setFilteredJourneys] = useState([]);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    loadJourneys();
  }, []);

  const loadJourneys = async () => {
    try {
      const data = await getItineraries();
      setJourneys(data);
      setFilteredJourneys(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleBooking = (journey) => {
    setSelectedJourney(journey);
    setShowBookingForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PAGE HEADER */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🗺️ Journeys</h1>
          <p className="text-gray-600">Browse and book our curated collection of journeys</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* SEARCH */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <AdvancedSearch journeys={journeys} onFilter={setFilteredJourneys} />
        </div>

        {/* JOURNEYS GRID */}
        {filteredJourneys.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No journeys match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredJourneys.map(journey => (
              <div key={journey.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-pink-300 to-yellow-300"></div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{journey.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{journey.destination}</p>
                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Duration</span>
                      <span className="font-bold text-gray-900">{journey.duration} days</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Difficulty</span>
                      <span className="font-bold text-gray-900">{journey.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price</span>
                      <span className="font-bold text-pink-600">₹{journey.basePrice?.toLocaleString()}</span>
                    </div>
                  </div>
                  <button onClick={() => handleBooking(journey)} className="w-full bg-pink-600 text-white font-bold py-2 rounded-lg hover:bg-pink-700 transition">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showBookingForm && (
        <BookingForm journey={selectedJourney} onClose={() => setShowBookingForm(false)} />
      )}
    </div>
  );
};

export default JourneysPageWithBooking;
