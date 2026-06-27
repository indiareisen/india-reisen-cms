import { useState, useEffect } from 'react';
import { getItineraries, getReviews, getTeamMembers } from '../../services/firebaseService';

const EnhancedDashboard = () => {
  const [stats, setStats] = useState({
    journeys: 0,
    reviews: 0,
    teamMembers: 0,
    bookings: 47,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const journeys = await getItineraries();
      const reviews = await getReviews();
      const team = await getTeamMembers();
      
      setStats(prev => ({
        ...prev,
        journeys: journeys.length,
        reviews: reviews.length,
        teamMembers: team.length,
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50">
      <div style={{ background: 'linear-gradient(135deg, #d1356f 0%, #D4A574 100%)' }} className="text-white rounded-2xl p-12 shadow-xl">
        <h1 className="text-4xl font-bold mb-2">Welcome to India Reisen 🌍</h1>
        <p className="text-lg opacity-95">Your business dashboard</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4" style={{ borderLeftColor: '#d1356f' }}>
            <p className="text-gray-600 text-sm font-semibold mb-2">Active Journeys</p>
            <p className="text-5xl font-bold text-gray-900">{stats.journeys}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4" style={{ borderLeftColor: '#D4A574' }}>
            <p className="text-gray-600 text-sm font-semibold mb-2">Reviews</p>
            <p className="text-5xl font-bold text-gray-900">{stats.reviews}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4" style={{ borderLeftColor: '#9C27B0' }}>
            <p className="text-gray-600 text-sm font-semibold mb-2">Team Members</p>
            <p className="text-5xl font-bold text-gray-900">{stats.teamMembers}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4" style={{ borderLeftColor: '#1976D2' }}>
            <p className="text-gray-600 text-sm font-semibold mb-2">Bookings</p>
            <p className="text-5xl font-bold text-gray-900">{stats.bookings}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Revenue</h3>
        <div className="space-y-4">
          {['June', 'May', 'April', 'March'].map((month, idx) => {
            const widths = [85, 72, 65, 58];
            return (
              <div key={month}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">{month}</span>
                  <span className="font-bold">₹{(widths[idx] * 5000).toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600" style={{ width: `${widths[idx]}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
