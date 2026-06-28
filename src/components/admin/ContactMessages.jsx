import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading messages...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Contact Messages</h2>

      {messages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white p-6 rounded-lg shadow-lg border-l-4" style={{ borderLeftColor: '#d1356f' }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{msg.name}</h3>
                  <p className="text-sm text-gray-600">{msg.email}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {msg.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
                </span>
              </div>

              {msg.phone && (
                <p className="text-sm text-gray-700 mb-2">📱 {msg.phone}</p>
              )}

              {/* Validation Status */}
              <div className="flex gap-3 mb-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded ${msg.emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  Email: {msg.emailVerified ? '✓ Verified' : '⏳ Unverified'}
                </span>
                {msg.phone && (
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${msg.phoneVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    Phone: {msg.phoneVerified ? '✓ Verified' : '⏳ Unverified'}
                  </span>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-800">{msg.message}</p>
              </div>

              <button 
                onClick={() => window.open(`mailto:${msg.email}`)}
                style={{ backgroundColor: '#d1356f' }}
                className="px-4 py-2 text-white rounded-lg text-sm font-semibold hover:opacity-90"
              >
                Reply via Email
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
