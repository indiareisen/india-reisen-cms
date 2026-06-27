import { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import PublicWebsite from './pages/PublicWebsiteV2';
import Login from './components/auth/Login';
import { subscribeToAuthChanges } from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    setUser(null);
    setShowAdmin(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Show login if in admin and not authenticated
  if (showAdmin && !user) {
    return <Login />;
  }

  // Show admin dashboard if authenticated and showAdmin is true
  if (showAdmin && user) {
    return (
      <div className="relative">
        <AdminDashboard onLogout={handleLogout} />
        <button
          onClick={() => setShowAdmin(false)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition z-50"
        >
          ← Back to Website
        </button>
      </div>
    );
  }

  // Show public website
  return (
    <div className="relative">
      <PublicWebsite />
      <button
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-6 right-6 bg-pink-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-700 transition z-50"
        title="Go to Admin Panel"
      >
        🔐 Admin
      </button>
    </div>
  );
}

export default App;
