import { useState, useEffect } from 'react';
import { updateSetting, getSetting } from '../../../services/firebaseService';

const WebsiteManager = () => {
  const [settings, setSettings] = useState({
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop',
    heroTitle: 'Explore Experience Enchant',
    heroDescription: 'Every journey is more than just a trip—an immersive experience into the rich heritage and timeless charm of India.',
    ctaButton: 'Start Your Journey',
    banners: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newBanner, setNewBanner] = useState({ image: '', title: '', description: '' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSetting('websiteSettings');
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleBannerChange = (e) => {
    const { name, value } = e.target;
    setNewBanner(prev => ({ ...prev, [name]: value }));
  };

  const addBanner = () => {
    if (newBanner.image && newBanner.title) {
      setSettings(prev => ({
        ...prev,
        banners: [...prev.banners, { ...newBanner, id: Date.now() }]
      }));
      setNewBanner({ image: '', title: '', description: '' });
      setMessage({ type: 'success', text: 'Banner added!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    }
  };

  const removeBanner = (id) => {
    setSettings(prev => ({
      ...prev,
      banners: prev.banners.filter(b => b.id !== id)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSetting('websiteSettings', settings);
      setMessage({ type: 'success', text: '✨ Website settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading settings...</div>;
  }

  return (
    <div className="p-6 max-w-6xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Website Control Panel</h2>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">🏠 Hero Section</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL</label>
                <input type="url" name="heroImage" value={settings.heroImage} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                <input type="text" name="heroTitle" value={settings.heroTitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Description</label>
                <textarea name="heroDescription" value={settings.heroDescription} onChange={handleChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                <input type="text" name="ctaButton" value={settings.ctaButton} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
              {settings.heroImage && (
                <div style={{backgroundImage: `url(${settings.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}} className="w-full h-96 rounded-lg shadow-lg relative">
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex flex-col justify-center items-center text-white text-center p-4">
                    <h2 className="text-3xl font-bold mb-2">{settings.heroTitle}</h2>
                    <p className="text-sm mb-4">{settings.heroDescription}</p>
                    <button style={{ backgroundColor: '#d1356f' }} className="px-6 py-2 rounded-lg font-semibold">{settings.ctaButton}</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Banners Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">📌 Banners</h3>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 border-2 border-dashed border-gray-300">
            <h4 className="font-semibold mb-4 text-gray-700">Add New Banner</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image URL</label>
                <input type="url" name="image" value={newBanner.image} onChange={handleBannerChange} placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Title</label>
                <input type="text" name="title" value={newBanner.title} onChange={handleBannerChange} placeholder="e.g., Summer Offer" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Description</label>
                <textarea name="description" value={newBanner.description} onChange={handleBannerChange} rows="2" placeholder="Banner text..." className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <button onClick={addBanner} style={{ backgroundColor: '#d1356f' }} className="md:col-span-2 w-full text-white font-semibold py-2 rounded-lg hover:opacity-90 transition">+ Add Banner</button>
            </div>
          </div>

          {settings.banners.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {settings.banners.map((banner) => (
                <div key={banner.id}>
                  {banner.image && (
                    <div style={{backgroundImage: `url(${banner.image})`, backgroundSize: 'cover', backgroundPosition: 'center'}} className="w-full h-48 rounded-lg shadow-lg relative mb-2">
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex flex-col justify-center items-center text-white text-center p-4">
                        <h3 className="text-2xl font-bold">{banner.title}</h3>
                        {banner.description && <p className="text-sm mt-2">{banner.description}</p>}
                      </div>
                    </div>
                  )}
                  <button onClick={() => removeBanner(banner.id)} className="text-red-600 text-sm font-medium hover:text-red-800">✕ Remove Banner</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">No banners added yet</p>
          )}
        </div>

        <button onClick={handleSave} disabled={saving} style={{ backgroundColor: '#d1356f' }} className="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Website Settings'}
        </button>
      </div>
    </div>
  );
};

export default WebsiteManager;
