import { useState, useEffect } from 'react';
import { getSetting } from '../../services/firebaseService';

const HomePage = () => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: `url(${settings.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="relative w-full h-96 md:h-screen"
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{settings.heroTitle}</h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl">{settings.heroDescription}</p>
          <button
            style={{ backgroundColor: '#d1356f' }}
            className="px-8 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition"
          >
            {settings.ctaButton}
          </button>
        </div>
      </div>

      {/* Banners Section */}
      {settings.banners && settings.banners.length > 0 && (
        <div className="py-12 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settings.banners.map((banner) => (
                <div
                  key={banner.id}
                  style={{
                    backgroundImage: `url(${banner.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
                >
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-white text-center p-4">
                    <h3 className="text-2xl font-bold">{banner.title}</h3>
                    {banner.description && <p className="text-sm mt-2">{banner.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore India?</h2>
          <p className="text-lg mb-8">Join thousands of travelers experiencing authentic Indian culture</p>
          <button
            style={{ backgroundColor: '#D4A574' }}
            className="px-8 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition text-gray-800"
          >
            Start Planning
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
