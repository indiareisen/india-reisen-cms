import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function WebsiteSettings() {
  const [settings, setSettings] = useState({
    siteName: 'India Reisen',
    tagline: 'Explore Experience Enchant',
    description: 'Every journey is more than just a trip—it\'s an immersive experience into the rich heritage and timeless charm of India.',
    email: 'team@indiareisen.com',
    phone: '+91 98108 27785',
    address: 'Ghaziabad, Uttar Pradesh, India',
    primaryColor: '#d1356f',
    secondaryColor: '#D4A574',
    facebook: 'indiareisenofficial',
    instagram: '@indiareisen',
    twitter: '@IndiaReisen',
    youtube: '@indiareisen',
    aboutText: 'Welcome to India Reisen - your gateway to authentic Indian experiences.'
  })
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'general')
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setSettings(docSnap.data())
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    try {
      const docRef = doc(db, 'settings', 'general')
      await setDoc(docRef, {
        ...settings,
        updatedAt: Timestamp.now()
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  if (loading) return <div>Loading settings...</div>

  return (
    <div>
      <h1>Website Settings</h1>
      <p>Configure your website branding and contact information</p>

      {saved && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '15px', borderRadius: '4px', marginBottom: '20px', fontWeight: 'bold' }}>
          ✓ Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSaveSettings} style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
        
        {/* Basic Info */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ borderBottom: '2px solid #d1356f', paddingBottom: '10px', marginBottom: '20px' }}>Basic Information</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Site Name</label>
              <input 
                type="text" 
                value={settings.siteName} 
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Tagline</label>
              <input 
                type="text" 
                value={settings.tagline} 
                onChange={(e) => setSettings({...settings, tagline: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Site Description</label>
            <textarea 
              value={settings.description} 
              onChange={(e) => setSettings({...settings, description: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '100px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>About Text</label>
            <textarea 
              value={settings.aboutText} 
              onChange={(e) => setSettings({...settings, aboutText: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '100px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ borderBottom: '2px solid #d1356f', paddingBottom: '10px', marginBottom: '20px' }}>Contact Information</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email</label>
              <input 
                type="email" 
                value={settings.email} 
                onChange={(e) => setSettings({...settings, email: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Phone</label>
              <input 
                type="tel" 
                value={settings.phone} 
                onChange={(e) => setSettings({...settings, phone: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Address</label>
            <input 
              type="text" 
              value={settings.address} 
              onChange={(e) => setSettings({...settings, address: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Branding */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ borderBottom: '2px solid #d1356f', paddingBottom: '10px', marginBottom: '20px' }}>Brand Colors</h2>
          
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
        </div>

        {/* Social Media */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ borderBottom: '2px solid #d1356f', paddingBottom: '10px', marginBottom: '20px' }}>Social Media Handles</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Facebook</label>
              <input 
                type="text" 
                value={settings.facebook} 
                onChange={(e) => setSettings({...settings, facebook: e.target.value})}
                placeholder="facebook handle"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Instagram</label>
              <input 
                type="text" 
                value={settings.instagram} 
                onChange={(e) => setSettings({...settings, instagram: e.target.value})}
                placeholder="@instagram"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Twitter/X</label>
              <input 
                type="text" 
                value={settings.twitter} 
                onChange={(e) => setSettings({...settings, twitter: e.target.value})}
                placeholder="@twitter"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>YouTube</label>
              <input 
                type="text" 
                value={settings.youtube} 
                onChange={(e) => setSettings({...settings, youtube: e.target.value})}
                placeholder="@youtube"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          style={{ padding: '12px 30px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
        >
          💾 Save All Settings
        </button>
      </form>
    </div>
  )
}
