import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function WebsiteSettings() {
  const [settings, setSettings] = useState({
    siteName: 'India Reisen',
    tagline: 'Explore Experience Enchant',
    description: 'Every journey is more than just a trip',
    email: 'team@indiareisen.com',
    phone: '+91 98108 27785',
    address: 'Ghaziabad, Uttar Pradesh, India',
    primaryColor: '#d1356f',
    secondaryColor: '#D4A574',
    aboutText: 'Welcome to India Reisen',
    socialMedia: {
      facebook: { handle: 'indiareisenofficial', url: 'https://facebook.com/indiareisenofficial', enabled: true },
      instagram: { handle: '@indiareisen', url: 'https://instagram.com/indiareisen', enabled: true },
      twitter: { handle: '@IndiaReisen', url: 'https://twitter.com/IndiaReisen', enabled: true },
      youtube: { handle: '@indiareisen', url: 'https://youtube.com/@indiareisen', enabled: true },
      linkedin: { handle: 'india-reisen', url: 'https://linkedin.com/company/india-reisen', enabled: false },
      whatsapp: { handle: '+919810827785', url: 'https://wa.me/919810827785', enabled: true }
    }
  })
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'general')
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setSettings(prev => ({
          ...prev,
          ...docSnap.data()
        }))
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await setDoc(doc(db, 'settings', 'general'), {
        ...settings,
        updatedAt: Timestamp.now()
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleSocialMediaChange = (platform, field, value) => {
    setSettings({
      ...settings,
      socialMedia: {
        ...settings.socialMedia,
        [platform]: {
          ...settings.socialMedia[platform],
          [field]: value
        }
      }
    })
  }

  const toggleSocialMedia = (platform) => {
    setSettings({
      ...settings,
      socialMedia: {
        ...settings.socialMedia,
        [platform]: {
          ...settings.socialMedia[platform],
          enabled: !settings.socialMedia[platform].enabled
        }
      }
    })
  }

  if (loading) return <div>Loading...</div>

  const tabStyle = (tab) => ({
    padding: '10px 20px',
    background: activeTab === tab ? '#d1356f' : '#f0f0f0',
    color: activeTab === tab ? 'white' : '#333',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    borderRadius: '4px 4px 0 0'
  })

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box'
  }

  return (
    <div>
      <h1>Website Settings</h1>
      <p>Configure your website branding, contact information, and social media</p>

      {saved && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '15px', borderRadius: '4px', marginBottom: '20px', fontWeight: 'bold' }}>
          ✓ Settings saved successfully!
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '0', borderBottom: '2px solid #ddd' }}>
        <button style={tabStyle('basic')} onClick={() => setActiveTab('basic')}>📋 Basic Info</button>
        <button style={tabStyle('contact')} onClick={() => setActiveTab('contact')}>📞 Contact</button>
        <button style={tabStyle('colors')} onClick={() => setActiveTab('colors')}>🎨 Colors</button>
        <button style={tabStyle('social')} onClick={() => setActiveTab('social')}>📱 Social Media</button>
      </div>

      <form onSubmit={handleSave} style={{ background: 'white', padding: '30px', borderRadius: '0 0 8px 8px' }}>
        
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div>
            <h2>Basic Information</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Site Name</label>
                <input 
                  type="text" 
                  value={settings.siteName} 
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Tagline</label>
                <input 
                  type="text" 
                  value={settings.tagline} 
                  onChange={(e) => setSettings({...settings, tagline: e.target.value})}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Description</label>
              <textarea 
                value={settings.description} 
                onChange={(e) => setSettings({...settings, description: e.target.value})}
                style={{ ...inputStyle, minHeight: '100px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>About Text</label>
              <textarea 
                value={settings.aboutText} 
                onChange={(e) => setSettings({...settings, aboutText: e.target.value})}
                style={{ ...inputStyle, minHeight: '120px' }}
              />
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div>
            <h2>Contact Information</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email</label>
                <input 
                  type="email" 
                  value={settings.email} 
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Phone</label>
                <input 
                  type="tel" 
                  value={settings.phone} 
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Address</label>
              <input 
                type="text" 
                value={settings.address} 
                onChange={(e) => setSettings({...settings, address: e.target.value})}
                style={inputStyle}
              />
            </div>
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div>
            <h2>Brand Colors</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Primary Color</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="color" 
                    value={settings.primaryColor} 
                    onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                    style={{ width: '60px', height: '40px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                  />
                  <input 
                    type="text" 
                    value={settings.primaryColor} 
                    onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                    style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Secondary Color</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="color" 
                    value={settings.secondaryColor} 
                    onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                    style={{ width: '60px', height: '40px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                  />
                  <input 
                    type="text" 
                    value={settings.secondaryColor} 
                    onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                    style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '20px', background: '#f9f9f9', borderRadius: '4px' }}>
              <h3>Preview</h3>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 'bold' }}>Primary</p>
                  <div style={{ width: '100px', height: '100px', background: settings.primaryColor, borderRadius: '4px' }}></div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 'bold' }}>Secondary</p>
                  <div style={{ width: '100px', height: '100px', background: settings.secondaryColor, borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div>
            <h2>Social Media</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Add or edit your social media handles. These will be displayed throughout your website.</p>

            <div style={{ display: 'grid', gap: '20px' }}>
              {settings.socialMedia && Object.entries(settings.socialMedia).map(([platform, data]) => (
                <div key={platform} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '6px', background: '#f9f9f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, textTransform: 'capitalize' }}>
                      {platform === 'whatsapp' ? 'WhatsApp' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </h3>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={data.enabled} 
                        onChange={() => toggleSocialMedia(platform)}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      />
                      <span>{data.enabled ? 'Enabled' : 'Disabled'}</span>
                    </label>
                  </div>

                  {data.enabled && (
                    <>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Handle</label>
                        <input 
                          type="text" 
                          value={data.handle} 
                          onChange={(e) => handleSocialMediaChange(platform, 'handle', e.target.value)}
                          placeholder={`e.g., @${platform === 'facebook' ? 'yourpage' : platform === 'whatsapp' ? '+91987654321' : 'yourhandle'}`}
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Full URL</label>
                        <input 
                          type="url" 
                          value={data.url} 
                          onChange={(e) => handleSocialMediaChange(platform, 'url', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: '#e7f3ff', borderRadius: '4px' }}>
              <p style={{ margin: 0, color: '#0066cc' }}>
                💡 Tip: Toggle platforms on/off to show/hide them on your website footer and contact page.
              </p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
          <button 
            type="submit"
            style={{ padding: '12px 30px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            💾 Save All Settings
          </button>
        </div>
      </form>
    </div>
  )
}
