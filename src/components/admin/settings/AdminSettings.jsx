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
  const [expandedSection, setExpandedSection] = useState('company');

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
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Loading settings...</div>;
  }

  const sections = [
    { id: 'company', label: '🏢 Company Info', icon: '🏢' },
    { id: 'brand', label: '🎨 Brand Colors', icon: '🎨' },
    { id: 'social', label: '📱 Social Media', icon: '📱' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', padding: '2rem', minHeight: '100vh', backgroundColor: '#f8f8f8' }}>
      {/* Sidebar Navigation */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', height: 'fit-content', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#666', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sections.map(section => (
            <button key={section.id} onClick={() => setExpandedSection(section.id)} style={{ padding: '0.75rem 1rem', textAlign: 'left', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: expandedSection === section.id ? '600' : '500', backgroundColor: expandedSection === section.id ? '#d1356f' : 'transparent', color: expandedSection === section.id ? 'white' : '#333', transition: 'all 0.3s' }}>
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#333', marginBottom: '0.5rem' }}>⚙️ Admin Settings</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Manage your brand identity and company information</p>
        </div>

        {message.text && (
          <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '2rem', fontSize: '14px', backgroundColor: message.type === 'success' ? '#e8f5e9' : '#ffebee', color: message.type === 'success' ? '#2e7d32' : '#c62828', border: `1px solid ${message.type === 'success' ? '#c8e6c9' : '#ffcdd2'}` }}>
            {message.text}
          </div>
        )}

        {/* Company Information Section */}
        {expandedSection === 'company' && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#333', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #d1356f' }}>🏢 Company Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Company Name</label>
                <input type="text" name="companyName" value={settings.companyName} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Tagline</label>
                <input type="text" name="tagline" value={settings.tagline} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Email</label>
                <input type="email" name="email" value={settings.email} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Phone</label>
                <input type="tel" name="phone" value={settings.phone} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Website</label>
                <input type="url" name="website" value={settings.website} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Logo URL</label>
                <input type="url" name="logo" value={settings.logo} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            </div>
            {settings.logo && <img src={settings.logo} alt="Logo" style={{ height: '50px', marginBottom: '1.5rem' }} />}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Address</label>
              <textarea name="address" value={settings.address} onChange={handleChange} rows="3" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
          </div>
        )}

        {/* Brand Colors Section */}
        {expandedSection === 'brand' && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#333', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #D4A574' }}>🎨 Brand Colors</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '1rem', textTransform: 'uppercase' }}>Primary Color</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input type="color" name="primaryColor" value={settings.primaryColor} onChange={handleChange} style={{ width: '80px', height: '80px', borderRadius: '8px', cursor: 'pointer', border: 'none' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{settings.primaryColor}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '0.5rem' }}>Pink/Magenta</div>
                  </div>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '1rem', textTransform: 'uppercase' }}>Accent Color</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input type="color" name="accentColor" value={settings.accentColor} onChange={handleChange} style={{ width: '80px', height: '80px', borderRadius: '8px', cursor: 'pointer', border: 'none' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{settings.accentColor}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '0.5rem' }}>Gold</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '2rem', height: '120px', borderRadius: '8px', backgroundImage: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.accentColor} 100%)` }} />
          </div>
        )}

        {/* Social Media Section */}
        {expandedSection === 'social' && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#333', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #d1356f' }}>📱 Social Media Links</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>📸 Instagram</label>
                <input type="url" name="instagram" value={settings.instagram} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>👥 Facebook</label>
                <input type="url" name="facebook" value={settings.facebook} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>𝕏 Twitter / X</label>
                <input type="url" name="twitter" value={settings.twitter} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>▶️ YouTube</label>
                <input type="url" name="youtube" value={settings.youtube} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <button onClick={handleSave} disabled={saving} style={{ marginTop: '2rem', width: '100%', padding: '1rem', backgroundColor: settings.primaryColor, color: 'white', fontWeight: '700', fontSize: '16px', border: 'none', borderRadius: '8px', cursor: 'pointer', opacity: saving ? 0.6 : 1, transition: 'opacity 0.3s' }}>
          {saving ? '💾 Saving...' : '💾 Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
