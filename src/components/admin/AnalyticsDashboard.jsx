import { useState, useEffect } from 'react';
import { getBookings } from '../../services/bookingService';
import { getItineraries } from '../../services/firebaseService';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    avgBookingValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const bookings = await getBookings();
      const totalBookings = bookings.length;
      const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

      setStats({ totalBookings, totalRevenue, avgBookingValue });
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">📊 Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
          <p className="text-gray-600 text-sm font-semibold mb-2">Total Bookings</p>
          <p className="text-4xl font-bold text-gray-900">{stats.totalBookings}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
          <p className="text-gray-600 text-sm font-semibold mb-2">Revenue</p>
          <p className="text-3xl font-bold text-gray-900">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-600">
          <p className="text-gray-600 text-sm font-semibold mb-2">Avg Booking</p>
          <p className="text-3xl font-bold text-gray-900">₹{(stats.avgBookingValue / 1000).toFixed(0)}k</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue Trend</h3>
        <div className="space-y-3">
          {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, idx) => {
            const revenues = [120000, 145000, 168000, 192000];
            const width = (revenues[idx] / 200000) * 100;
            return (
              <div key={week}>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-700">{week}</span>
                  <span className="font-bold">₹{(revenues[idx] / 1000).toFixed(0)}k</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-yellow-500" style={{ width: `${width}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
