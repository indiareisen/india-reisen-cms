import { useState, useEffect } from 'react';
import { getSetting } from '../../services/firebaseService';
import WebsiteLayout from './WebsiteLayout';

const HomePage = ({ setActiveTab }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSetting('websiteSettings');
      if (data) {
        setSettings(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!settings) {
    return <div className="text-center py-20">No website settings found</div>;
  }

  return (
    <WebsiteLayout setActiveTab={setActiveTab}>
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: `url(${settings.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="relative w-full h-80 md:h-screen"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent flex flex-col justify-center items-start text-white px-4 md:px-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{settings.heroTitle}</h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200">{settings.heroDescription}</p>
            <button
              style={{ backgroundColor: '#d1356f' }}
              className="px-8 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition"
            >
              {settings.ctaButton}
            </button>
          </div>
        </div>
      </div>

      {/* Featured Offers Section */}
      {settings.banners && settings.banners.length > 0 && (
        <div className="py-20 px-4 md:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Offers</h2>
              <p className="text-gray-600">Explore our curated travel experiences</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {settings.banners.map((banner) => (
                <div
                  key={banner.id}
                  style={{
                    backgroundImage: `url(${banner.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  className="relative w-full h-72 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                    {banner.description && <p className="text-sm text-gray-100">{banner.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Explore India?</h2>
          <p className="text-lg mb-8 text-pink-100">Join thousands of travelers experiencing authentic Indian culture and heritage</p>
          <button
            style={{ backgroundColor: '#D4A574' }}
            className="px-8 py-3 rounded-lg font-semibold text-gray-900 hover:opacity-90 transition"
          >
            Start Your Journey
          </button>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default HomePage;
