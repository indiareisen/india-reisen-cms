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
    facebook: 'indiareisenofficial',
    instagram: '@indiareisen',
    twitter: '@IndiaReisen',
    youtube: '@indiareisen'
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
        setSettings({...settings, ...docSnap.data()})
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

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Website Settings</h1>
      {saved && <div style={{ background: '#d4edda', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>Settings saved!</div>}
      
      <form onSubmit={handleSave} style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2>Basic Info</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Site Name</label>
              <input type="text" value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Tagline</label>
              <input type="text" value={settings.tagline} onChange={(e) => setSettings({...settings, tagline: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Description</label>
            <textarea value={settings.description} onChange={(e) => setSettings({...settings, description: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '100px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2>Contact</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Email</label>
              <input type="email" value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Phone</label>
              <input type="tel" value={settings.phone} onChange={(e) => setSettings({...settings, phone: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Address</label>
            <input type="text" value={settings.address} onChange={(e) => setSettings({...settings, address: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2>Colors</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Primary</label>
              <input type="color" value={settings.primaryColor} onChange={(e) => setSettings({...settings, primaryColor: e.target.value})} style={{ width: '100%', height: '40px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Secondary</label>
              <input type="color" value={settings.secondaryColor} onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})} style={{ width: '100%', height: '40px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        <button type="submit" style={{ padding: '12px 30px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Save Settings
        </button>
      </form>
    </div>
  )
}
