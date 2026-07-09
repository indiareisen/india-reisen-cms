import { Outlet, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebaseService'
import Footer from '../components/Footer'

export default function PublicLayout() {
  const [settings, setSettings] = useState({ primaryColor: '#d1356f' })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'general')
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setSettings(prev => ({
          ...prev,
          ...docSnap.data()
        }))
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        background: settings.primaryColor,
        padding: '20px',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <img src="https://res.cloudinary.com/dl1q4dw72/image/upload/v1781181114/final-logo_fqu772.png" alt="India Reisen" style={{ height: '40px' }} />
          </Link>
          
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
            🏠 Home
          </Link>
          
          <Link to="/journeys" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
            ✈️ Journeys
          </Link>
          
          <Link to="/blog" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
            📝 Blog
          </Link>
          
          <Link to="/contact" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
            📞 Contact
          </Link>
          
          <div style={{ marginLeft: 'auto' }}>
            <Link to="/ir-team-8x2k/login" style={{ color: 'white', textDecoration: 'none', background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }}>
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
