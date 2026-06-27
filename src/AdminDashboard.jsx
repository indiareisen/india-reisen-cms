import { useState } from 'react';
import EnhancedDashboard from './components/admin/EnhancedDashboard';
import ItineraryManager from './components/admin/itineraries/ItineraryManager';
import AnalyticsDashboard from './components/admin/AnalyticsDashboard';
import ClientManager from './components/admin/clients/ClientManager';
import AdminSettings from './components/admin/settings/AdminSettings';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <EnhancedDashboard />;
      case 'journeys': return <ItineraryManager />;
      case 'analytics': return <AnalyticsDashboard />;
      case 'bookings': return <ClientManager />;
      case 'settings': return <AdminSettings />;
      default: return <EnhancedDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ background: `linear-gradient(135deg, #d1356f, #D4A574)` }} className="text-white px-4 shadow-lg sticky top-0 z-50">
        <div style={{ height: '44px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Logo - FIXED SIZE */}
          <div style={{ width: '32px', height: '32px', flexShrink: 0, overflow: 'hidden' }}>
            <img 
              src="https://res.cloudinary.com/dl1q4dw72/image/upload/c_scale,w_32/v1781181114/final-logo_fqu772.png" 
              alt="Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <span className="text-xs font-bold">Admin</span>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1px', marginLeft: 'auto', marginRight: 'auto' }}>
            {[
              { id: 'dashboard', label: '📊' },
              { id: 'analytics', label: '📈' },
              { id: 'journeys', label: '🗺️' },
              { id: 'bookings', label: '📅' },
              { id: 'settings', label: '⚙️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="text-sm transition hover:opacity-80"
                style={{ 
                  padding: '4px 5px',
                  borderRadius: '3px',
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Logout */}
          <button 
            onClick={onLogout}
            style={{
              background: 'white',
              color: '#d1356f',
              border: 'none',
              padding: '4px 10px',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer',
              flexShrink: 0,
              marginLeft: 'auto'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
