import { Outlet, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebaseService'
import Footer from '../components/Footer'

// Loaded once here, at the top of the whole public site, so it persists
// across every route instead of being torn down and reinitialized on each
// page — that was the root cause of unreliable translation on JourneyDetail.
function useGoogleTranslate() {
  const loaded = useRef(false)
  useEffect(() => {
    if (loaded.current || window.google?.translate) return
    loaded.current = true

    window.googleTranslateElementInit = function () {
      // eslint-disable-next-line no-new
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', autoDisplay: false, layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
        'google_translate_element'
      )
    }
    const script = document.createElement('script')
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)
  }, [])
}

// Google injects a fixed top banner and shifts <body> down when translation
// activates. Keep forcing it closed so the site layout never jumps.
function useHideGoogleBanner() {
  useEffect(() => {
    const hide = () => {
      document.body.style.top = '0px'
      document.querySelectorAll('.goog-te-banner-frame, iframe.skiptranslate').forEach(el => {
        el.style.display = 'none'
        el.style.visibility = 'hidden'
        el.style.height = '0'
      })
    }
    hide()
    const interval = setInterval(hide, 400)
    return () => clearInterval(interval)
  }, [])
}

export default function PublicLayout() {
  const [settings, setSettings] = useState({ primaryColor: '#d1356f' })
  useGoogleTranslate()
  useHideGoogleBanner()

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

          <div id="google_translate_element" style={{ marginLeft: 'auto' }}></div>
          
        </div>
      </nav>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />

      <style>{`
        #google_translate_element .goog-te-gadget { font-family: inherit; font-size: 0 !important; }
        #google_translate_element .goog-te-gadget-simple {
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.4) !important; border-radius: 999px !important;
          padding: 6px 12px !important; display: inline-flex; align-items: center;
        }
        #google_translate_element .goog-te-gadget-simple span { font-size: 12px !important; color: #fff !important; }
        #google_translate_element img { display: none !important; }
        body > .skiptranslate { display: none !important; }
        .goog-te-banner-frame, .goog-te-banner-frame.skiptranslate, iframe.skiptranslate {
          display: none !important; visibility: hidden !important; height: 0 !important;
        }
        body { top: 0px !important; position: static !important; }
      `}</style>
    </div>
  )
}
