import { useState, useEffect } from 'react';
import { getItineraries } from '../services/firebaseService';

const JourneysPage = () => {
  const [journeys, setJourneys] = useState([]);
  const [filteredJourneys, setFilteredJourneys] = useState([]);
  const [filters, setFilters] = useState({ destination: '', difficulty: '', priceRange: 100000 });

  useEffect(() => {
    loadJourneys();
  }, []);

  useEffect(() => {
    filterJourneys();
  }, [journeys, filters]);

  const loadJourneys = async () => {
    try {
      const data = await getItineraries();
      setJourneys(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filterJourneys = () => {
    let filtered = journeys;
    if (filters.destination) {
      filtered = filtered.filter(j => j.destination?.toLowerCase().includes(filters.destination.toLowerCase()));
    }
    if (filters.difficulty) {
      filtered = filtered.filter(j => j.difficulty === filters.difficulty);
    }
    filtered = filtered.filter(j => j.basePrice <= filters.priceRange);
    setFilteredJourneys(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ background: `linear-gradient(135deg, #d1356f 0%, #D4A574 100%)` }} className="text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Explore Our Journeys</h1>
          <p className="text-lg opacity-95">Choose from {journeys.length} amazing adventures</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Filters</h3>
          <div className="space-y-6">
            <input type="text" name="destination" value={filters.destination} onChange={handleFilterChange} placeholder="Destination..." className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg" />
            <select name="difficulty" value={filters.difficulty} onChange={handleFilterChange} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg">
              <option value="">All Levels</option>
              <option>Easy</option>
              <option>Moderate</option>
              <option>Challenging</option>
            </select>
            <input type="range" name="priceRange" min="10000" max="200000" step="10000" value={filters.priceRange} onChange={handleFilterChange} className="w-full" />
          </div>
        </div>

        <div className="lg:col-span-3">
          {filteredJourneys.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <p className="text-gray-600">No journeys found. Try creating one in the admin panel!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJourneys.map(journey => (
                <div key={journey.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl">
                  <div className="h-48 bg-gradient-to-br from-pink-400 to-yellow-400 flex items-center justify-center text-6xl">🗺️</div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{journey.title}</h3>
                    <p className="text-gray-600 mb-4">{journey.destination}</p>
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div>📅 {journey.duration} Days</div>
                      <div>📊 {journey.difficulty}</div>
                      <div>💰 ₹{journey.basePrice?.toLocaleString()}</div>
                    </div>
                    <button className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700">
                      Learn More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JourneysPage;
