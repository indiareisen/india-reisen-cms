import { useState, useEffect } from 'react';
import { updateSetting, getSetting } from '../../../services/firebaseService';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    companyName: 'India Reisen',
    tagline: 'Explore Experience Enchant',
    email: 'team@indiareisen.com',
    phone: '+91 98108 27785',
    address: '',
    website: 'www.indiareisen.com',
    logo: 'https://res.cloudinary.com/dl1q4dw72/image/upload/v1781181114/final-logo_fqu772.png',
    primaryColor: '#d1356f',
    accentColor: '#D4A574',
    instagram: 'https://instagram.com/indiareisen',
    facebook: 'https://facebook.com/indiareisen',
    twitter: 'https://twitter.com/indiareisen',
    youtube: 'https://youtube.com/indiareisen',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSetting('companySettings');
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

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSetting('companySettings', settings);
      setMessage({ type: 'success', text: '✨ Settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading settings...</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Settings</h1>
        <p className="text-gray-600">Manage your brand identity and company information</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {/* Company Information */}
        <div className="border-t-4 pt-6" style={{ borderTopColor: settings.primaryColor }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
              <input type="text" name="companyName" value={settings.companyName} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tagline</label>
              <input type="text" name="tagline" value={settings.tagline} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" name="email" value={settings.email} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <input type="tel" name="phone" value={settings.phone} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
              <input type="url" name="website" value={settings.website} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Logo URL</label>
              <input type="url" name="logo" value={settings.logo} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500" />
              {settings.logo && <img src={settings.logo} alt="Logo" className="mt-3 h-12" />}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <textarea name="address" value={settings.address} onChange={handleChange} rows="3" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500" />
            </div>
          </div>
        </div>

        {/* Brand Colors */}
        <div className="border-t-4 pt-6" style={{ borderTopColor: settings.accentColor }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Brand Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Color</label>
              <div className="flex gap-3">
                <input type="color" name="primaryColor" value={settings.primaryColor} onChange={handleChange} className="h-12 w-20 rounded-lg cursor-pointer" />
                <input type="text" value={settings.primaryColor} disabled className="flex-1 px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-600 font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Accent Color</label>
              <div className="flex gap-3">
                <input type="color" name="accentColor" value={settings.accentColor} onChange={handleChange} className="h-12 w-20 rounded-lg cursor-pointer" />
                <input type="text" value={settings.accentColor} disabled className="flex-1 px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-600 font-mono" />
              </div>
            </div>
            <div className="md:col-span-2 h-20 rounded-lg" style={{ backgroundImage: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.accentColor} 100%)` }} />
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t-4 pt-6" style={{ borderTopColor: settings.primaryColor }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram</label>
              <input type="url" name="instagram" value={settings.instagram} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook</label>
              <input type="url" name="facebook" value={settings.facebook} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter / X</label>
              <input type="url" name="twitter" value={settings.twitter} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube</label>
              <input type="url" name="youtube" value={settings.youtube} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button onClick={handleSave} disabled={saving} style={{ backgroundColor: settings.primaryColor }} className="w-full py-4 text-white font-bold text-lg rounded-lg hover:opacity-90 transition disabled:opacity-50">
          {saving ? 'Saving...' : '💾 Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
