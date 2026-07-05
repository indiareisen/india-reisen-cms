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
    socialMedia: {},
    homePage: {
      heroTitle: 'Welcome to India Reisen',
      heroSubtitle: 'Explore Experience Enchant',
      heroDescription: 'Discover luxury bespoke journeys into the rich heritage and timeless charm of India.',
      heroCTA: 'Explore Journeys',
      heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
      showStats: true,
      stats: [
        { label: 'Journeys Offered', value: '10+' },
        { label: 'Travelers Served', value: '200+' },
        { label: 'Destinations', value: '15+' },
        { label: 'Local Partners', value: '50+' }
      ],
      ctaHeading: 'Ready to Explore India?',
      ctaText: 'Start your journey with us today.',
      ctaButtonText: 'Browse All Journeys'
    }
  })
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

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
      alert('Error saving settings')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadMessage('Uploading...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'india_reisen')

      const response = await fetch('https://api.cloudinary.com/v1_1/dl1q4dw72/image/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setSettings({
        ...settings,
        homePage: {
          ...settings.homePage,
          heroImage: data.secure_url
        }
      })
      setUploadMessage('✓ Image uploaded successfully!')
      setTimeout(() => setUploadMessage(''), 3000)
    } catch (error) {
      console.error('Error:', error)
      setUploadMessage('✗ Upload failed. Please try again.')
      setTimeout(() => setUploadMessage(''), 3000)
    } finally {
      setUploading(false)
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

  const handleStatChange = (index, field, value) => {
    const newStats = [...settings.homePage.stats]
    newStats[index] = { ...newStats[index], [field]: value }
    setSettings({
      ...settings,
      homePage: {
        ...settings.homePage,
        stats: newStats
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
      <p>Configure your website branding, homepage content, and social media</p>

      {saved && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '15px', borderRadius: '4px', marginBottom: '20px', fontWeight: 'bold' }}>
          ✓ Settings saved successfully!
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '0', borderBottom: '2px solid #ddd', overflowX: 'auto' }}>
        <button style={tabStyle('basic')} onClick={() => setActiveTab('basic')}>📋 Basic Info</button>
        <button style={tabStyle('contact')} onClick={() => setActiveTab('contact')}>📞 Contact</button>
        <button style={tabStyle('colors')} onClick={() => setActiveTab('colors')}>🎨 Colors</button>
        <button style={tabStyle('homepage')} onClick={() => setActiveTab('homepage')}>🏠 Home Page</button>
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

        {/* HomePage Tab */}
        {activeTab === 'homepage' && (
          <div>
            <h2>Home Page Content</h2>

            <h3 style={{ marginTop: '30px', marginBottom: '15px', borderBottom: '2px solid #d1356f', paddingBottom: '10px' }}>Hero Section</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Hero Title</label>
              <input 
                type="text" 
                value={settings.homePage.heroTitle} 
                onChange={(e) => setSettings({...settings, homePage: {...settings.homePage, heroTitle: e.target.value}})}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Hero Subtitle</label>
              <input 
                type="text" 
                value={settings.homePage.heroSubtitle} 
                onChange={(e) => setSettings({...settings, homePage: {...settings.homePage, heroSubtitle: e.target.value}})}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Hero Description</label>
              <textarea 
                value={settings.homePage.heroDescription} 
                onChange={(e) => setSettings({...settings, homePage: {...settings.homePage, heroDescription: e.target.value}})}
                style={{ ...inputStyle, minHeight: '80px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Hero Button Text</label>
              <input 
                type="text" 
                value={settings.homePage.heroCTA} 
                onChange={(e) => setSettings({...settings, homePage: {...settings.homePage, heroCTA: e.target.value}})}
                style={inputStyle}
              />
            </div>

            {/* Hero Image Section */}
            <div style={{ marginBottom: '20px', border: '2px solid #d1356f', padding: '20px', borderRadius: '6px', background: '#f9f9f9' }}>
              <h3 style={{ marginTop: '0' }}>📸 Hero Image</h3>
              
              {uploadMessage && (
                <div style={{
                  background: uploadMessage.includes('✓') ? '#d4edda' : '#f8d7da',
                  color: uploadMessage.includes('✓') ? '#155724' : '#721c24',
                  padding: '10px',
                  borderRadius: '4px',
                  marginBottom: '15px',
                  fontWeight: 'bold'
                }}>
                  {uploadMessage}
                </div>
              )}

              {settings.homePage.heroImage && (
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Current Image:</p>
                  <img src={settings.homePage.heroImage} alt="Hero" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '6px' }} />
                </div>
              )}

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>Upload New Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                />
                <small style={{ color: '#666' }}>Max 5MB. Recommended: 1920x600px or higher</small>
              </div>

              <div style={{ borderTop: '1px solid #ddd', paddingTop: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Or paste Image URL:</label>
                <input 
                  type="url" 
                  value={settings.homePage.heroImage} 
                  onChange={(e) => setSettings({...settings, homePage: {...settings.homePage, heroImage: e.target.value}})}
                  placeholder="https://example.com/image.jpg"
                  style={inputStyle}
                />
              </div>
            </div>

            <h3 style={{ marginTop: '30px', marginBottom: '15px', borderBottom: '2px solid #d1356f', paddingBottom: '10px' }}>About Section</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>About Heading</label>
              <input 
                type="text" 
                value={settings.homePage.aboutHeading || 'Why Choose India Reisen?'} 
                onChange={(e) => setSettings({...settings, homePage: {...settings.homePage, aboutHeading: e.target.value}})}
                style={inputStyle}
              />
            </div>

            <h3 style={{ marginTop: '30px', marginBottom: '15px', borderBottom: '2px solid #d1356f', paddingBottom: '10px' }}>Statistics</h3>
            
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
              {settings.homePage.stats.map((stat, index) => (
                <div key={index} style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Label {index + 1}</label>
                    <input 
                      type="text" 
                      value={stat.label} 
                      onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Value {index + 1}</label>
                    <input 
                      type="text" 
                      value={stat.value} 
                      onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ marginTop: '30px', marginBottom: '15px', borderBottom: '2px solid #d1356f', paddingBottom: '10px' }}>CTA Section</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>CTA Heading</label>
              <input 
                type="text" 
                value={settings.homePage.ctaHeading} 
                onChange={(e) => setSettings({...settings, homePage: {...settings.homePage, ctaHeading: e.target.value}})}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>CTA Description</label>
              <textarea 
                value={settings.homePage.ctaText} 
                onChange={(e) => setSettings({...settings, homePage: {...settings.homePage, ctaText: e.target.value}})}
                style={{ ...inputStyle, minHeight: '80px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>CTA Button Text</label>
              <input 
                type="text" 
                value={settings.homePage.ctaButtonText} 
                onChange={(e) => setSettings({...settings, homePage: {...settings.homePage, ctaButtonText: e.target.value}})}
                style={inputStyle}
              />
            </div>
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div>
            <h2>Social Media</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Add or edit your social media handles.</p>

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
                        style={{ width: '20px', height: '20px' }}
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
          </div>
        )}

        {/* Save Button */}
        <div style={{ marginTop: '30px' }}>
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
