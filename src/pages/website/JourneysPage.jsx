import { useState, useEffect } from 'react';
import { getItineraries } from '../../services/firebaseService';

const JourneysPage = () => {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJourneys();
  }, []);

  const loadJourneys = async () => {
    try {
      const data = await getItineraries();
      setJourneys(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading journeys:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading journeys...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Journeys</h1>

        {journeys.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No journeys available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeys.map((journey) => (
              <div key={journey.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                {journey.image && (
                  <img src={journey.image} alt={journey.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{journey.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{journey.description?.substring(0, 100)}...</p>
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#d1356f' }} className="font-semibold">
                      ₹{journey.price || 'Contact'}
                    </span>
                    <button
                      style={{ backgroundColor: '#d1356f' }}
                      className="px-4 py-2 text-white rounded-lg font-semibold hover:opacity-90 transition"
                    >
                      Learn More
                    </button>
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

export default JourneysPage;
