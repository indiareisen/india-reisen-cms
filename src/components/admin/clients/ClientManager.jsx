import { useState, useEffect } from 'react';
import { getBookings } from '../../../services/bookingService';

const ClientManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📅 Bookings</h1>
        <p className="text-gray-600 mt-2">Manage customer bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-gray-600">No bookings yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b-2">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Guest</th>
                <th className="px-4 py-3 text-left font-bold">Journey</th>
                <th className="px-4 py-3 text-left font-bold">Email</th>
                <th className="px-4 py-3 text-left font-bold">Travelers</th>
                <th className="px-4 py-3 text-left font-bold">Price</th>
                <th className="px-4 py-3 text-left font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold">{b.guestName}</td>
                  <td className="px-4 py-3">{b.journeyTitle}</td>
                  <td className="px-4 py-3">{b.email}</td>
                  <td className="px-4 py-3">{b.travelers}</td>
                  <td className="px-4 py-3 font-bold text-pink-600">₹{Math.round(b.totalPrice).toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-semibold ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientManager;
