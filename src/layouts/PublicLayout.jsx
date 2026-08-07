import { Outlet, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebaseService'
import Footer from '../components/Footer'
import useNewsletter from '../hooks/useNewsletter'

function useExitIntent(enabled) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!enabled) return
    if (sessionStorage.getItem('exitIntentShown')) return
    let armed = false
    const armTimer = setTimeout(() => { armed = true }, 4000) // avoid triggering instantly on page load
    const handler = (e) => {
      if (armed && e.clientY <= 0) {
        setShow(true)
        sessionStorage.setItem('exitIntentShown', '1')
        document.removeEventListener('mouseout', handler)
      }
    }
    document.addEventListener('mouseout', handler)
    return () => { clearTimeout(armTimer); document.removeEventListener('mouseout', handler) }
  }, [enabled])
  return [show, setShow]
}
export default function PublicLayout() {
  const [settings, setSettings] = useState({ primaryColor: '#d1356f' })
  const [showExitPopup, setShowExitPopup] = useExitIntent(true)
  const [popupEmail, setPopupEmail] = useState('')
  const [popupStatus, setPopupStatus] = useState('idle') // idle | loading | done | error
  const { subscribeToNewsletter } = useNewsletter()

  const handlePopupSubscribe = async (e) => {
    e.preventDefault()
    setPopupStatus('loading')
    try {
      await subscribeToNewsletter(popupEmail, '')
      setPopupStatus('done')
    } catch (err) {
      setPopupStatus('error')
    }
  }

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
        padding: '28px 20px',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '45px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <img src="https://res.cloudinary.com/dl1q4dw72/image/upload/v1781181114/final-logo_fqu772.png" alt="India Reisen" style={{ height: '58px' }} />
          </Link>
          
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '17px' }}>
            🏠 Home
          </Link>
          
          <Link to="/journeys" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '17px' }}>
            ✈️ Journeys
          </Link>
          
          <Link to="/blog" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '17px' }}>
            📝 Blog
          </Link>
          
          <Link to="/contact" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '17px' }}>
            📞 Contact
          </Link>
          
        </div>
      </nav>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />

      {showExitPopup && (
        <div
          onClick={() => setShowExitPopup(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(20,14,12,0.6)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: '14px', maxWidth: '420px', width: '100%', padding: '36px 32px', textAlign: 'center', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
          >
            <button
              onClick={() => setShowExitPopup(false)}
              style={{ position: 'absolute', top: '14px', right: '14px', border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#8a7a6d' }}
            >×</button>

            {popupStatus === 'done' ? (
              <>
                <p style={{ fontSize: '32px', margin: '0 0 12px 0' }}>✓</p>
                <h3 style={{ margin: '0 0 8px 0', color: settings.primaryColor }}>You're on the list!</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Watch your inbox for travel inspiration and offers.</p>
              </>
            ) : (
              <>
                <h3 style={{ margin: '0 0 10px 0', color: settings.primaryColor, fontSize: '22px' }}>Before you go...</h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#666', lineHeight: 1.6 }}>
                  Join our list for exclusive journey offers and travel inspiration from across India, Nepal, Bhutan, Tibet, and Sri Lanka.
                </p>
                <form onSubmit={handlePopupSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={popupEmail}
                    onChange={(e) => setPopupEmail(e.target.value)}
                    style={{ padding: '12px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                  />
                  <button
                    type="submit"
                    disabled={popupStatus === 'loading'}
                    style={{ padding: '12px', background: settings.primaryColor, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: popupStatus === 'loading' ? 'not-allowed' : 'pointer' }}
                  >
                    {popupStatus === 'loading' ? 'Subscribing…' : 'Keep Me Inspired'}
                  </button>
                  {popupStatus === 'error' && <p style={{ margin: 0, fontSize: '12.5px', color: '#b3423f' }}>Something went wrong — please try again.</p>}
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {settings.phone && (
        <a
          href={`https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi! I\'d like to know more about your journeys.')}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 999,
            width: '58px', height: '58px', borderRadius: '50%', background: '#25D366',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)', textDecoration: 'none'
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
            <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7-1.87-1.87-4.36-2.94-7-2.94zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.65.81-.79.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.42 1.02 2.59.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z"/>
          </svg>
        </a>
      )}
    </div>
  )
}
